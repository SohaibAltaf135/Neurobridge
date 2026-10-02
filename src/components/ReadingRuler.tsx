import React, { useEffect, useState } from 'react';

interface ReadingRulerProps {
  enabled: boolean;
}

export const ReadingRuler: React.FC<ReadingRulerProps> = ({ enabled }) => {
  const [topPos, setTopPos] = useState<number>(200);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Center the 48px ruler on the mouse pointer
      setTopPos(e.clientY - 24);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="reading-ruler transition-all duration-75 ease-out"
      style={{ top: `${topPos}px` }}
      aria-hidden="true"
    />
  );
};
