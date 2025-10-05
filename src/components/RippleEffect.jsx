// src/components/RippleEffect.jsx
import React, { useEffect, useRef } from 'react';

const RippleEffect = () => {
  const containerRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.7) { // Only create ripples occasionally
        createRipple(e.clientX, e.clientY, false);
      }
    };

    const handleClick = (e) => {
      createRipple(e.clientX, e.clientY, true);
    };

    const createRipple = (x, y, isClick) => {
      const ripple = {
        x,
        y,
        radius: 0,
        maxRadius: isClick ? 150 : 80,
        speed: isClick ? 8 : 4,
        alpha: isClick ? 0.3 : 0.1,
        color: isClick ? 
          `rgba(${Math.random() * 100}, ${Math.random() * 255}, ${Math.random() * 200}, 0.3)` :
          `rgba(0, 255, 127, 0.1)`
      };

      ripplesRef.current.push(ripple);
    };

    const animate = () => {
      const canvas = containerRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.alpha -= 0.02;

        if (ripple.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace('0.3', ripple.alpha.toString());
        ctx.lineWidth = 2;
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      if (containerRef.current) {
        containerRef.current.width = window.innerWidth;
        containerRef.current.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default RippleEffect;