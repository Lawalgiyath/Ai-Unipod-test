/**
 * Immersive Particle System for Hero Sections
 * Lightweight canvas-based particle animation
 */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.draggedParticle = null;
    
    // Options
    this.particleCount = options.particleCount || 100;
    this.particleColor = options.particleColor || 'rgba(30, 132, 194, 0.9)'; // Brighter UniPods Blue
    this.lineColor = options.lineColor || 'rgba(30, 132, 194, 0.3)'; // Brighter connections
    this.particleSize = options.particleSize || 2;
    this.speed = options.speed || 0.5;
    this.connectionDistance = options.connectionDistance || 120;
    
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.draggedParticle = null;
    });
    
    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.canvas.addEventListener('touchend', () => this.handleMouseUp());
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        size: Math.random() * this.particleSize + 1
      });
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    
    // If dragging, move the particle
    if (this.draggedParticle) {
      this.draggedParticle.x = this.mouse.x;
      this.draggedParticle.y = this.mouse.y;
      this.draggedParticle.vx = 0;
      this.draggedParticle.vy = 0;
    }
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Find particle near click
    for (let particle of this.particles) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 20) {
        this.draggedParticle = particle;
        this.canvas.style.cursor = 'grabbing';
        break;
      }
    }
  }

  handleMouseUp() {
    if (this.draggedParticle) {
      // Give it a small random velocity when released
      this.draggedParticle.vx = (Math.random() - 0.5) * this.speed;
      this.draggedParticle.vy = (Math.random() - 0.5) * this.speed;
    }
    this.draggedParticle = null;
    this.canvas.style.cursor = 'default';
  }

  handleTouchStart(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    
    for (let particle of this.particles) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 30) {
        this.draggedParticle = particle;
        break;
      }
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    this.mouse.x = touch.clientX - rect.left;
    this.mouse.y = touch.clientY - rect.top;
    
    if (this.draggedParticle) {
      this.draggedParticle.x = this.mouse.x;
      this.draggedParticle.y = this.mouse.y;
      this.draggedParticle.vx = 0;
      this.draggedParticle.vy = 0;
    }
  }

  update() {
    this.particles.forEach(particle => {
      // Skip update if particle is being dragged
      if (particle === this.draggedParticle) return;
      
      // Update position with more fluid motion
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Smooth bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -0.9;
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -0.9;
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      }

      // Mouse interaction - more fluid
      if (this.mouse.x !== null && this.mouse.y !== null && !this.draggedParticle) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.15;
          particle.vy -= Math.sin(angle) * force * 0.15;
        }
      }

      // Very light damping to keep particles moving
      particle.vx *= 0.998;
      particle.vy *= 0.998;
      
      // Add continuous random motion for organic floating feel
      particle.vx += (Math.random() - 0.5) * 0.08;
      particle.vy += (Math.random() - 0.5) * 0.08;
      
      // Limit max speed to keep it smooth
      const maxSpeed = this.speed * 2;
      const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (currentSpeed > maxSpeed) {
        particle.vx = (particle.vx / currentSpeed) * maxSpeed;
        particle.vy = (particle.vy / currentSpeed) * maxSpeed;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections with brighter colors
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = 1 - (distance / this.connectionDistance);
          this.ctx.strokeStyle = this.lineColor.replace('0.3', opacity * 0.4);
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw particles with glow effect
    this.particles.forEach(particle => {
      // Glow effect
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, this.particleColor);
      gradient.addColorStop(1, 'rgba(30, 132, 194, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Core particle
      this.ctx.fillStyle = this.particleColor;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Highlight if being dragged
      if (particle === this.draggedParticle) {
        this.ctx.strokeStyle = 'rgba(255, 222, 89, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize particles on pages with hero-particles canvas
document.addEventListener('DOMContentLoaded', () => {
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    new ParticleSystem('heroParticles', {
      particleCount: 90,
      particleColor: 'rgba(30, 132, 194, 0.9)', // Brighter particles
      lineColor: 'rgba(30, 132, 194, 0.3)', // Brighter connections
      particleSize: 3,
      speed: 0.6, // Increased base speed
      connectionDistance: 160
    });
  }
});
