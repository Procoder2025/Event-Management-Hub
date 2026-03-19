'use client';

/* ============================================
   Countdown Timer Component
   Shows days/hours/minutes to event
   ============================================ */

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
      };
    }
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2 mt-3">
      {[
        { val: timeLeft.days, label: 'd' },
        { val: timeLeft.hours, label: 'h' },
        { val: timeLeft.mins, label: 'm' },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white/[0.06] rounded-lg px-2.5 py-1 text-center min-w-[40px]"
        >
          <span className="text-sm font-bold text-white/90">{item.val}</span>
          <span className="text-[10px] text-white/30 ml-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
