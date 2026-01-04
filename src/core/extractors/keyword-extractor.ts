import {
  splitCamelCase,
  splitPascalCase,
  splitSnakeCase,
  extractAcronyms,
} from '../../utils/naming-utils';
import { findKoreanKeywords } from '../../utils/korean-mapper';

/**
 * 검색용 키워드를 추출하는 클래스
 */
export class KeywordExtractor {
  private customKoreanMap: Record<string, string[]>;

  constructor(customKoreanMap?: Record<string, string[]>) {
    this.customKoreanMap = customKoreanMap || {};
  }

  /**
   * 다양한 소스에서 키워드 추출
   */
  extract(
    name: string,
    path: string,
    exports: string[] = [],
    props: string[] = []
  ): string[] {
    const keywords = new Set<string>();

    // 1. 이름에서 키워드 추출
    this.extractFromName(name, keywords);

    // 2. 경로에서 키워드 추출
    this.extractFromPath(path, keywords);

    // 3. export 이름에서 추출
    for (const exportName of exports) {
      this.extractFromName(exportName, keywords);
    }

    // 4. props 이름에서 추출
    for (const propName of props) {
      this.extractFromName(propName, keywords);
    }

    // 5. 한글 키워드 추가
    const allEnglishKeywords = [...keywords];
    for (const keyword of allEnglishKeywords) {
      const koreanKeywords = this.findKorean(keyword);
      koreanKeywords.forEach((k) => keywords.add(k));
    }

    // 1글자 키워드 제외
    return [...keywords].filter((k) => k.length > 1);
  }

  /**
   * 이름에서 키워드 추출
   */
  private extractFromName(name: string, keywords: Set<string>): void {
    // 원본 이름 (소문자)
    keywords.add(name.toLowerCase());

    // CamelCase/PascalCase 분리
    const camelParts = splitCamelCase(name);
    camelParts.forEach((part) => keywords.add(part.toLowerCase()));

    const pascalParts = splitPascalCase(name);
    pascalParts.forEach((part) => keywords.add(part.toLowerCase()));

    // snake_case 분리
    const snakeParts = splitSnakeCase(name);
    snakeParts.forEach((part) => keywords.add(part.toLowerCase()));

    // 약어 처리
    const acronyms = extractAcronyms(name);
    acronyms.forEach((acr) => keywords.add(acr.toLowerCase()));
  }

  /**
   * 경로에서 키워드 추출
   */
  private extractFromPath(path: string, keywords: Set<string>): void {
    // 제외할 디렉토리 이름
    const excludeNames = new Set([
      'src',
      'app',
      'components',
      'hooks',
      'services',
      'lib',
      'utils',
      'pages',
      'api',
    ]);

    const segments = path
      .replace(/\.[^/.]+$/, '') // 확장자 제거
      .split('/')
      .filter((s) => !excludeNames.has(s));

    for (const segment of segments) {
      this.extractFromName(segment, keywords);
    }
  }

  /**
   * 영어 키워드에 대응하는 한글 키워드 찾기
   */
  private findKorean(englishKeyword: string): string[] {
    // 사용자 정의 매핑 먼저 확인
    const customMatch = this.customKoreanMap[englishKeyword.toLowerCase()];
    if (customMatch) {
      return customMatch;
    }

    // 기본 매핑에서 찾기
    return findKoreanKeywords(englishKeyword);
  }
}

export const keywordExtractor = new KeywordExtractor();
