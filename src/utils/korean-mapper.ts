/**
 * 기본 영한 키워드 매핑
 */
export const KOREAN_KEYWORD_MAP: Record<string, string[]> = {
  // 공통 동작
  create: ['생성', '만들기', '추가'],
  read: ['읽기', '조회'],
  update: ['수정', '업데이트', '변경'],
  delete: ['삭제', '제거'],
  list: ['목록', '리스트'],
  search: ['검색', '찾기'],
  filter: ['필터', '필터링'],
  sort: ['정렬'],
  submit: ['제출', '전송'],
  cancel: ['취소'],
  confirm: ['확인'],
  save: ['저장'],
  load: ['로드', '불러오기'],
  fetch: ['가져오기', '불러오기'],

  // UI 요소
  button: ['버튼'],
  modal: ['모달', '팝업'],
  dialog: ['다이얼로그', '대화상자'],
  form: ['폼', '양식'],
  input: ['입력', '인풋'],
  select: ['선택', '셀렉트', '드롭다운'],
  checkbox: ['체크박스', '체크'],
  table: ['테이블', '표'],
  card: ['카드'],
  tab: ['탭'],
  menu: ['메뉴'],
  header: ['헤더', '머리글'],
  footer: ['푸터', '바닥글'],
  sidebar: ['사이드바'],
  navbar: ['네비게이션', '네비바'],

  // 인증/사용자
  auth: ['인증', '로그인'],
  login: ['로그인'],
  logout: ['로그아웃'],
  register: ['회원가입', '가입'],
  signup: ['회원가입', '가입'],
  user: ['사용자', '유저', '회원'],
  profile: ['프로필'],
  password: ['비밀번호', '암호'],
  permission: ['권한'],

  // 비즈니스
  attendance: ['출석', '출결'],
  check: ['체크', '확인'],
  schedule: ['스케줄', '일정'],
  calendar: ['캘린더', '달력'],
  notification: ['알림', '통지'],
  message: ['메시지', '알림'],
  setting: ['설정'],
  settings: ['설정'],
  payment: ['결제', '지불'],
  order: ['주문'],
  product: ['상품', '제품'],
  cart: ['장바구니'],
  checkout: ['결제', '체크아웃'],
  invoice: ['송장', '청구서'],
  report: ['리포트', '보고서'],
  dashboard: ['대시보드'],
  analytics: ['분석', '통계'],
  statistics: ['통계'],

  // 상태
  status: ['상태'],
  pending: ['대기중', '대기'],
  active: ['활성', '활성화'],
  inactive: ['비활성', '비활성화'],
  completed: ['완료'],
  error: ['에러', '오류'],
  success: ['성공'],
  loading: ['로딩', '로드중'],

  // 기타
  date: ['날짜'],
  time: ['시간'],
  image: ['이미지', '사진'],
  file: ['파일'],
  upload: ['업로드', '올리기'],
  download: ['다운로드', '내려받기'],
  export: ['내보내기', '익스포트'],
  import: ['가져오기', '임포트'],
  api: ['API', '에이피아이'],
  service: ['서비스'],
  hook: ['훅'],
  component: ['컴포넌트'],
  page: ['페이지'],
  route: ['라우트', '경로'],
};

/**
 * 영어 키워드에 대응하는 한글 키워드 찾기
 */
export function findKoreanKeywords(englishKeyword: string): string[] {
  const lower = englishKeyword.toLowerCase();

  // 정확한 매칭
  if (KOREAN_KEYWORD_MAP[lower]) {
    return KOREAN_KEYWORD_MAP[lower];
  }

  // 부분 매칭
  const results: string[] = [];
  for (const [key, values] of Object.entries(KOREAN_KEYWORD_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      results.push(...values);
    }
  }

  return [...new Set(results)];
}

/**
 * 한글 키워드 매핑 확장
 */
export function extendKoreanMap(
  customMap: Record<string, string[]>
): Record<string, string[]> {
  return {
    ...KOREAN_KEYWORD_MAP,
    ...customMap,
  };
}
