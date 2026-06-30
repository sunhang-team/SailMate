// Firebase FCM 백그라운드 메시지 서비스워커
//
// 역할: 앱이 닫혀있거나 백그라운드 상태일 때 푸시 알림을 수신해 표시한다.
//       앱이 열려있을 때는 src/app/sw.ts의 push 핸들러가 담당한다.
//
// 파일명·위치 규칙: Firebase SDK가 브라우저에서 /firebase-messaging-sw.js 경로를
// 자동으로 찾으므로, 이름과 위치(public/)를 변경하면 안 된다.
//
// 환경변수 미사용: 이 파일은 Next.js 빌드를 거치지 않고 브라우저가 직접 실행하므로
// process.env를 쓸 수 없다. Firebase 클라이언트 설정값은 공개해도 안전한 값이므로
// 직접 입력한다. (보안은 Firebase Console 보안 규칙으로 처리)

importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDa06vqU1bcFPAeflXLWV50bndI8Ihatwo',
  authDomain: 'completionisland-80360.firebaseapp.com',
  projectId: 'completionisland-80360',
  messagingSenderId: '1033961011019',
  appId: '1:1033961011019:web:053b467179a1bd2a235ace',
});

const messaging = firebase.messaging();

// 백그라운드 알림 수신 시 시스템 알림으로 표시
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icons/pwa/icon-192.png',
  });
});
