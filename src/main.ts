import './styles/global.css';
import { onValue, ref } from 'firebase/database';
import { getDb } from './lib/firebase';
import { MissingEnvError } from './lib/env';

type ConnectionState = 'pending' | 'ok' | 'error';

function render(root: HTMLElement): void {
  root.innerHTML = `
    <h1 class="title">지출내역 대시보드</h1>
    <p class="subtitle">Vite + TypeScript + Firebase Realtime Database</p>

    <section class="card">
      <h2>Firebase 연결</h2>
      <p class="status">
        <span class="dot dot--pending" data-role="dot"></span>
        <span data-role="status">연결 확인 중…</span>
      </p>
      <p class="error-detail" data-role="detail" hidden></p>
    </section>

    <section class="card">
      <h2>다음 단계</h2>
      <ol class="next-steps">
        <li><code>src/main.ts</code> 에서 화면을 만들기 시작하세요.</li>
        <li>데이터 접근 코드는 <code>src/lib/</code> 아래에 모아 두면 테스트하기 쉽습니다.</li>
        <li><code>npm run check</code> 로 포맷·린트·타입·테스트를 한 번에 확인합니다.</li>
        <li>이전 정적 버전은 <code>legacy/</code> 에 그대로 남아 있습니다.</li>
      </ol>
    </section>
  `;
}

function setStatus(root: HTMLElement, state: ConnectionState, message: string, detail = ''): void {
  const dot = root.querySelector<HTMLElement>('[data-role="dot"]');
  const label = root.querySelector<HTMLElement>('[data-role="status"]');
  const detailNode = root.querySelector<HTMLElement>('[data-role="detail"]');
  if (!dot || !label || !detailNode) return;

  dot.className = `dot dot--${state}`;
  label.textContent = message;
  detailNode.textContent = detail;
  detailNode.hidden = detail === '';
}

function start(root: HTMLElement): void {
  render(root);

  try {
    const connectedRef = ref(getDb(), '.info/connected');
    onValue(
      connectedRef,
      (snapshot) => {
        const connected = snapshot.val() === true;
        setStatus(root, connected ? 'ok' : 'pending', connected ? '연결됨' : '연결 대기 중…');
      },
      (error) => {
        setStatus(root, 'error', '연결 실패', error.message);
      },
    );
  } catch (error) {
    const detail =
      error instanceof MissingEnvError
        ? error.message
        : error instanceof Error
          ? error.message
          : String(error);
    setStatus(root, 'error', '초기화 실패', detail);
  }
}

const root = document.querySelector<HTMLElement>('#app');
if (!root) {
  throw new Error('#app 엘리먼트를 찾을 수 없습니다.');
}
start(root);
