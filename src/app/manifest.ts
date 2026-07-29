import { SITE_NAME, SITE_TITLE_DEFAULT, SITE_DESCRIPTION } from '@/lib/seo';

import type { MetadataRoute } from 'next';

/**
 * PWA Web App Manifest (앱 "신분증").
 * Next.js가 이 파일을 빌드해 `/manifest.webmanifest`로 서빙하고,
 * <link rel="manifest"> 를 자동 주입한다. 브라우저는 이걸 보고
 * "설치 가능한 앱"으로 인식한다.
 *
 * 검증: DevTools → Application → Manifest 탭
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // 앱 고유 정체성(App ID). start_url을 나중에 바꿔도 정체성이 흔들리지 않게 고정.
    id: '/',
    // 설치 다이얼로그에 뜨는 정식 이름
    name: SITE_TITLE_DEFAULT,
    // 홈 화면 아이콘 아래 라벨 (짧게, 12자 내외 권장)
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,

    // 설치된 앱을 켰을 때 처음 여는 경로
    start_url: '/',
    // 'standalone' = 주소창 없이 앱처럼 전체화면
    display: 'standalone',

    lang: 'ko',
    // 스플래시 배경색. 앱 첫 화면 배경과 맞춰야 깜빡임이 없다.
    background_color: '#FFFFFF',
    // 상태바/툴바 색. 로고 그라데이션(#1E58F8 → #00CCFF)의 딥블루로 확정.
    theme_color: '#1E58F8',

    // 임시: apple-icon(180)을 리사이즈한 마크.
    // TODO(아현): maskable 여백 버전 + 안 둥근 정사각 고해상도 원본으로 교체
    icons: [
      { src: '/icons/pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
