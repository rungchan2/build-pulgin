import * as path from 'path';
import * as fs from 'fs';

/**
 * import 경로를 실제 파일 경로로 해석하는 클래스
 */
export class DependencyResolver {
  private aliasMap: Map<string, string>;
  private extensions: string[];

  constructor(
    aliasMap: Record<string, string> = {},
    extensions = ['.ts', '.tsx', '.js', '.jsx']
  ) {
    this.aliasMap = new Map(Object.entries(aliasMap));
    this.extensions = extensions;
  }

  /**
   * import 경로를 실제 파일 경로로 해석
   */
  resolve(
    importSource: string,
    importerPath: string,
    rootDir: string
  ): string | null {
    // 외부 패키지 (node_modules)
    if (this.isExternalPackage(importSource)) {
      return null;
    }

    // alias 처리
    const aliasResolved = this.resolveAlias(importSource);

    let targetPath: string;

    if (aliasResolved.startsWith('./') || aliasResolved.startsWith('../')) {
      // 상대 경로
      const importerDir = path.dirname(path.resolve(rootDir, importerPath));
      targetPath = path.resolve(importerDir, aliasResolved);
    } else if (aliasResolved !== importSource) {
      // alias가 해석된 경우
      targetPath = path.resolve(rootDir, aliasResolved);
    } else {
      // 해석 불가
      return null;
    }

    // 확장자 및 index 파일 처리
    const resolvedPath = this.resolveWithExtensions(targetPath);

    if (resolvedPath) {
      return path.relative(rootDir, resolvedPath);
    }

    return null;
  }

  /**
   * 외부 패키지인지 확인
   */
  private isExternalPackage(source: string): boolean {
    if (source.startsWith('./') || source.startsWith('../')) {
      return false;
    }

    // alias 체크
    for (const alias of this.aliasMap.keys()) {
      if (source.startsWith(alias)) {
        return false;
      }
    }

    return true;
  }

  /**
   * alias 해석
   */
  private resolveAlias(source: string): string {
    for (const [alias, target] of this.aliasMap.entries()) {
      if (source === alias) {
        return target;
      }
      if (source.startsWith(alias + '/')) {
        return source.replace(alias, target);
      }
    }
    return source;
  }

  /**
   * 확장자를 추가하여 파일 경로 해석
   */
  private resolveWithExtensions(targetPath: string): string | null {
    // 정확한 경로 체크
    if (fs.existsSync(targetPath)) {
      try {
        const stat = fs.statSync(targetPath);
        if (stat.isFile()) {
          return targetPath;
        }
        if (stat.isDirectory()) {
          return this.findIndexFile(targetPath);
        }
      } catch {
        // 무시
      }
    }

    // 확장자 추가해서 체크
    for (const ext of this.extensions) {
      const withExt = targetPath + ext;
      if (fs.existsSync(withExt)) {
        return withExt;
      }
    }

    // 디렉토리로 간주하고 index 파일 찾기
    return this.findIndexFile(targetPath);
  }

  /**
   * 디렉토리에서 index 파일 찾기
   */
  private findIndexFile(dirPath: string): string | null {
    for (const ext of this.extensions) {
      const indexPath = path.join(dirPath, `index${ext}`);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
    return null;
  }
}
