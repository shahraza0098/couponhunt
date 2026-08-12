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
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold uppercase transition-all duration-300 cursor-pointer relative overflow-hidden ${
        revealed
          ? 'bg-green-500 text-white shadow-sm'
          : 'btn-purple btn-purple-cutout text-white'
      }`}
      id={`copy-code-${couponId}`}
    >
      <span className="font-mono tracking-widest text-lg">
        {revealed ? code : maskedCode}
      </span>
      <span className={`text-xs px-3 py-1 rounded-md transition-all ${
        copied
          ? 'bg-white/20'
          : revealed
            ? 'bg-black/10'
            : 'bg-white/20'
      }`}>
        {copied ? '✓ COPIED!' : revealed ? 'COPY' : 'GET CODE'}
      </span>
    </button>
  );
}
