import { describe, expect, it } from 'vitest';
import { MissingEnvError, readEnv } from './env';

const complete = {
  VITE_FIREBASE_API_KEY: 'key',
  VITE_FIREBASE_AUTH_DOMAIN: 'domain',
  VITE_FIREBASE_DATABASE_URL: 'url',
  VITE_FIREBASE_PROJECT_ID: 'project',
  VITE_FIREBASE_STORAGE_BUCKET: 'bucket',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'sender',
  VITE_FIREBASE_APP_ID: 'app',
};

describe('readEnv', () => {
  it('필요한 값이 모두 있으면 그대로 반환한다', () => {
    expect(readEnv(complete)).toEqual(complete);
  });

  it('빠진 키를 모아서 알려준다', () => {
    const { VITE_FIREBASE_APP_ID: _omitted, ...partial } = complete;
    try {
      readEnv(partial);
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(MissingEnvError);
      expect((error as MissingEnvError).missing).toEqual(['VITE_FIREBASE_APP_ID']);
    }
  });

  it('빈 문자열은 없는 것으로 본다', () => {
    expect(() => readEnv({ ...complete, VITE_FIREBASE_API_KEY: '' })).toThrow(MissingEnvError);
  });
});
