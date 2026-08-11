'use client';

import { useState } from 'react';

interface CopyCodeButtonProps {
  code: string;
  maskedCode: string;
  couponId: string;
  storeId: string;
}

export default function CopyCodeButton({ code, maskedCode, couponId, storeId }: CopyCodeButtonProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (!revealed) {
      setRevealed(true);
      // Track click
      try {
        fetch('/api/clicks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType: 'COUPON',
            couponId,
            storeId,
          }),
        });
      } catch {
        // Silently fail
      }
    }

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
        revealed
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-[--ch-border-bright] bg-[--ch-bg] hover:border-emerald-500/30'
      }`}
      id={`copy-code-${couponId}`}
    >
      <span className="coupon-code text-[--ch-text]">
        {revealed ? code : maskedCode}
      </span>
      <span className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
        copied
          ? 'bg-emerald-500 text-white'
          : revealed
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-[--ch-surface] text-[--ch-text-muted]'
      }`}>
        {copied ? '✓ Copied!' : revealed ? 'Copy' : 'Reveal Code'}
      </span>
    </button>
  );
}
