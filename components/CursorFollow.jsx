'use client';

import { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e) => {
      targetRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const animate = () => {
      // Smooth lerp (linear interpolation) for smooth following
      const speed = 0.15;

      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * speed;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * speed;

      cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998]"
      style={{
        width: '32px',
        height: '32px',
        marginLeft: '-16px',
        marginTop: '-16px',
        mixBlendMode: 'difference',
      }}
    >
      {/* Pixel circle - 8-bit style with blend mode */}
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        {/* White filled pixel circle */}
        <rect x="6" y="2" width="4" height="1" fill="white" />
        <rect x="4" y="3" width="8" height="1" fill="white" />
        <rect x="3" y="4" width="10" height="1" fill="white" />
        <rect x="2" y="5" width="12" height="1" fill="white" />
        <rect x="2" y="6" width="12" height="4" fill="white" />
        <rect x="2" y="10" width="12" height="1" fill="white" />
        <rect x="3" y="11" width="10" height="1" fill="white" />
        <rect x="4" y="12" width="8" height="1" fill="white" />
        <rect x="6" y="13" width="4" height="1" fill="white" />
      </svg>
    </div>
  );
};

export default CursorFollow;
