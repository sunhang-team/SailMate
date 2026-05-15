import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용 약관 | 완성도',
};

const TERMS = [
  {
    title: '제1조 (목적)',
    content:
      '이 약관은 완성도(이하 "서비스")가 제공하는 모든 서비스의 이용 조건 및 절차, 서비스와 회원 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (회원 가입)',
    content:
      '서비스를 이용하려는 자는 약관에 동의한 후 회원 가입을 신청할 수 있습니다. 회원 가입은 이용자가 약관의 내용에 동의하고, 서비스가 정한 양식에 따라 필요한 정보를 기입한 후 신청 버튼을 클릭함으로써 완료됩니다.',
  },
  {
    title: '제3조 (서비스 이용)',
    content:
      '서비스는 회원에게 모임 생성, 모임 참여, 주차별 계획 관리, 리뷰 작성 등의 기능을 제공합니다. 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 정기 점검이나 장애 등 불가피한 사유 발생 시 일시적으로 중단될 수 있습니다.',
  },
  {
    title: '제4조 (회원의 의무)',
    content:
      '회원은 서비스 이용 시 다른 회원의 권리를 침해하거나, 허위 정보를 등록하거나, 타인의 계정 정보를 도용하거나, 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다. 이를 위반할 경우 서비스는 해당 회원의 이용을 제한할 수 있습니다.',
  },
  {
    title: '제5조 (개인정보 보호)',
    content:
      '서비스는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호합니다. 개인정보의 수집·이용·제공에 관한 사항은 개인정보 처리방침에 따릅니다.',
  },
  {
    title: '제6조 (서비스 이용 제한)',
    content:
      '서비스는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고·일시 정지·영구 이용 정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.',
  },
];

export default function TermsPage() {
  return (
    <div>
      <h1 className='text-h5-b md:text-h4-b mb-2 text-gray-900'>이용 약관</h1>
      <p className='text-small-01-r md:text-body-02-r mb-8 text-gray-400 md:mb-12'>최종 업데이트: 2026년 5월 8일</p>
      <ol className='flex flex-col gap-6 md:gap-8'>
        {TERMS.map(({ title, content }) => (
          <li key={title}>
            <h2 className='text-body-02-b md:text-body-01-b mb-2 text-gray-900'>{title}</h2>
            <p className='text-body-02-r md:text-body-01-r text-gray-600'>{content}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
