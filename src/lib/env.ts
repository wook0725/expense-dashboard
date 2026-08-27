/**
 * import.meta.env 에서 필요한 값을 읽고, 없으면 즉시 실패시킨다.
 * 설정 누락을 런타임 깊은 곳이 아니라 부팅 시점에 드러내기 위한 장치.
 */
const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type RequiredKey = (typeof REQUIRED_KEYS)[number];

export type Env = Record<RequiredKey, string>;

export class MissingEnvError extends Error {
  constructor(public readonly missing: readonly string[]) {
    super(
      `환경변수가 없습니다: ${missing.join(', ')}\n` +
        '`cp .env.example .env` 후 개발 서버를 다시 시작하세요.',
    );
    this.name = 'MissingEnvError';
  }
}

export function readEnv(source: Record<string, string | undefined>): Env {
  const missing = REQUIRED_KEYS.filter((key) => !source[key]);
  if (missing.length > 0) {
    throw new MissingEnvError(missing);
  }

  return Object.fromEntries(REQUIRED_KEYS.map((key) => [key, source[key]])) as Env;
}

export const env = (): Env => readEnv(import.meta.env);
