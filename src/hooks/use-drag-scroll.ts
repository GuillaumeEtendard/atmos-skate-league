import { useCallback, useRef } from "react";
import type React from "react";

/**
 * Enables click-and-drag horizontal scrolling for pointer devices (mouse).
 * Touch devices keep native scrolling (we ignore pointerType !== 'mouse').
 */
export function useDragScroll<T extends HTMLElement>(ref: React.RefObject<T>) {
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;

      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startScrollLeftRef.current = el.scrollLeft;

      el.setPointerCapture?.(e.pointerId);
    },
    [ref],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!isDraggingRef.current) return;
      const el = ref.current;
      if (!el) return;

      const dx = e.clientX - startXRef.current;
      el.scrollLeft = startScrollLeftRef.current - dx;
    },
    [ref],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isDraggingRef.current = false;

      const el = ref.current;
      if (!el) return;
      try {
        el.releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    },
    [ref],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onPointerLeave: endDrag,
  };
}
