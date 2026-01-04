/**
 * camelCase를 분리
 * 예: "attendanceCheck" -> ["attendance", "Check"]
 */
export function splitCamelCase(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean);
}

/**
 * PascalCase를 분리
 * 예: "AttendanceCheckModal" -> ["Attendance", "Check", "Modal"]
 */
export function splitPascalCase(str: string): string[] {
  return str
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean);
}

/**
 * snake_case를 분리
 * 예: "attendance_check" -> ["attendance", "check"]
 */
export function splitSnakeCase(str: string): string[] {
  return str.split('_').filter(Boolean);
}

/**
 * kebab-case를 분리
 * 예: "attendance-check" -> ["attendance", "check"]
 */
export function splitKebabCase(str: string): string[] {
  return str.split('-').filter(Boolean);
}

/**
 * 모든 케이스를 처리하여 단어 분리
 */
export function splitIntoWords(str: string): string[] {
  const words = new Set<string>();

  // snake_case와 kebab-case 먼저 처리
  const parts = str.split(/[-_]/);

  for (const part of parts) {
    // 각 부분에서 camelCase/PascalCase 분리
    const camelSplit = splitCamelCase(part);
    camelSplit.forEach((w) => words.add(w.toLowerCase()));
  }

  return [...words];
}

/**
 * 연속된 대문자(약어) 추출
 * 예: "XMLHTTPRequest" -> ["XML", "HTTP"]
 */
export function extractAcronyms(str: string): string[] {
  const acronyms: string[] = [];
  const matches = str.match(/[A-Z]{2,}/g);
  if (matches) {
    acronyms.push(...matches);
  }
  return acronyms;
}

/**
 * 문자열을 여러 형식으로 변환
 */
export function toAllCases(str: string): {
  camel: string;
  pascal: string;
  snake: string;
  kebab: string;
} {
  const words = splitIntoWords(str);

  return {
    camel: words
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join(''),
    pascal: words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(''),
    snake: words.map((w) => w.toLowerCase()).join('_'),
    kebab: words.map((w) => w.toLowerCase()).join('-'),
  };
}
