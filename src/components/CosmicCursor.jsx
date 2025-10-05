// src/components/CosmicCursor.jsx
import React, { useEffect, useState } from 'react';

const CosmicCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <div 
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : 1})`,
          borderColor: clicked ? 'rgba(64, 224, 208, 1)' : 'rgba(0, 255, 127, 0.8)'
        }}
      />
      <div 
        className="cursor-follower"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 2 : 1})`,
          background: clicked ? 'rgba(138, 43, 226, 0.8)' : 'rgba(0, 255, 127, 0.6)'
        }}
      />
    </>
  );
};

export default CosmicCursor;