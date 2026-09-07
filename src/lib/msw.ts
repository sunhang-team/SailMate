// TEMP: 백엔드 재배포 전까지 Vercel production 배포에서도 MSW를 사용할 수 있게 한다.
// 제거 예정: 백엔드 재배포 완료 후 production guard를 복구한다.
export const isMswEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
