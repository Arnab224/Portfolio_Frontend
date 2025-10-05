// src/components/MatrixBackground.jsx
import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const particlesRef = useRef([]);
  const hexagonsRef = useRef([]);
  const rippleRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Tech symbols and characters for matrix rain
    const chars = '01{}[]<>();/#@$%&*+-=~|λπΣΔΩ';
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);
    const charColors = ['#00ff88', '#00ccff', '#ff0080', '#ffaa00', '#8844ff'];

    // Enhanced Particle system
    class Particle {
      constructor(x, y, isCursor = false) {
        this.x = x;
        this.y = y;
        this.size = isCursor ? Math.random() * 4 + 2 : Math.random() * 3 + 1;
        this.speedX = isCursor ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 4;
        this.speedY = isCursor ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 4;
        this.color = charColors[Math.floor(Math.random() * charColors.length)];
        this.life = isCursor ? 80 : 60;
        this.originalLife = this.life;
        this.isCursor = isCursor;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.isCursor) {
          this.size *= 0.97;
        } else {
          this.size *= 0.95;
        }
      }
      
      draw() {
        const alpha = this.life / this.originalLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        
        if (this.isCursor && Math.random() > 0.7) {
          // Draw as character sometimes for cursor particles
          ctx.font = `${this.size * 3}px "JetBrains Mono"`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], this.x, this.y);
        } else {
          // Draw as rectangle
          ctx.fillRect(this.x, this.y, this.size, this.size);
        }
      }
    }

    // Ripple effect for cursor
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 100;
        this.speed = 4;
        this.alpha = 0.8;
        this.color = '#00ff88';
      }
      
      update() {
        this.radius += this.speed;
        this.alpha -= 0.02;
        return this.alpha > 0 && this.radius < this.maxRadius;
      }
      
      draw() {
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ripple
        if (this.radius > 20) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius - 15, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Hexagon grid with cursor influence
    class Hexagon {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.pulse = Math.random() * Math.PI * 2;
        this.speed = 0.01 + Math.random() * 0.01;
        this.alpha = 0.05 + Math.random() * 0.1;
        this.originalAlpha = this.alpha;
        this.distanceToCursor = 0;
      }
      
      update(cursorX, cursorY) {
        this.pulse += this.speed;
        
        // Calculate distance to cursor
        this.distanceToCursor = Math.sqrt(
          Math.pow(this.x - cursorX, 2) + Math.pow(this.y - cursorY, 2)
        );
        
        // Pulse more when cursor is near
        if (this.distanceToCursor < 200) {
          const intensity = 1 - (this.distanceToCursor / 200);
          this.alpha = this.originalAlpha + Math.sin(this.pulse) * 0.2 * intensity;
          this.speed = 0.02 + intensity * 0.03;
        } else {
          this.alpha = this.originalAlpha + Math.sin(this.pulse) * 0.05;
          this.speed = 0.01 + Math.random() * 0.01;
        }
      }
      
      draw() {
        ctx.strokeStyle = `rgba(0, 255, 136, ${this.alpha})`;
        ctx.lineWidth = 0.5 + (this.alpha * 2);
        ctx.beginPath();
        
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = this.x + this.size * Math.cos(angle);
          const y = this.y + this.size * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Initialize hexagon grid
    const initHexagons = () => {
      hexagonsRef.current = [];
      const size = 40;
      const spacing = size * 1.5;
      
      for (let x = -spacing; x < canvas.width + spacing; x += spacing) {
        for (let y = -spacing; y < canvas.height + spacing; y += spacing * 1.5) {
          const offset = (y / spacing) % 2 === 0 ? spacing / 2 : 0;
          hexagonsRef.current.push(new Hexagon(x + offset, y, size));
        }
      }
    };

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      
      // Create cursor particles
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(new Particle(
          mouseRef.current.x + (Math.random() - 0.5) * 20,
          mouseRef.current.y + (Math.random() - 0.5) * 20,
          true
        ));
      }
      
      // Create ripple occasionally
      if (Math.random() > 0.7) {
        rippleRef.current.push(new Ripple(mouseRef.current.x, mouseRef.current.y));
      }
      
      // Disturb matrix drops near cursor
      const cursorColumn = Math.floor(mouseRef.current.x / 20);
      for (let i = Math.max(0, cursorColumn - 3); i < Math.min(columns, cursorColumn + 3); i++) {
        if (Math.random() > 0.8) {
          drops[i] += 2; // Speed up drops near cursor
        }
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current.x = -100;
      mouseRef.current.y = -100;
    };

    // Main animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hexagon grid with cursor influence
      hexagonsRef.current.forEach(hex => {
        hex.update(mouseRef.current.x, mouseRef.current.y);
        hex.draw();
      });

      // Matrix rain effect
      ctx.font = '14px "JetBrains Mono", monospace';
      
      drops.forEach((y, index) => {
        const x = index * 20;
        const distanceToCursor = Math.sqrt(
          Math.pow(x - mouseRef.current.x, 2) + Math.pow(y * 20 - mouseRef.current.y, 2)
        );
        
        // Change color and speed based on cursor proximity
        let charColor = '#00ff88';
        let charSize = 14;
        
        if (distanceToCursor < 150) {
          const intensity = 1 - (distanceToCursor / 150);
          charColor = charColors[Math.floor(intensity * charColors.length)];
          charSize = 14 + intensity * 6;
        }
        
        ctx.fillStyle = charColor;
        ctx.font = `${charSize}px "JetBrains Mono"`;
        
        const char = Math.random() > 0.1 ? 
          chars[Math.floor(Math.random() * chars.length)] : 
          ['{ }', '< >', '[ ]', '();', '# $'][Math.floor(Math.random() * 5)];
        
        ctx.fillText(char, x, y * 20);
        
        // Enhanced trail with cursor influence
        for (let i = 1; i < 8; i++) {
          const trailY = (y - i) * 20;
          if (trailY > 0) {
            const alpha = (1 - (i / 8)) * 0.4;
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            const trailChar = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(trailChar, x, trailY);
          }
        }
        
        // Reset drop when it reaches bottom
        if (y * 20 > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }
        drops[index]++;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw();
        return particle.life > 0 && particle.size > 0.1;
      });

      // Update and draw ripples
      rippleRef.current = rippleRef.current.filter(ripple => {
        return ripple.update();
      });
      rippleRef.current.forEach(ripple => ripple.draw());

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Cursor glow effect
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        // Main cursor circle
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        
        // Pulsing inner circle
        const pulseSize = 15 + Math.sin(Date.now() * 0.01) * 5;
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Connection lines to nearby hexagons
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 0.5;
        hexagonsRef.current.forEach(hex => {
          if (hex.distanceToCursor < 150) {
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(hex.x, hex.y);
            ctx.stroke();
          }
        });
      }

      requestAnimationFrame(animate);
    };

    // Initialize
    initHexagons();
    
    // Event listeners
    window.addEventListener('resize', () => {
      setCanvasSize();
      initHexagons();
    });
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-bg fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default MatrixBackground;