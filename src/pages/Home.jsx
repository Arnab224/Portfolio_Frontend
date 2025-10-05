// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MatrixBackground from '../components/MatrixBackground';
import GridOverlay from '../components/GridOverlay';
import { projectsData } from '../data/projects';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef(null);

  const terminalLines = [
    '> npm init -y',
    '> git config --global user.name "Arnab Mandal"',
    '> git config --global user.email "mandal.arnab.abc.224@gmail.com"',
    '> echo "Full Stack Developer | React.js | Node.js | MongoDB" >> bio.txt',
    '> cat skills.txt',
    'JavaScript (ES6+) | Python | React.js | Node.js | Express.js',
    'MongoDB | SQL | Tailwind CSS | Redux | RESTful APIs | JWT',
    'AWS | Docker | Git | Postman | CI/CD',
    '> ./start_portfolio.sh'
  ];

  useEffect(() => {
    const featured = projectsData.filter(project => project.featured).slice(0, 3);
    setFeaturedProjects(featured);
  }, []);

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + (prev ? '\n' : '') + terminalLines[currentLine]);
        setCurrentLine(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, terminalLines]);

  // Cosmic Particle Animation
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.7';
    document.body.appendChild(canvas);

    let animationId;
    const particles = [];
    const mouse = { x: 0, y: 0, clicked: false };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getCosmicColor();
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.trail = [];
        this.maxTrailLength = 5;
      }

      getCosmicColor() {
        const colors = [
          'rgba(0, 255, 127, 0.8)',  // Matrix green
          'rgba(64, 224, 208, 0.6)', // Turquoise
          'rgba(138, 43, 226, 0.7)', // Blue violet
          'rgba(0, 191, 255, 0.6)',  // Deep sky blue
          'rgba(123, 104, 238, 0.7)', // Medium slate blue
          'rgba(106, 90, 205, 0.6)', // Slate blue
          'rgba(72, 61, 139, 0.5)'   // Dark slate blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const angle = Math.atan2(dy, dx);
          const force = (200 - distance) / 200 * 0.8;
          
          if (mouse.clicked) {
            // Repel on click with more force
            this.speedX -= Math.cos(angle) * force * 3;
            this.speedY -= Math.sin(angle) * force * 3;
            
            // Add cosmic energy burst effect
            if (distance < 100) {
              this.speedX += (Math.random() - 0.5) * 2;
              this.speedY += (Math.random() - 0.5) * 2;
            }
          } else {
            // Gentle attraction on hover
            this.speedX += Math.cos(angle) * force * 0.3;
            this.speedY += Math.sin(angle) * force * 0.3;
          }
        }

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply cosmic drift
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.speedY += (Math.random() - 0.5) * 0.1;

        // Apply friction
        this.speedX *= 0.97;
        this.speedY *= 0.97;

        // Boundary check with wrap-around
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // Pulsing effect
        this.pulseOffset += this.pulseSpeed;
        this.currentSize = this.size * (Math.sin(this.pulseOffset) * 0.3 + 0.7);
      }

      draw() {
        // Draw trail
        ctx.strokeStyle = this.color.replace('0.8', '0.3');
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trail.forEach((point, index) => {
          const alpha = index / this.trail.length;
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.currentSize,
          this.x, this.y, this.currentSize * 4
        );
        gradient.addColorStop(0, this.color.replace('0.8', '0.4'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    createParticles();

    // Ripple effect for clicks
    const ripples = [];
    
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 300;
        this.speed = 8;
        this.alpha = 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 200)}, 0.3)`;
      }

      update() {
        this.radius += this.speed;
        this.alpha -= 0.02;
        return this.alpha > 0;
      }

      draw() {
        ctx.strokeStyle = this.color.replace('0.3', this.alpha.toString());
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const createRipple = (x, y) => {
      ripples.push(new Ripple(x, y));
    };

    // Animation loop
    const animate = () => {
      // Clear with fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw energy connections between particles
      ctx.strokeStyle = 'rgba(0, 255, 127, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const alpha = (120 - distance) / 120 * 0.2;
            ctx.strokeStyle = `rgba(64, 224, 208, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (!ripples[i].update()) {
          ripples.splice(i, 1);
        } else {
          ripples[i].draw();
        }
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse event handlers
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = (e) => {
      mouse.clicked = true;
      createRipple(e.clientX, e.clientY);
      
      // Create multiple ripples for cosmic effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createRipple(
            e.clientX + (Math.random() - 0.5) * 50,
            e.clientY + (Math.random() - 0.5) * 50
          );
        }, i * 100);
      }
      
      setTimeout(() => {
        mouse.clicked = false;
      }, 300);
    };

    // Random cosmic events
    const createRandomCosmicEvent = () => {
      if (Math.random() > 0.98) {
        createRipple(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        );
      }
    };

    setInterval(createRandomCosmicEvent, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    });
    window.addEventListener('touchstart', (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      handleMouseDown(e);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseDown);
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  const skills = {
  languages: [
    { name: 'JavaScript (ES6+)', level: 95 },
    { name: 'Python', level: 90 },
  ],
  frontend: [
    { name: 'React.js', level: 90 },
    { name: 'Redux', level: 85 },
    { name: 'HTML5', level: 95 },
    { name: 'CSS3', level: 95 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Bootstrap', level: 85 },
  ],
  backend: [
    { name: 'Node.js', level: 88 },
    { name: 'Express.js', level: 85 },
    { name: 'RESTful APIs', level: 90 },
    { name: 'JWT', level: 85 },
    { name: 'MVC Architecture', level: 80 },
  ],
  databases: [
    { name: 'MongoDB', level: 85 },
    { name: 'SQL', level: 80 },
  ],
  tools: [
    { name: 'Git & GitHub', level: 90 },
    { name: 'Postman', level: 85 },
    { name: 'Figma', level: 75 },
    { name: 'Jira', level: 80 },
    { name: 'Kibana', level: 70 },
    { name: 'Docker', level: 75 },
  ],
  cloud: [
    { name: 'AWS (S3)', level: 75 },
    { name: 'Cloudinary', level: 80 },
    { name: 'CI/CD', level: 70 },
  ]
};


  return (
    <div ref={containerRef} className="pt-16 relative min-h-screen cyber-grid">
      <MatrixBackground />
      <GridOverlay />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Terminal Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 font-mono cosmic-glow"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm ml-2">terminal — zsh</span>
            </div>
            <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap">
              {typedText}
              <span className="terminal-cursor animate-pulse">█</span>
            </pre>
          </motion.div>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold font-mono hologram-effect">
                <span className="text-gray-400">&gt;_ </span>
                <span className="terminal-text bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  ARNAB MANDAL
                </span>
              </h1>
              <div className="text-xl text-green-400 font-mono">
                <span className="text-gray-400">// </span>
                Full Stack Developer
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Building scalable applications with modern tech stack. 
                Proven ability to lead feature development and drive cross-functional collaboration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/projects"
                className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded font-mono text-sm transition-all duration-300 hover:glow-primary hover:scale-105 cosmic-glow"
              >
                $ view_projects.sh
              </Link>
              <Link
                to="/contact"
                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-400 px-6 py-3 rounded font-mono text-sm transition-all duration-300 hover:glow-secondary hover:scale-105 cosmic-glow"
              >
                $ connect_ssh.sh
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center cosmic-glow">
                <div className="text-2xl font-bold text-green-400">3+</div>
                <div className="text-xs text-gray-400">YEARS</div>
              </div>
              <div className="text-center cosmic-glow">
                <div className="text-2xl font-bold text-blue-400">5+</div>
                <div className="text-xs text-gray-400">PROJECTS</div>
              </div>
              <div className="text-center cosmic-glow">
                <div className="text-2xl font-bold text-purple-400">99.9%</div>
                <div className="text-xs text-gray-400">UPTIME</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-black/30 backdrop-blur-sm relative z-10">
  <div className="max-w-6xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold font-mono text-center mb-12 cosmic-glow"
    >
      <span className="text-gray-400">~/skills/</span>
      <span className="terminal-text bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
        tech_stack.txt
      </span>
    </motion.h2>

    {/* Skills Grid - Simple and Clean */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Languages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ LANGUAGES</h3>
        </div>
        <div className="space-y-4">
          {skills.languages.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Frontend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ FRONTEND</h3>
        </div>
        <div className="space-y-4">
          {skills.frontend.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Backend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ BACKEND</h3>
        </div>
        <div className="space-y-4">
          {skills.backend.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Databases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ DATABASES</h3>
        </div>
        <div className="space-y-4">
          {skills.databases.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ TOOLS</h3>
        </div>
        <div className="space-y-4">
          {skills.tools.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cloud & DevOps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 cosmic-glow hover:border-green-500/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-green-400 font-mono text-sm">$ CLOUD & DEVOPS</h3>
        </div>
        <div className="space-y-4">
          {skills.cloud.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono text-sm">{skill.name}</span>
                <span className="text-gray-400 text-xs">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full cosmic-glow"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Skills Summary */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-12 text-center"
    >
      <div className="bg-black/80 border border-green-500/30 rounded-lg p-6 font-mono cosmic-glow inline-block">
        <div className="text-green-400 text-sm mb-2">
          $ skills_summary.sh --total={Object.values(skills).flat().length}
        </div>
        <div className="text-gray-400 text-xs">
          Total Technologies: {Object.values(skills).flat().length} | Mastered: {Object.values(skills).flat().filter(skill => skill.level >= 80).length}
        </div>
      </div>
    </motion.div>
  </div>
</section>


      {/* Experience Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-mono text-center mb-12 cosmic-glow"
          >
            <span className="text-gray-400">~/experience/</span>
            <span className="terminal-text bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              career.log
            </span>
          </motion.h2>

          <div className="space-y-8">
            {/* ResourceDekho */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 font-mono cosmic-glow hover:border-green-500/50 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-green-400 text-lg">Full Stack Developer</h3>
                  <p className="text-blue-400 text-sm">Resourcedekho • Feb 2023 – Present</p>
                </div>
                <span className="text-gray-400 text-sm mt-2 sm:mt-0">Bengaluru, IN</span>
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div>• Led development of 5+ responsive dashboards for 1,000+ daily users</div>
                <div>• Designed 15+ RESTful APIs, reducing data latency by 40%</div>
                <div>• Created reusable component library, cutting dev time by 25%</div>
                <div>• Implemented JWT auth across 8 modules (99.9% secure access)</div>
              </div>
            </motion.div>

            {/* Cognizant */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 font-mono cosmic-glow hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-blue-400 text-lg">Programmer Analyst Trainee</h3>
                  <p className="text-green-400 text-sm">Cognizant • Aug 2021 – May 2022</p>
                </div>
                <span className="text-gray-400 text-sm mt-2 sm:mt-0">Bengaluru, IN</span>
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div>• Owned 2 enterprise apps processing 10,000+ daily transactions</div>
                <div>• Reduced production bugs by 30% through optimization</div>
                <div>• Resolved 50+ critical issues in UAT cycles</div>
                <div>• Authored documentation reducing support tickets by 20%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-black/30 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-mono text-center mb-12 cosmic-glow"
          >
            <span className="text-gray-400">~/projects/</span>
            <span className="terminal-text bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              featured/
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden group hover:border-green-500/50 transition-all duration-300 cosmic-glow"
              >
                <div className="h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 relative">
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-green-400 font-mono text-lg group-hover:glow-primary transition-all duration-300">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-4 font-mono leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-mono border border-green-500/30 rounded cosmic-glow"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 text-xs">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        className="text-gray-400 hover:text-green-400 transition-colors font-mono border border-gray-600 hover:border-green-500 px-3 py-1 rounded cosmic-glow"
                      >
                        view src
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="text-gray-400 hover:text-blue-400 transition-colors font-mono border border-gray-600 hover:border-blue-500 px-3 py-1 rounded cosmic-glow"
                      >
                        live demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Link
              to="/projects"
              className="inline-block border border-green-500/50 text-green-400 hover:bg-green-500/10 hover:glow-primary px-6 py-3 rounded font-mono text-sm transition-all duration-300 cosmic-glow"
            >
              $ cd /projects && ls -la
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;