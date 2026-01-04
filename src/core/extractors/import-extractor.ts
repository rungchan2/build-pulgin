import ts from 'typescript';
import type { ImportInfo } from '../types';

/**
 * import 문에서 정보를 추출하는 클래스
 */
export class ImportExtractor {
  /**
   * SourceFile에서 모든 import 정보 추출
   */
  extract(sourceFile: ts.SourceFile): ImportInfo[] {
    const imports: ImportInfo[] = [];

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isImportDeclaration(node)) {
        const importInfo = this.parseImportDeclaration(node);
        if (importInfo) {
          imports.push(importInfo);
        }
      }
    });

    return imports;
  }

  /**
   * ImportDeclaration 노드를 ImportInfo로 변환
   */
  private parseImportDeclaration(
    node: ts.ImportDeclaration
  ): ImportInfo | null {
    const moduleSpecifier = node.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpecifier)) {
      return null;
    }

    const source = moduleSpecifier.text;
    const specifiers: string[] = [];
    let isDefault = false;
    const isTypeOnly = node.importClause?.isTypeOnly || false;

    const importClause = node.importClause;
    if (!importClause) {
      // side-effect import: import 'module'
      return {
        source,
        specifiers: [],
        isDefault: false,
        isTypeOnly: false,
      };
    }

    // default import: import Something from 'module'
    if (importClause.name) {
      specifiers.push(importClause.name.text);
      isDefault = true;
    }

    // named imports: import { a, b } from 'module'
    const namedBindings = importClause.namedBindings;
    if (namedBindings) {
      if (ts.isNamespaceImport(namedBindings)) {
        // namespace import: import * as ns from 'module'
        specifiers.push(`* as ${namedBindings.name.text}`);
      } else if (ts.isNamedImports(namedBindings)) {
        for (const element of namedBindings.elements) {
          const name = element.name.text;
          const propertyName = element.propertyName?.text;

          if (propertyName) {
            specifiers.push(`${propertyName} as ${name}`);
          } else {
            specifiers.push(name);
          }
        }
      }
    }

    return {
      source,
      specifiers,
      isDefault,
      isTypeOnly,
    };
  }
}

export const importExtractor = new ImportExtractor();
