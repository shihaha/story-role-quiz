import { useState, type FormEvent } from 'react';

const ACCESS_PASSWORD = 'love2026';
const ACCESS_KEY = 'story-role-quiz-access-v1';

interface AccessGateProps {
  onUnlock: () => void;
}

export function hasStoredAccess() {
  try {
    return window.localStorage.getItem(ACCESS_KEY) === 'granted';
  } catch {
    return false;
  }
}

export default function AccessGate({ onUnlock }: AccessGateProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim().toLowerCase() !== ACCESS_PASSWORD) {
      setError('密码不对，再检查一下');
      return;
    }

    try {
      window.localStorage.setItem(ACCESS_KEY, 'granted');
    } catch {
      // Storage can be unavailable in private browsing; access still works for this session.
    }
    setError('');
    onUnlock();
  };

  return (
    <section className="access-screen">
      <div className="access-backdrop" aria-hidden="true" />
      <div className="access-card">
        <div className="access-kicker">LOVE STORY TEST</div>
        <div className="access-mark">♡</div>
        <h1>进入你的恋爱剧情</h1>
        <p>已购买用户请输入访问密码</p>

        <form className="access-form" onSubmit={submit}>
          <label htmlFor="access-password">访问密码</label>
          <input
            id="access-password"
            type="password"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError('');
            }}
            placeholder="请输入访问密码"
            autoComplete="current-password"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'access-error' : undefined}
          />
          <button className="access-submit" type="submit">进入测试 <span>→</span></button>
          <div id="access-error" className={`access-error ${error ? 'is-visible' : ''}`} role="alert">
            {error || ' '}
          </div>
        </form>

        <div className="access-note">一次解锁后，这台设备会记住你的访问状态</div>
        <div className="access-disclaimer">测试结果仅供娱乐</div>
      </div>
    </section>
  );
}
