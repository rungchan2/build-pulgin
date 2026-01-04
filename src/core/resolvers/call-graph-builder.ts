import type { ParsedFile, CallGraphEntry } from '../types';
import { DependencyResolver } from './dependency-resolver';

/**
 * 파일 간 호출 관계 그래프를 구축하는 클래스
 */
export class CallGraphBuilder {
  private resolver: DependencyResolver;

  constructor(aliasMap?: Record<string, string>) {
    const defaultAliases: Record<string, string> = {
      '@': 'src',
      '@/': 'src/',
      '~': 'src',
      '~/': 'src/',
    };

    this.resolver = new DependencyResolver({
      ...defaultAliases,
      ...aliasMap,
    });
  }

  /**
   * 파싱된 파일들로부터 호출 그래프 구축
   */
  build(
    parsedFiles: ParsedFile[],
    rootDir: string
  ): Map<string, CallGraphEntry> {
    const graph = new Map<string, CallGraphEntry>();

    // 모든 파일 경로를 Set으로 관리
    const filePathSet = new Set(parsedFiles.map((f) => f.path));

    // 1. 각 파일의 calls 계산
    for (const file of parsedFiles) {
      const calls = this.resolveCalls(file, rootDir, filePathSet);

      graph.set(file.path, {
        calls,
        calledBy: [],
      });
    }

    // 2. calledBy 역방향 관계 계산
    for (const [filePath, entry] of graph.entries()) {
      for (const calledPath of entry.calls) {
        const calledEntry = graph.get(calledPath);
        if (calledEntry) {
          calledEntry.calledBy.push(filePath);
        }
      }
    }

    return graph;
  }

  /**
   * 파일이 호출하는 다른 파일들을 해석
   */
  private resolveCalls(
    file: ParsedFile,
    rootDir: string,
    validPaths: Set<string>
  ): string[] {
    const calls: string[] = [];

    for (const imp of file.imports) {
      // 타입만 import하는 경우 제외
      if (imp.isTypeOnly) continue;

      const resolvedPath = this.resolver.resolve(
        imp.source,
        file.path,
        rootDir
      );

      // 프로젝트 내부 파일만 포함
      if (resolvedPath && validPaths.has(resolvedPath)) {
        calls.push(resolvedPath);
      }
    }

    // 중복 제거
    return [...new Set(calls)];
  }
}
