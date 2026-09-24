/**
 * Suganya S - 3D Personal Portfolio
 * 3D Tilt Physics & Magnetic Glowing Cursor
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Magnetic Glowing Cursor
  // -------------------------------------------------------------------------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  if (cursorDot && cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lerp for glow cursor
    function renderCursor() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover state over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, .glass-card, .contact-chip, .btn, .project-card, .profile-card-3d';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. 3D Tilt Physics for Cards
  // -------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      document.addEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(e) {
      if (!bounds) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      };

      // Degree of tilt (max 12 deg for subtle high-end feel)
      const maxTilt = 10;
      const rotateX = -(center.y / (bounds.height / 2)) * maxTilt;
      const rotateY = (center.x / (bounds.width / 2)) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Update glare gradient position
      const glarePercentX = (leftX / bounds.width) * 100;
      const glarePercentY = (topY / bounds.height) * 100;
      card.style.setProperty('--mouse-x', `${glarePercentX.toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${glarePercentY.toFixed(1)}%`);
    }

    function onMouseLeave() {
      document.removeEventListener('mousemove', onMouseMove);
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
  });
})();
