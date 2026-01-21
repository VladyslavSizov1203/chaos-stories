/**
 * useSceneTransition Hook
 *
 * Manages smooth scene transitions with:
 * - Fade animation (150ms out + 150ms in = 300ms total, ~500ms max with image load)
 * - Image preloading
 * - UI locking during transition
 * - Ending scene detection
 *
 * Ticket: #5 (1.5: Scene Transition Logic)
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Scene } from '@/src/types/game';

export type TransitionState = 'idle' | 'fading-out' | 'loading' | 'fading-in';

export interface UseSceneTransitionOptions {
  /** Duration of fade out animation in ms (default: 300) */
  fadeOutDuration?: number;
  /** Duration of fade in animation in ms (default: 300) */
  fadeInDuration?: number;
  /** Callback when transition starts */
  onTransitionStart?: () => void;
  /** Callback when new scene is ready (after fade out, before fade in) */
  onSceneReady?: (scene: Scene) => void;
  /** Callback when transition completes */
  onTransitionComplete?: (scene: Scene) => void;
  /** Callback when ending scene is reached */
  onEndingReached?: (scene: Scene) => void;
}

export interface UseSceneTransitionReturn {
  /** Current transition state */
  transitionState: TransitionState;
  /** Whether UI should be locked (no interactions) */
  isLocked: boolean;
  /** Opacity value for current scene (0-1) */
  opacity: number;
  /** Trigger transition to next scene */
  transitionTo: (nextScene: Scene, fromSceneId?: string) => void;
  /** Preload an image for upcoming scene */
  preloadImage: (imagePath: string) => void;
  /** Cancel ongoing transition (if possible) */
  cancel: () => void;
}

/**
 * Preloads an image and returns a promise that resolves when loaded
 */
function preloadImageAsync(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Skip if it's a gradient or data URL
    if (src.startsWith('linear-gradient') || src.startsWith('data:')) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      // Don't fail transition if image fails - just continue
      console.warn(`Failed to preload image: ${src}`);
      resolve();
    };
    img.src = src;
  });
}

export function useSceneTransition(
  options: UseSceneTransitionOptions = {}
): UseSceneTransitionReturn {
  const {
    fadeOutDuration = 150,
    fadeInDuration = 150,
    onTransitionStart,
    onSceneReady,
    onTransitionComplete,
    onEndingReached,
  } = options;

  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [opacity, setOpacity] = useState(1);

  // Refs to track transition and avoid stale closures
  const transitionRef = useRef<{
    cancelled: boolean;
    timeoutIds: NodeJS.Timeout[];
  }>({ cancelled: false, timeoutIds: [] });

  // Store callbacks in refs to avoid stale closures in timeouts
  const callbackRefs = useRef({
    onTransitionStart,
    onSceneReady,
    onTransitionComplete,
    onEndingReached,
  });
  callbackRefs.current = {
    onTransitionStart,
    onSceneReady,
    onTransitionComplete,
    onEndingReached,
  };

  // Preloaded images cache
  const preloadedImages = useRef<Set<string>>(new Set());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      transitionRef.current.timeoutIds.forEach(clearTimeout);
    };
  }, []);

  const clearTimeouts = useCallback(() => {
    transitionRef.current.timeoutIds.forEach(clearTimeout);
    transitionRef.current.timeoutIds = [];
  }, []);

  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    transitionRef.current.timeoutIds.push(id);
    return id;
  }, []);

  const preloadImage = useCallback((imagePath: string) => {
    if (!preloadedImages.current.has(imagePath)) {
      preloadImageAsync(imagePath).then(() => {
        preloadedImages.current.add(imagePath);
      });
    }
  }, []);

  const cancel = useCallback(() => {
    transitionRef.current.cancelled = true;
    clearTimeouts();
    setTransitionState('idle');
    setOpacity(1);
  }, [clearTimeouts]);

  const transitionTo = useCallback(
    (nextScene: Scene, fromSceneId?: string) => {
      // Prevent double transitions
      if (transitionState !== 'idle') {
        console.warn('Transition already in progress');
        return;
      }

      // Reset cancellation flag
      transitionRef.current.cancelled = false;

      // Check if this is an ending scene
      if (nextScene.isEnding) {
        callbackRefs.current.onEndingReached?.(nextScene);
        return;
      }

      // Notify transition start
      callbackRefs.current.onTransitionStart?.();

      // Start fade out
      setTransitionState('fading-out');
      setOpacity(0);

      // After fade out, load new scene
      addTimeout(() => {
        if (transitionRef.current.cancelled) return;

        setTransitionState('loading');

        // Preload next scene image (if not already cached)
        const imagePromise = preloadedImages.current.has(nextScene.backgroundImage)
          ? Promise.resolve()
          : preloadImageAsync(nextScene.backgroundImage);

        // Wait for image (with max timeout of 200ms to stay under 500ms total)
        Promise.race([
          imagePromise,
          new Promise(resolve => setTimeout(resolve, 200)),
        ]).then(() => {
          if (transitionRef.current.cancelled) return;

          // Scene is ready - notify and start fade in
          callbackRefs.current.onSceneReady?.(nextScene);

          setTransitionState('fading-in');
          setOpacity(1);

          // After fade in, complete transition
          addTimeout(() => {
            if (transitionRef.current.cancelled) return;

            setTransitionState('idle');
            callbackRefs.current.onTransitionComplete?.(nextScene);
          }, fadeInDuration);
        });
      }, fadeOutDuration);
    },
    [
      transitionState,
      fadeOutDuration,
      fadeInDuration,
      addTimeout,
      onTransitionStart,
      onSceneReady,
      onTransitionComplete,
      onEndingReached,
    ]
  );

  return {
    transitionState,
    isLocked: transitionState !== 'idle',
    opacity,
    transitionTo,
    preloadImage,
    cancel,
  };
}

export default useSceneTransition;
