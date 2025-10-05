// src/components/AtomicParticleText.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AtomicParticleText = ({ 
  text, 
  className = '', 
  explodeOnHover = true,
  particleCount = 8,
  explosionForce = 50,
  colors = ['#00ff88', '#00ffff', '#ff00ff', '#ffff00', '#ff4444', '#8844ff']
}) => {
  const [isExploded, setIsExploded] = useState(false);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const handleMouseEnter = () => {
    if (explodeOnHover && !isExploded) {
      setIsExploded(true);
      createParticles();
    }
  };

  const handleMouseLeave = () => {
    if (explodeOnHover && isExploded) {
      setIsExploded(false);
      setParticles([]);
    }
  };

  const createParticles = () => {
    if (!containerRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    // Calculate the center of the text relative to the container
    const centerX = (textRect.left - containerRect.left) + textRect.width / 2;
    const centerY = (textRect.top - containerRect.top) + textRect.height / 2;

    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const force = explosionForce * (0.7 + Math.random() * 0.6);
      
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * force * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * force * (0.8 + Math.random() * 0.4),
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    if (isExploded && particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx * 0.1,
            y: particle.y + particle.vy * 0.1,
            vy: particle.vy + 0.2, // gravity
            vx: particle.vx * 0.98, // friction
            life: particle.life - particle.decay,
            rotation: particle.rotation + particle.rotationSpeed
          })).filter(p => p.life > 0);

          if (updated.length === 0) {
            setIsExploded(false);
          }

          return updated;
        });
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isExploded, particles]);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: '1.2em', minWidth: '1px' }}
    >
      {/* Original Text */}
      <motion.span
        ref={textRef}
        className="inline-block cursor-pointer"
        animate={isExploded ? {
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.3 }
        } : {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5 }
        }}
        whileHover={{ color: '#00ff88' }}
      >
        {text}
      </motion.span>

      {/* Floating Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            opacity: particle.life,
            rotate: particle.rotation,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: 'translate(-50%, -50%)' // Center the particle
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ))}

      {/* Atomic Nucleus Effect */}
      {isExploded && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ 
            scale: 0, 
            opacity: 1,
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#00ff88',
            boxShadow: '0 0 20px #00ff88'
          }}
          animate={{ 
            scale: 3, 
            opacity: 0 
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
};

export default AtomicParticleText;