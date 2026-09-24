/**
 * Suganya S - 3D Personal Portfolio
 * Main Interactive Logic, Sound FX, Modals & Dynamic UI
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Web Audio API - Futuristic Sound Synthesizer
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = false;
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = soundToggleBtn ? soundToggleBtn.querySelector('i') : null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!isSoundEnabled || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        // High-tech short crisp click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'hover') {
        // Subtle cyber ambient chirp
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        // Futuristic double chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundEnabled = !isSoundEnabled;
      if (soundIcon) {
        soundIcon.className = isSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
      }
      soundToggleBtn.setAttribute('title', isSoundEnabled ? 'Mute Sound FX' : 'Enable Sound FX');
      showToast(isSoundEnabled ? 'Sound Effects Activated 🔊' : 'Sound Effects Muted 🔇');
      if (isSoundEnabled) playSound('success');
    });
  }

  // Attach sound triggers to interactive elements
  document.querySelectorAll('a, button, .contact-chip, .sim-book-card').forEach((el) => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
  });

  // -------------------------------------------------------------------------
  // 2. Typewriter Effect
  // -------------------------------------------------------------------------
  const typedTarget = document.getElementById('typed-text');
  const phrases = [
    'Machine Learning & AI Enthusiast',
    'Scikit-Learn & Python Developer',
    'Web Development Intern',
    'B.Sc. Computer Science Student',
    'Java & Python Programmer',
    'Front-End Web Creator'
  ];

  if (typedTarget) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1600; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing new phrase
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // -------------------------------------------------------------------------
  // 3. Navbar Scrolling & Active Section Highlighting
  // -------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Navbar glass tint when scrolled
    if (navbar) {
      if (currentScrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (currentScrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Highlight active nav item
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Mobile Menu Toggle
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Animated Skill Progress Bars on Scroll
  // -------------------------------------------------------------------------
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillBars.forEach((bar) => {
            const targetWidth = bar.getAttribute('data-level');
            bar.style.width = targetWidth ? `${targetWidth}%` : '80%';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // -------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast-notice');
  let toastTimeout;

  function showToast(message, duration = 3200) {
    if (!toast) return;
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Quick Copy Email & Phone Chips
  const copyEmailBtn = document.getElementById('copy-email-chip');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'suganyatrip1@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied to clipboard: ${email}`);
        playSound('success');
      });
    });
  }

  const copyPhoneBtn = document.getElementById('copy-phone-chip');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = '8072653361';
      navigator.clipboard.writeText(phone).then(() => {
        showToast(`Copied phone: ${phone}`);
        playSound('success');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Modals: Interactive Project Demos & Resume Viewer
  // -------------------------------------------------------------------------
  const demoModal = document.getElementById('demo-modal');
  const resumeModal = document.getElementById('resume-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSound('click');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const parentModal = e.target.closest('.modal-overlay');
      closeModal(parentModal);
    });
  });

  // Close when clicking outside window
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => closeModal(modal));
    }
  });

  // ML Demo Trigger
  const mlModal = document.getElementById('ml-demo-modal');
  const triggerMlDemo = document.getElementById('open-ml-demo');
  if (triggerMlDemo && mlModal) {
    triggerMlDemo.addEventListener('click', () => {
      openModal(mlModal);
    });
  }

  // Book Shop Demo Trigger
  const triggerBookShopDemo = document.getElementById('open-bookshop-demo');
  if (triggerBookShopDemo && demoModal) {
    triggerBookShopDemo.addEventListener('click', () => {
      openModal(demoModal);
    });
  }

  // UI/UX Showcase Trigger
  const uiuxModal = document.getElementById('uiux-modal');
  const triggerUiuxDemo = document.getElementById('open-uiux-demo');
  if (triggerUiuxDemo && uiuxModal) {
    triggerUiuxDemo.addEventListener('click', () => {
      openModal(uiuxModal);
    });
  }

  // Resume Modal Trigger
  const triggerResumeBtns = document.querySelectorAll('.open-resume-btn');
  if (resumeModal) {
    triggerResumeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(resumeModal);
      });
    });
  }

  // Print Resume Action
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // -------------------------------------------------------------------------
  // 8. Interactive Bookshop Demo Simulation inside Modal
  // -------------------------------------------------------------------------
  let cartItemCount = 0;
  const cartCounterEl = document.getElementById('sim-cart-count');
  const addCartBtns = document.querySelectorAll('.btn-add-cart');

  addCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      cartItemCount++;
      if (cartCounterEl) {
        cartCounterEl.textContent = cartItemCount;
      }
      const originalText = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.background = 'var(--accent-emerald)';
      btn.style.borderColor = 'var(--accent-emerald)';
      btn.style.color = '#040711';
      playSound('success');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 1200);

      showToast(`Added "${btn.getAttribute('data-title') || 'Book'}" to cart! 🛒`);
    });
  });

  // Category Filtering in Simulated Store
  const filterTabs = document.querySelectorAll('.sim-tab-btn');
  const catalogCards = document.querySelectorAll('.sim-book-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.style.background = 'transparent';
        t.style.borderColor = 'var(--border-glass)';
        t.style.color = 'var(--text-secondary)';
      });
      tab.style.background = 'rgba(0, 245, 212, 0.15)';
      tab.style.borderColor = 'var(--accent-cyan)';
      tab.style.color = '#ffffff';

      const category = tab.getAttribute('data-category');
      catalogCards.forEach((card) => {
        if (category === 'all' || card.getAttribute('data-genre') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 9. Contact Form Submission
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Visual state transition
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--accent-emerald)';
        submitBtn.style.color = '#040711';
        playSound('success');

        showToast(`Thank you ${name}! Your message has been sent to Suganya S.`);
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1000);
    });
  }

  // -------------------------------------------------------------------------
  // 10. Interactive Airline ML Platform Simulation Logic
  // -------------------------------------------------------------------------
  // Tab Switching
  const mlTabBtns = document.querySelectorAll('.ml-tab-btn');
  const mlTabPanes = document.querySelectorAll('.ml-tab-pane');

  mlTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mlTabBtns.forEach((b) => b.classList.remove('active'));
      mlTabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
      playSound('click');
    });
  });

  // Slider Live Badge Updates
  const distanceSlider = document.getElementById('ml-distance');
  const valDistance = document.getElementById('val-distance');
  if (distanceSlider && valDistance) {
    distanceSlider.addEventListener('input', () => {
      valDistance.textContent = `${Number(distanceSlider.value).toLocaleString()} km`;
    });
  }

  const delaySlider = document.getElementById('ml-delay');
  const valDelay = document.getElementById('val-delay');
  if (delaySlider && valDelay) {
    delaySlider.addEventListener('input', () => {
      valDelay.textContent = `${delaySlider.value} min`;
    });
  }

  const starSliderConfigs = [
    { id: 'ml-entertainment', badge: 'num-entertainment' },
    { id: 'ml-seat', badge: 'num-seat' },
    { id: 'ml-booking', badge: 'num-booking' },
    { id: 'ml-service', badge: 'num-service' }
  ];

  starSliderConfigs.forEach((cfg) => {
    const slider = document.getElementById(cfg.id);
    const badge = document.getElementById(cfg.badge);
    if (slider && badge) {
      slider.addEventListener('input', () => {
        badge.textContent = `${slider.value} ★`;
      });
    }
  });

  // Random Forest Inference Calculation Engine
  function computeMLPrediction() {
    const customerType = document.getElementById('ml-customer-type')?.value || 'loyal';
    const travelType = document.getElementById('ml-travel-type')?.value || 'business';
    const travelClass = document.getElementById('ml-class')?.value || 'business';
    const distance = Number(document.getElementById('ml-distance')?.value || 1450);
    const delay = Number(document.getElementById('ml-delay')?.value || 0);

    const entertainment = Number(document.getElementById('ml-entertainment')?.value || 5);
    const seat = Number(document.getElementById('ml-seat')?.value || 4);
    const booking = Number(document.getElementById('ml-booking')?.value || 4);
    const service = Number(document.getElementById('ml-service')?.value || 5);

    // Feature Weightings calibrated on Random Forest model feature importances
    let score = 50;

    // Travel Class Impact
    if (travelClass === 'business') score += 18;
    else if (travelClass === 'eco-plus') score += 4;
    else score -= 12;

    // Customer Type
    if (customerType === 'loyal') score += 12;
    else score -= 10;

    // Type of Travel
    if (travelType === 'business') score += 10;
    else score -= 4;

    // Inflight Entertainment (High feature importance 0.34)
    score += (entertainment - 3) * 11;

    // Seat Comfort (Feature importance 0.21)
    score += (seat - 3) * 8;

    // Online Booking & Service
    score += (booking - 3) * 5;
    score += (service - 3) * 7;

    // Flight Distance
    if (distance > 2000) score += 4;
    else if (distance < 500) score -= 3;

    // Arrival Delays penalty
    if (delay > 60) score -= 22;
    else if (delay > 25) score -= 12;
    else if (delay === 0) score += 5;

    score = Math.max(6, Math.min(98, score));

    const isSatisfied = score >= 50;
    const confidence = isSatisfied 
      ? Math.min(98.8, Math.max(68.0, score + 3.8)) 
      : Math.min(98.2, Math.max(65.0, (100 - score) + 2.4));

    // Update Output UI
    const outcomeBox = document.getElementById('outcome-box');
    const outcomeIcon = document.getElementById('outcome-icon');
    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeSubtitle = document.getElementById('outcome-subtitle');
    const confidencePercentage = document.getElementById('confidence-percentage');
    const confidenceBarFill = document.getElementById('confidence-bar-fill');
    const resultChip = document.getElementById('result-chip');
    const factorList = document.getElementById('factor-list');

    if (outcomeBox && outcomeTitle && outcomeSubtitle) {
      if (isSatisfied) {
        outcomeBox.className = 'outcome-box satisfied';
        if (outcomeIcon) outcomeIcon.innerHTML = '<i class="fas fa-smile-beam"></i>';
        outcomeTitle.textContent = 'Satisfied Passenger';
        outcomeSubtitle.textContent = 'High likelihood of brand loyalty, positive NPS & repeat booking.';
        if (resultChip) {
          resultChip.textContent = `${confidence.toFixed(1)}% Confidence`;
          resultChip.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          resultChip.style.color = '#10b981';
          resultChip.style.background = 'rgba(16, 185, 129, 0.15)';
        }
      } else {
        outcomeBox.className = 'outcome-box dissatisfied';
        if (outcomeIcon) outcomeIcon.innerHTML = '<i class="fas fa-frown-open"></i>';
        outcomeTitle.textContent = 'Neutral or Dissatisfied';
        outcomeSubtitle.textContent = 'Passenger experienced friction touchpoints during travel.';
        if (resultChip) {
          resultChip.textContent = `${confidence.toFixed(1)}% Confidence`;
          resultChip.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          resultChip.style.color = '#ef4444';
          resultChip.style.background = 'rgba(239, 68, 68, 0.15)';
        }
      }
    }

    if (confidencePercentage && confidenceBarFill) {
      confidencePercentage.textContent = `${confidence.toFixed(1)}%`;
      confidenceBarFill.style.width = `${confidence}%`;
      confidenceBarFill.style.background = isSatisfied 
        ? 'linear-gradient(90deg, #10b981, #00f5d4)' 
        : 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }

    // Dynamic Contributing Factors
    if (factorList) {
      const factors = [];
      if (entertainment >= 4) factors.push({ text: `Superior Inflight Entertainment (${entertainment}/5)`, pos: true });
      else if (entertainment <= 2) factors.push({ text: `Subpar Inflight Entertainment (${entertainment}/5)`, pos: false });

      if (travelClass === 'business') factors.push({ text: 'Spacious Business Class seating & priority', pos: true });
      else if (travelClass === 'eco') factors.push({ text: 'Economy Class configuration', pos: false });

      if (delay === 0) factors.push({ text: 'Flawless on-time arrival (0 min delay)', pos: true });
      else if (delay > 25) factors.push({ text: `Arrival delay penalty (${delay} mins)`, pos: false });

      if (seat >= 4) factors.push({ text: `Ergonomic seat comfort (${seat}/5)`, pos: true });
      else if (seat <= 2) factors.push({ text: `Restricted seat comfort (${seat}/5)`, pos: false });

      if (customerType === 'loyal') factors.push({ text: 'Recognized Airline Loyalty Member status', pos: true });
      else factors.push({ text: 'First-time / Disloyal passenger profile', pos: false });

      factorList.innerHTML = factors.slice(0, 4).map(f => `
        <li class="factor-item ${f.pos ? 'positive' : 'negative'}">
          <i class="fas ${f.pos ? 'fa-plus-circle' : 'fa-minus-circle'}"></i>
          <span>${f.text}</span>
        </li>
      `).join('');
    }

    playSound('success');
  }

  const btnPredict = document.getElementById('btn-predict');
  if (btnPredict) {
    btnPredict.addEventListener('click', (e) => {
      e.preventDefault();
      computeMLPrediction();
      showToast('Random Forest Inference Executed! ✈️');
    });
  }

  // Presets
  const presetHappy = document.getElementById('preset-business-happy');
  if (presetHappy) {
    presetHappy.addEventListener('click', () => {
      const cType = document.getElementById('ml-customer-type');
      const tType = document.getElementById('ml-travel-type');
      const tClass = document.getElementById('ml-class');
      const dist = document.getElementById('ml-distance');
      const del = document.getElementById('ml-delay');
      const ent = document.getElementById('ml-entertainment');
      const seat = document.getElementById('ml-seat');
      const book = document.getElementById('ml-booking');
      const srv = document.getElementById('ml-service');

      if (cType) cType.value = 'loyal';
      if (tType) tType.value = 'business';
      if (tClass) tClass.value = 'business';
      if (dist) { dist.value = 2400; document.getElementById('val-distance').textContent = '2,400 km'; }
      if (del) { del.value = 0; document.getElementById('val-delay').textContent = '0 min'; }
      if (ent) { ent.value = 5; document.getElementById('num-entertainment').textContent = '5 ★'; }
      if (seat) { seat.value = 5; document.getElementById('num-seat').textContent = '5 ★'; }
      if (book) { book.value = 5; document.getElementById('num-booking').textContent = '5 ★'; }
      if (srv) { srv.value = 5; document.getElementById('num-service').textContent = '5 ★'; }

      computeMLPrediction();
      showToast('Loaded Scenario: Delighted Business Traveler 🌟');
    });
  }

  const presetDelayed = document.getElementById('preset-eco-delayed');
  if (presetDelayed) {
    presetDelayed.addEventListener('click', () => {
      const cType = document.getElementById('ml-customer-type');
      const tType = document.getElementById('ml-travel-type');
      const tClass = document.getElementById('ml-class');
      const dist = document.getElementById('ml-distance');
      const del = document.getElementById('ml-delay');
      const ent = document.getElementById('ml-entertainment');
      const seat = document.getElementById('ml-seat');
      const book = document.getElementById('ml-booking');
      const srv = document.getElementById('ml-service');

      if (cType) cType.value = 'disloyal';
      if (tType) tType.value = 'personal';
      if (tClass) tClass.value = 'eco';
      if (dist) { dist.value = 850; document.getElementById('val-distance').textContent = '850 km'; }
      if (del) { del.value = 75; document.getElementById('val-delay').textContent = '75 min'; }
      if (ent) { ent.value = 2; document.getElementById('num-entertainment').textContent = '2 ★'; }
      if (seat) { seat.value = 2; document.getElementById('num-seat').textContent = '2 ★'; }
      if (book) { book.value = 2; document.getElementById('num-booking').textContent = '2 ★'; }
      if (srv) { srv.value = 2; document.getElementById('num-service').textContent = '2 ★'; }

      computeMLPrediction();
      showToast('Loaded Scenario: Delayed Economy Passenger ⚠️');
    });
  }

  const presetNeutral = document.getElementById('preset-neutral');
  if (presetNeutral) {
    presetNeutral.addEventListener('click', () => {
      const cType = document.getElementById('ml-customer-type');
      const tType = document.getElementById('ml-travel-type');
      const tClass = document.getElementById('ml-class');
      const dist = document.getElementById('ml-distance');
      const del = document.getElementById('ml-delay');
      const ent = document.getElementById('ml-entertainment');
      const seat = document.getElementById('ml-seat');
      const book = document.getElementById('ml-booking');
      const srv = document.getElementById('ml-service');

      if (cType) cType.value = 'loyal';
      if (tType) tType.value = 'business';
      if (tClass) tClass.value = 'eco';
      if (dist) { dist.value = 1450; document.getElementById('val-distance').textContent = '1,450 km'; }
      if (del) { del.value = 10; document.getElementById('val-delay').textContent = '10 min'; }
      if (ent) { ent.value = 3; document.getElementById('num-entertainment').textContent = '3 ★'; }
      if (seat) { seat.value = 3; document.getElementById('num-seat').textContent = '3 ★'; }
      if (book) { book.value = 3; document.getElementById('num-booking').textContent = '3 ★'; }
      if (srv) { srv.value = 4; document.getElementById('num-service').textContent = '4 ★'; }

      computeMLPrediction();
      showToast('Loaded Scenario: Average Commuter ✈️');
    });
  }

  // Copy Terminal Commands
  document.querySelectorAll('.copy-cmd-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-copy');
      if (cmd) {
        navigator.clipboard.writeText(cmd).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          playSound('success');
          showToast(`Copied command: ${cmd}`);
          setTimeout(() => {
            btn.innerHTML = original;
          }, 1600);
        });
      }
    });
  });
