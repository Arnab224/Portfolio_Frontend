// src/components/CosmicParticles.jsx
import React, { useEffect, useRef } from 'react';

const CosmicParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      getRandomColor() {
        const colors = [
          'rgba(0, 255, 127, 0.8)',  // Matrix green
          'rgba(64, 224, 208, 0.6)', // Turquoise
          'rgba(138, 43, 226, 0.7)', // Blue violet
          'rgba(0, 191, 255, 0.6)',  // Deep sky blue
          'rgba(123, 104, 238, 0.7)' // Medium slate blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150 * 0.5;
          
          if (mouseRef.current.clicked) {
            // Repel on click
            this.speedX -= Math.cos(angle) * force * 2;
            this.speedY -= Math.sin(angle) * force * 2;
          } else {
            // Attract on hover
            this.speedX += Math.cos(angle) * force * 0.5;
            this.speedY += Math.sin(angle) * force * 0.5;
          }
        }

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply friction
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        // Boundary check
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }

        // Pulsing effect
        this.pulseOffset += this.pulseSpeed;
        const pulse = Math.sin(this.pulseOffset) * 0.3 + 0.7;
        this.currentSize = this.size * pulse;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.currentSize,
          this.x, this.y, this.currentSize * 3
        );
        gradient.addColorStop(0, this.color.replace('0.8', '0.4'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 255, 127, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Mouse event handlers
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      mouseRef.current.clicked = true;
      
      // Create shockwave effect
      createShockwave(mouseRef.current.x, mouseRef.current.y);
      
      setTimeout(() => {
        mouseRef.current.clicked = false;
      }, 200);
    };

    const createShockwave = (x, y) => {
      const shockwave = {
        x,
        y,
        radius: 0,
        maxRadius: 200,
        speed: 8,
        alpha: 0.5,
        color: 'rgba(0, 255, 127, 0.3)'
      };

      const drawShockwave = () => {
        if (shockwave.radius < shockwave.maxRadius) {
          ctx.beginPath();
          ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = shockwave.color.replace('0.3', shockwave.alpha.toString());
          ctx.lineWidth = 2;
          ctx.stroke();

          shockwave.radius += shockwave.speed;
          shockwave.alpha -= 0.02;

          requestAnimationFrame(drawShockwave);
        }
      };

      drawShockwave();
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default CosmicParticles;