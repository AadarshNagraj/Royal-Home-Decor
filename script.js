/**
 * Royal Home Decor - Custom Interactivity Script
 * Includes: Sticky Header, Mobile Navigation Menu, Scroll Reveal, Stats Counters, 
 *           Interactive Lightbox Gallery, and Form Lead Routing.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Sticky Header scroll effect
  // ==========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Call once on load in case page is already scrolled

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('active');
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu if user clicks outside of it on mobile
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 3. Active Scroll Spy (Highlighting current section link)
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  
  const scrollSpy = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 200; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);

  // ==========================================================================
  // 4. Reveal on Scroll Animation (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 5. Statistics Counter Animation
  // ==========================================================================
  const statsSection = document.getElementById('stats');
  const statsNumbers = document.querySelectorAll('.stats-number');
  let statsAnimated = false;

  const animateCounters = () => {
    statsNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1800; // Total count duration in ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      let current = 0;

      const timer = setInterval(() => {
        current += Math.ceil(target / (duration / stepTime));
        if (current >= target) {
          stat.textContent = target + (stat.parentNode.textContent.includes('Years') ? '+' : '+');
          clearInterval(timer);
        } else {
          stat.textContent = current;
        }
      }, stepTime);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateCounters();
        statsAnimated = true;
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 6. Interactive Lightbox Gallery
  // ==========================================================================
  const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;

  const openLightbox = (index) => {
    currentPhotoIndex = index;
    const item = portfolioItems[currentPhotoIndex];
    const imgSrc = item.getAttribute('data-img');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');

    // Smooth transition effect
    lightboxImg.style.transform = 'scale(0.95)';
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind lightbox

    setTimeout(() => {
      lightboxImg.style.transform = 'scale(1)';
    }, 50);
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = ''; // restore scroll
  };

  const showNextImage = () => {
    let nextIndex = currentPhotoIndex + 1;
    if (nextIndex >= portfolioItems.length) {
      nextIndex = 0; // Wrap around
    }
    openLightbox(nextIndex);
  };

  const showPrevImage = () => {
    let prevIndex = currentPhotoIndex - 1;
    if (prevIndex < 0) {
      prevIndex = portfolioItems.length - 1; // Wrap around
    }
    openLightbox(prevIndex);
  };

  // Add click listeners to portfolio items
  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Lightbox control events
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Close on clicking the dark background overlay
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // ==========================================================================
  // 7. Lead Form Validation & WhatsApp Inquiry Redirection
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    let isValid = true;

    // Reset styles
    [nameInput, phoneInput, serviceSelect, messageTextarea].forEach(input => {
      input.style.border = '1px solid transparent';
    });

    // 1. Validate Name
    const nameValue = nameInput.value.trim();
    if (nameValue === '') {
      nameInput.style.border = '1.5px solid red';
      nameInput.focus();
      isValid = false;
    }

    // 2. Validate Phone (10 digits)
    const phoneValue = phoneInput.value.trim().replace(/\D/g, ''); // strip non-digits
    if (phoneValue.length !== 10) {
      phoneInput.style.border = '1.5px solid red';
      if (isValid) phoneInput.focus();
      isValid = false;
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // 3. Validate Service selection
    const serviceValue = serviceSelect.value;
    if (serviceValue === '') {
      serviceSelect.style.border = '1.5px solid red';
      if (isValid) serviceSelect.focus();
      isValid = false;
    }

    // 4. Validate Message
    const messageValue = messageTextarea.value.trim();
    if (messageValue === '') {
      messageTextarea.style.border = '1.5px solid red';
      if (isValid) messageTextarea.focus();
      isValid = false;
    }

    if (!isValid) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    // Prepare WhatsApp Message Content
    const whatsappNumber = '918827898343'; // Business Phone Number (+91 88278 98343)
    const formattedMsg = `*New Interior Design Inquiry*\n\n` + 
                         `• *Name:* ${nameValue}\n` + 
                         `• *Phone:* +91 ${phoneValue}\n` + 
                         `• *Service:* ${serviceValue}\n` + 
                         `• *Message:* ${messageValue}`;

    const encodedText = encodeURIComponent(formattedMsg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

    // Open WhatsApp link in new tab
    window.open(whatsappUrl, '_blank');

    // Provide UI success feedback
    alert('Thank you! Redirecting you to WhatsApp to send your inquiry directly to Royal Home Decor...');
    
    // Reset form
    contactForm.reset();
  });
});
