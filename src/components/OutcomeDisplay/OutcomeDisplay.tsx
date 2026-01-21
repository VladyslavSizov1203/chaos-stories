/**
 * OutcomeDisplay Component
 *
 * Shows the immediate result of a player's choice with:
 * - Centered overlay with vignette effect
 * - Chaos change indicator (+15 🔥 or -5 😌)
 * - Auto-dismisses after 3 seconds
 * - State machine: entering → holding → exiting → complete
 *
 * Ticket: 1.4 (Feature 1: Core Game Loop)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

// Animation state machine
type OutcomeAnimationState = 'entering' | 'holding' | 'exiting' | 'complete';

interface OutcomeDisplayProps {
  outcomeText: string;              // Result text from selected choice
  chaosChange: number;              // Amount chaos changed (+15, -5, etc.)
  onComplete: () => void;           // Callback when auto-dismiss completes
  visible?: boolean;                // Optional external visibility control
  testId?: string;                  // For testing
}

export default function OutcomeDisplay({
  outcomeText,
  chaosChange,
  onComplete,
  visible = true,
  testId = 'outcome-display',
}: OutcomeDisplayProps) {
  const [animState, setAnimState] = useState<OutcomeAnimationState>('entering');

  // Memoize onComplete to prevent effect re-runs
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Animation timeline control
  useEffect(() => {
    if (!visible) {
      return;
    }

    // Start entering
    setAnimState('entering');

    // Transition to holding after fade in (200ms)
    const holdTimer = setTimeout(() => {
      setAnimState('holding');
    }, 200);

    // Start exiting after hold period (2700ms)
    const exitTimer = setTimeout(() => {
      setAnimState('exiting');
    }, 2700);

    // Complete and notify parent after fade out (3000ms)
    const completeTimer = setTimeout(() => {
      setAnimState('complete');
      handleComplete();
    }, 3000);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [visible, handleComplete]);

  // Development warning for long text
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const sentenceCount = outcomeText.split(/[.!?]/).filter(s => s.trim()).length;
      if (sentenceCount > 4) {
        console.warn(
          `[OutcomeDisplay] Outcome text has ${sentenceCount} sentences. ` +
          `Recommended: 2-4 sentences max for 2.5s reading time.`
        );
      }
    }
  }, [outcomeText]);

  // Handle missing outcome text
  if (!outcomeText || outcomeText.trim() === '') {
    console.error('[OutcomeDisplay] Missing outcomeText prop');

    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          data-testid={testId}
        >
          <div className="max-w-md w-[90%] p-6 bg-red-900/80 border-2 border-red-500 rounded-xl">
            <p className="text-red-200 font-mono text-sm text-center">
              Error: outcomeText is required
            </p>
          </div>
        </div>
      );
    }

    // In production, complete immediately
    handleComplete();
    return null;
  }

  // Don't render if complete
  if (animState === 'complete') {
    return null;
  }

  // Get chaos indicator styling
  const getChaosIndicator = () => {
    if (chaosChange === 0) {
      return null; // Don't show indicator for zero change
    }

    const isPositive = chaosChange > 0;
    const absChange = Math.abs(chaosChange);

    // Determine emoji based on magnitude
    let emoji = '✨'; // Default for small changes
    if (absChange >= 15) {
      emoji = isPositive ? '🔥' : '😌';
    } else if (absChange >= 5) {
      emoji = isPositive ? '🤨' : '😌';
    }

    // Determine color
    const colorClass = isPositive ? 'text-orange-400' : 'text-green-400';
    const sign = isPositive ? '+' : '';

    return (
      <div
        className="flex items-center justify-center gap-2 mb-4 chaos-indicator"
        aria-label={`Chaos ${isPositive ? 'increased' : 'decreased'} by ${absChange}`}
      >
        <span className="text-3xl" aria-hidden="true">
          {emoji}
        </span>
        <span className={`text-2xl font-semibold ${colorClass}`}>
          {sign}{chaosChange}
        </span>
      </div>
    );
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId}
      data-state={animState}
      className={`
        fixed inset-0 z-40
        flex items-center justify-center
        outcome-overlay
        outcome-overlay--${animState}
      `}
      style={{
        background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)',
      }}
    >
      <div
        className={`
          outcome-card
          max-w-md
          w-[90%]
          px-6 py-8
          sm:px-8 sm:py-10
          lg:px-10 lg:py-12
          bg-black/70
          border-2 border-white/20
          rounded-xl
          backdrop-blur-md
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          text-center
          max-h-[60vh]
          overflow-y-auto
        `}
      >
        {/* Chaos change indicator */}
        {getChaosIndicator()}

        {/* Outcome text */}
        <p
          className="
            text-lg sm:text-xl
            text-white
            leading-relaxed
            outcome-text
          "
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          }}
        >
          {outcomeText}
        </p>
      </div>
    </div>
  );
}
