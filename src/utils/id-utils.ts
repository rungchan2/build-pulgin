import * as crypto from 'crypto';

/**
 * 프로젝트 ID와 파일 경로로 고유 ID 생성
 */
export function generateId(projectId: string, filePath: string): string {
  const input = `${projectId}:${filePath}`;
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}
