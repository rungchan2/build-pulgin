import * as path from 'path';
import type { ParsedFile, TableColumn } from '../types';

interface ParsedTable {
  name: string;
  columns: TableColumn[];
}

/**
 * SQL 마이그레이션 파일 파서
 */
export class SQLParser {
  /**
   * SQL 파일 파싱
   */
  parse(content: string, relativePath: string): ParsedFile {
    const tables = this.extractTables(content);
    const tableName = tables[0]?.name || this.extractNameFromPath(relativePath);

    return {
      path: relativePath,
      type: 'table',
      name: tableName,
      imports: [],
      exports: tables.map((t) => ({
        name: t.name,
        isDefault: false,
        isTypeOnly: false,
        kind: 'variable' as const,
      })),
      metadata: {
        tableName,
        columns: tables[0]?.columns || [],
      },
    };
  }

  /**
   * CREATE TABLE 문에서 테이블 정보 추출
   */
  private extractTables(content: string): ParsedTable[] {
    const tables: ParsedTable[] = [];

    // CREATE TABLE 문 파싱
    const createTableRegex =
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s*\(([\s\S]*?)\);/gi;

    let match;
    while ((match = createTableRegex.exec(content)) !== null) {
      const tableName = match[1];
      const columnsBlock = match[2];
      const columns = this.parseColumns(columnsBlock);

      tables.push({ name: tableName, columns });
    }

    // ALTER TABLE로 추가된 컬럼도 처리
    const alterTableRegex =
      /ALTER\s+TABLE\s+["']?(\w+)["']?\s+ADD\s+(?:COLUMN\s+)?["']?(\w+)["']?\s+(\w+)/gi;

    while ((match = alterTableRegex.exec(content)) !== null) {
      const tableName = match[1];
      const columnName = match[2];
      const columnType = match[3];

      let table = tables.find((t) => t.name === tableName);
      if (!table) {
        table = { name: tableName, columns: [] };
        tables.push(table);
      }

      table.columns.push({
        name: columnName,
        type: columnType,
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false,
      });
    }

    return tables;
  }

  /**
   * 컬럼 정의 파싱
   */
  private parseColumns(columnsBlock: string): TableColumn[] {
    const columns: TableColumn[] = [];

    // 컬럼 정의 라인 분리 (CONSTRAINT는 제외)
    const lines = columnsBlock
      .split(',')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line &&
          !line.toUpperCase().startsWith('CONSTRAINT') &&
          !line.toUpperCase().startsWith('PRIMARY KEY') &&
          !line.toUpperCase().startsWith('FOREIGN KEY') &&
          !line.toUpperCase().startsWith('UNIQUE') &&
          !line.toUpperCase().startsWith('CHECK')
      );

    for (const line of lines) {
      const column = this.parseColumnDefinition(line);
      if (column) {
        columns.push(column);
      }
    }

    return columns;
  }

  /**
   * 단일 컬럼 정의 파싱
   */
  private parseColumnDefinition(line: string): TableColumn | null {
    const match = line.match(/^["']?(\w+)["']?\s+(\w+(?:\([^)]+\))?)/i);
    if (!match) return null;

    const [, name, type] = match;
    const upperLine = line.toUpperCase();

    return {
      name,
      type: type.toUpperCase(),
      nullable: !upperLine.includes('NOT NULL'),
      isPrimaryKey: upperLine.includes('PRIMARY KEY'),
      isForeignKey: upperLine.includes('REFERENCES'),
      references: this.extractReference(line),
    };
  }

  /**
   * REFERENCES 절에서 참조 정보 추출
   */
  private extractReference(
    line: string
  ): TableColumn['references'] | undefined {
    const match = line.match(
      /REFERENCES\s+["']?(\w+)["']?\s*\(["']?(\w+)["']?\)/i
    );
    if (!match) return undefined;

    return {
      table: match[1],
      column: match[2],
    };
  }

  /**
   * 파일 경로에서 테이블 이름 추출
   */
  private extractNameFromPath(filePath: string): string {
    const filename = path.basename(filePath);
    // 마이그레이션 파일명에서 테이블명 추출
    // 예: 20240101_create_users_table.sql -> users
    const match = filename.match(/create_(\w+)_table/i);
    return match ? match[1] : filename.replace('.sql', '');
  }
}

export const sqlParser = new SQLParser();
