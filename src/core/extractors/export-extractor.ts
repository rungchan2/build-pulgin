import ts from 'typescript';
import type { ExportInfo } from '../types';

/**
 * export 문에서 정보를 추출하는 클래스
 */
export class ExportExtractor {
  /**
   * SourceFile에서 모든 export 정보 추출
   */
  extract(sourceFile: ts.SourceFile): ExportInfo[] {
    const exports: ExportInfo[] = [];

    ts.forEachChild(sourceFile, (node) => {
      const exportInfos = this.extractFromNode(node, sourceFile);
      exports.push(...exportInfos);
    });

    return exports;
  }

  /**
   * 노드에서 export 정보 추출
   */
  private extractFromNode(
    node: ts.Node,
    sourceFile: ts.SourceFile
  ): ExportInfo[] {
    const results: ExportInfo[] = [];

    // export function
    if (ts.isFunctionDeclaration(node) && this.hasExportModifier(node)) {
      results.push({
        name: node.name?.text || 'anonymous',
        isDefault: this.hasDefaultModifier(node),
        isTypeOnly: false,
        kind: 'function',
      });
    }

    // export class
    if (ts.isClassDeclaration(node) && this.hasExportModifier(node)) {
      results.push({
        name: node.name?.text || 'anonymous',
        isDefault: this.hasDefaultModifier(node),
        isTypeOnly: false,
        kind: 'class',
      });
    }

    // export const/let/var
    if (ts.isVariableStatement(node) && this.hasExportModifier(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          results.push({
            name: declaration.name.text,
            isDefault: false,
            isTypeOnly: false,
            kind: 'variable',
          });
        }
      }
    }

    // export type
    if (ts.isTypeAliasDeclaration(node) && this.hasExportModifier(node)) {
      results.push({
        name: node.name.text,
        isDefault: false,
        isTypeOnly: true,
        kind: 'type',
      });
    }

    // export interface
    if (ts.isInterfaceDeclaration(node) && this.hasExportModifier(node)) {
      results.push({
        name: node.name.text,
        isDefault: false,
        isTypeOnly: true,
        kind: 'interface',
      });
    }

    // export default expression
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      const name = this.getExportDefaultName(node, sourceFile);
      results.push({
        name,
        isDefault: true,
        isTypeOnly: false,
        kind: 'variable',
      });
    }

    // export { name } re-export
    if (ts.isExportDeclaration(node)) {
      const exportClause = node.exportClause;
      if (exportClause && ts.isNamedExports(exportClause)) {
        for (const element of exportClause.elements) {
          results.push({
            name: element.name.text,
            isDefault: false,
            isTypeOnly: node.isTypeOnly,
            kind: 'variable',
          });
        }
      }
    }

    return results;
  }

  /**
   * export 키워드가 있는지 확인
   */
  private hasExportModifier(node: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(node)
      ? ts.getModifiers(node)
      : undefined;

    return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false;
  }

  /**
   * default 키워드가 있는지 확인
   */
  private hasDefaultModifier(node: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(node)
      ? ts.getModifiers(node)
      : undefined;

    return modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) || false;
  }

  /**
   * export default의 이름 추출
   */
  private getExportDefaultName(
    node: ts.ExportAssignment,
    _sourceFile: ts.SourceFile
  ): string {
    const expr = node.expression;

    if (ts.isIdentifier(expr)) {
      return expr.text;
    }

    if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
      return 'default';
    }

    // export default memo(Component) 패턴
    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
      const firstArg = expr.arguments[0];
      if (firstArg && ts.isIdentifier(firstArg)) {
        return firstArg.text;
      }
    }

    return 'default';
  }
}

export const exportExtractor = new ExportExtractor();
