/**
 * SceneContainer Component
 *
 * Full-screen scene container with background image and gradient overlay.
 * Mobile-first, edge-to-edge on small screens, centered on desktop.
 *
 * @component
 * @example
 * ```tsx
 * <SceneContainer backgroundImage="/images/scenes/tavern.jpg">
 *   <StoryText text="You push open the heavy tavern door..." />
 *   <ChoiceList choices={currentScene.choices} />
 * </SceneContainer>
 * ```
 */

'use client';

import React from 'react';

export interface SceneContainerProps {
  /** Path to background image (e.g., "/images/scenes/tavern.jpg") */
  backgroundImage: string;
  /** Scene content (text, choices, UI elements) */
  children: React.ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Overlay opacity (0-1), default 0.6 */
  overlayOpacity?: number;
  /** Test ID for E2E and unit testing */
  testId?: string;
}

/**
 * SceneContainer wraps every scene in the game with a full-screen background
 * and proper text contrast overlay.
 */
export default function SceneContainer({
  backgroundImage,
  children,
  className = '',
  overlayOpacity = 0.6,
  testId = 'scene-container',
}: SceneContainerProps) {
  // Support both URL paths and CSS gradients
  const backgroundStyle = backgroundImage.startsWith('linear-gradient') || backgroundImage.startsWith('radial-gradient')
    ? { backgroundImage }
    : { backgroundImage: `url(${backgroundImage})` };

  return (
    <div
      data-testid={testId}
      className={`relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat ${className}`}
      style={backgroundStyle}
    >
      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-20 min-h-screen">
        {children}
      </div>
    </div>
  );
}
