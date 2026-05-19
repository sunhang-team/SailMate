import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | 완성도',
};

const SECTIONS = [
  {
    title: '1. 수집하는 개인정보 항목',
    content:
      '서비스는 회원 가입 및 서비스 이용 과정에서 다음과 같은 개인정보를 수집합니다.\n\n필수 항목: 이메일 주소, 닉네임, 비밀번호\n선택 항목: 프로필 이미지',
  },
  {
    title: '2. 개인정보 수집 및 이용 목적',
    content:
      '수집한 개인정보는 다음의 목적을 위해 이용합니다.\n\n• 회원 식별 및 인증\n• 서비스 제공 및 운영 (모임 생성, 참여, 리뷰 등)',
  },
  {
    title: '3. 개인정보 보유 및 이용 기간',
    content: '서비스는 서비스 운영 기간 동안 개인정보를 보유합니다. 서비스 종료 시 개인정보를 지체 없이 파기합니다.',
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content:
      '서비스는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 회원이 사전에 동의한 경우 또는 법령에 따라 수사기관 등이 요청하는 경우에는 예외로 합니다.',
  },
  {
    title: '5. 개인정보 파기 절차 및 방법',
    content:
      '서비스는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다.\n\n• 전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제\n• 종이 문서: 분쇄 또는 소각',
  },
  {
    title: '6. 쿠키 및 웹사이트 분석 도구',
    content:
      '서비스는 회원의 서비스 이용 패턴을 분석하고 서비스 품질을 개선하기 위해 다음과 같은 웹사이트 분석 도구를 사용합니다.\n\n[Google Analytics 4]\n• 처리 위탁: Google LLC (미국)\n• 수집 항목: 쿠키(_ga, _ga_* 등), IP 주소(익명화 처리), 디바이스 및 브라우저 정보, 페이지 이동·클릭 등 이용 행동 데이터, 회원이 발생시키는 주요 행동 이벤트(회원가입, 로그인, 모임 조회, 모임 참여 등)\n• 이용 목적: 서비스 이용 패턴 정량 분석 및 서비스 개선\n• 보유 기간: 수집일로부터 14개월\n• 거부 방법:\n  - 브라우저 설정에서 쿠키 차단 (서비스 일부 기능이 제한될 수 있음)\n  - Google Analytics 옵트아웃 부가기능 설치: https://tools.google.com/dlpage/gaoptout\n\n[Beusable(뷰저블)]\n• 처리 위탁: 주식회사 포그리트(4Grit Inc., 대한민국)\n• 수집 항목: 쿠키, 페이지 조회, 클릭 좌표, 스크롤 깊이, 마우스 이동 궤적, 디바이스 및 브라우저 정보, 세션 리플레이(사용자 화면 녹화)\n• 이용 목적: 페이지 단위 사용성 분석(히트맵·스크롤맵·세션 리플레이) 및 UX 개선\n• 보유 기간: 뷰저블 운영 정책에 따른 보존 기간\n• 거부 방법: 브라우저 설정에서 쿠키 차단 (서비스 일부 기능이 제한될 수 있음)\n\n서비스는 이름·이메일·전화번호·비밀번호·결제 정보 등 개인을 직접 식별할 수 있는 정보를 위 분석 도구로 전송하지 않으며, 세션 리플레이의 비밀번호 등 민감 입력 필드는 마스킹 처리되어 기록됩니다.',
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <h1 className='text-h5-b md:text-h4-b mb-2 text-gray-900'>개인정보 처리방침</h1>
      <p className='text-small-01-r md:text-body-02-r mb-8 text-gray-400 md:mb-12'>최종 업데이트: 2026년 5월 19일</p>
      <div className='flex flex-col gap-6 md:gap-8'>
        {SECTIONS.map(({ title, content }) => (
          <section key={title}>
            <h2 className='text-body-02-b md:text-body-01-b mb-2 text-gray-900'>{title}</h2>
            <p className='text-body-02-r md:text-body-01-r whitespace-pre-line text-gray-600'>{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
