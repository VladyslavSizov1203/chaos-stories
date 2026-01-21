/**
 * StoryText Component
 *
 * Displays narrative text for each scene with mobile-optimized typography and readability.
 * Supports arrival variants, position modes, and fade-in animations.
 *
 * @example
 * ```tsx
 * <StoryText
 *   text="You push open the heavy tavern door..."
 *   position="top"
 * />
 * ```
 */

'use client';

import { memo, useEffect } from 'react';

export interface StoryTextProps {
  /** Main scene text to display */
  text: string;
  /** Optional variant text based on previous scene (takes priority over text) */
  arrivalText?: string;
  /** Layout position - 'top' for most scenes, 'center' for endings */
  position?: 'top' | 'center';
  /** Optional additional CSS classes */
  className?: string;
  /** Test ID for testing and debugging */
  testId?: string;
  /** Enable fade-in animation on mount */
  animate?: boolean;
}

/**
 * StoryText Component
 *
 * Core narrative display component with:
 * - WCAG AA contrast compliance (white text with shadow)
 * - Mobile-first responsive typography (18px → 20px)
 * - Optimal reading width (max 672px)
 * - Fade-in animation with reduced motion support
 * - Position variants for different scene types
 *
 * Design Guidelines:
 * - Max 4 sentences per scene (target: 25-30 words)
 * - Reading time under 10 seconds
 * - Minimum 16px padding from screen edges (handled by parent)
 */
const StoryText = memo(({
  text,
  arrivalText,
  position = 'top',
  className = '',
  testId = 'story-text',
  animate = true,
}: StoryTextProps) => {
  // Priority: arrivalText > text
  const displayText = arrivalText || text;

  // Development warning for overly long text
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const sentences = displayText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 4) {
        console.warn(
          `[StoryText] Text exceeds 4 sentences (${sentences.length} found). ` +
          `Reading time may exceed 10 seconds. Text: "${displayText.substring(0, 50)}..."`
        );
      }
    }
  }, [displayText]);

  // Error handling - missing text
  if (!displayText) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          className="text-red-500 font-bold p-4 bg-red-100 rounded m-4"
          data-testid="story-text-error"
        >
          Error: StoryText requires text prop
        </div>
      );
    }
    return null;
  }

  // Position wrapper classes
  const wrapperClasses = position === 'center'
    ? 'flex-1 flex items-center justify-center'
    : 'flex-1 flex items-start justify-center pt-8 md:pt-12';

  // Text element classes
  const textClasses = [
    'max-w-2xl',
    'mx-auto',
    'text-center',
    'text-white',
    'text-lg',
    'md:text-xl',
    'font-normal',
    'leading-normal',
    'mb-8',
    'px-4', // Ensure padding on mobile
    animate ? 'animate-fade-in' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={wrapperClasses}
      data-testid={`${testId}-wrapper`}
    >
      <p
        className={textClasses}
        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
        data-testid={testId}
      >
        {displayText}
      </p>
    </div>
  );
});

StoryText.displayName = 'StoryText';

export default StoryText;
