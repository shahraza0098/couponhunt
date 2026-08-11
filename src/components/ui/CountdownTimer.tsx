'use client';

import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/utils/formatting';

interface CountdownTimerProps {
  expiresAt: string | Date;
}

export default function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(expiresAt);
      setTime(remaining);
      if (remaining.total <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (time.total <= 0) {
    return (
      <div className="badge badge-rose">Expired</div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-sm">
      <span className="text-[--ch-text-faint]">Expires in</span>
      <div className="flex items-center gap-1">
        {time.days > 0 && (
          <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded font-mono text-xs font-bold">
            {time.days}d
          </span>
        )}
        <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded font-mono text-xs font-bold">
          {String(time.hours).padStart(2, '0')}h
        </span>
        <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded font-mono text-xs font-bold">
          {String(time.minutes).padStart(2, '0')}m
        </span>
        {time.days === 0 && (
          <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 rounded font-mono text-xs font-bold">
            {String(time.seconds).padStart(2, '0')}s
          </span>
        )}
      </div>
    </div>
  );
}
