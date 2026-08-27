# 지출내역 대시보드

Vite + TypeScript + Firebase Realtime Database 기반의 지출 관리 대시보드입니다.

## 요구 사항

- Node.js 22 (`.nvmrc` 참고, 20.19 이상이면 동작)
- npm 10 이상

## 시작하기

```bash
nvm use            # .nvmrc 사용 시
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

`.env` 가 없으면 앱이 부팅 시점에 "초기화 실패"와 함께 빠진 환경변수 이름을 보여줍니다.

## 스크립트

| 명령                 | 설명                                      |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | 개발 서버 (HMR)                           |
| `npm run build`      | 타입 체크 후 `dist/` 로 프로덕션 빌드     |
| `npm run preview`    | 빌드 결과물 로컬 서빙                     |
| `npm run typecheck`  | `tsc --noEmit`                            |
| `npm run lint`       | ESLint (타입 인식 규칙 포함)              |
| `npm run format`     | Prettier 적용                             |
| `npm test`           | Vitest 1회 실행                           |
| `npm run test:watch` | Vitest 워치 모드                          |
| `npm run check`      | 포맷·린트·타입·테스트 한 번에 (CI와 동일) |

## 디렉터리 구조

```
index.html            Vite 진입 HTML
src/
  main.ts             앱 부트스트랩
  lib/
    env.ts            환경변수 읽기/검증
    firebase.ts       Firebase 앱·DB 싱글턴
    format.ts         통화·날짜 포맷터
  styles/global.css   전역 스타일 및 디자인 토큰
legacy/               이전 정적 HTML 버전 (참고용, 빌드·린트 대상 아님)
```

`@/` 별칭이 `src/` 를 가리킵니다. (`import { getDb } from '@/lib/firebase'`)

## 환경변수

Firebase 웹 설정값은 `VITE_` 접두사로 `.env` 에 둡니다. 목록과 기본값은 `.env.example` 참고.

이 값들은 브라우저 번들에 그대로 포함되는 **공개 식별자**이며 비밀키가 아닙니다.
실제 데이터 보호는 Realtime Database 보안 규칙으로 해야 하니, 배포 전에 규칙을 한 번
점검하세요.

## CI

`.github/workflows/ci.yml` 이 push(main)와 모든 PR에서 포맷·린트·타입·테스트·빌드를
실행합니다.
