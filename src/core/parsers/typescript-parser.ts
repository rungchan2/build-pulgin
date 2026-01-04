import ts from 'typescript';

/**
 * TypeScript AST 파서
 */
export class TypeScriptParser {
  private compilerOptions: ts.CompilerOptions;

  constructor() {
    this.compilerOptions = {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: false,
    };
  }

  /**
   * 소스 코드를 AST로 파싱
   */
  parse(content: string, filePath: string): ts.SourceFile {
    return ts.createSourceFile(
      filePath,
      content,
      this.compilerOptions.target!,
      true,
      this.getScriptKind(filePath)
    );
  }

  /**
   * 파일 확장자에 따른 ScriptKind 결정
   */
  private getScriptKind(filePath: string): ts.ScriptKind {
    const ext = filePath.toLowerCase();
    if (ext.endsWith('.tsx')) return ts.ScriptKind.TSX;
    if (ext.endsWith('.ts')) return ts.ScriptKind.TS;
    if (ext.endsWith('.jsx')) return ts.ScriptKind.JSX;
    if (ext.endsWith('.js')) return ts.ScriptKind.JS;
    return ts.ScriptKind.Unknown;
  }

  /**
   * AST 노드 순회
   */
  traverse(node: ts.Node, visitor: (node: ts.Node) => void | boolean): void {
    const shouldContinue = visitor(node);
    if (shouldContinue === false) return;

    ts.forEachChild(node, (child) => this.traverse(child, visitor));
  }

  /**
   * 특정 조건을 만족하는 노드 수집
   */
  findNodes<T extends ts.Node>(
    sourceFile: ts.SourceFile,
    predicate: (node: ts.Node) => node is T
  ): T[] {
    const results: T[] = [];

    this.traverse(sourceFile, (node) => {
      if (predicate(node)) {
        results.push(node);
      }
    });

    return results;
  }

  /**
   * 노드의 텍스트 추출
   */
  getNodeText(node: ts.Node, sourceFile: ts.SourceFile): string {
    return node.getText(sourceFile);
  }

  /**
   * JSDoc 코멘트 추출
   */
  getJSDocComment(node: ts.Node): string | undefined {
    const jsDocNodes = ts.getJSDocCommentsAndTags(node);
    if (jsDocNodes.length === 0) return undefined;

    return jsDocNodes
      .filter(ts.isJSDoc)
      .map((doc) => doc.comment)
      .filter(Boolean)
      .join('\n');
  }
}

export const typescriptParser = new TypeScriptParser();
