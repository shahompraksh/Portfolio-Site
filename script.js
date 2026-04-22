// DOM Elements
const loading = document.getElementById('loading');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const scrollLinks = document.querySelectorAll('[data-scroll-target]');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const chatbot = document.querySelector('.chatbot');
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
let isChatRequestPending = false;

// 3D Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;

  // Apply 3D transforms to hero section
  const hero = document.querySelector('.hero');
  const rotationX = (mouseY - 0.5) * 10;
  const rotationY = (mouseX - 0.5) * 10;

  hero.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

  // Apply subtle parallax to floating elements
  const floatingElements = document.querySelectorAll('.floating');
  floatingElements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// Add floating class to elements for parallax effect
document.querySelectorAll('.hero-content, .portfolio-item, .skill-item').forEach(element => {
  element.classList.add('floating');
});

// Click Ripple Effect
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
    const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Typing Animation
const roles = [
  "Full Stack Developer",
  "Frontend Designer",
  "AI Enthusiast",
  "Creative Problem Solver",
  "UI/UX Designer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let availableVoices = [];

function loadSpeechVoices() {
  if (!('speechSynthesis' in window)) return;
  availableVoices = window.speechSynthesis.getVoices();
}

function getPreferredMaleVoice() {
  if (!availableVoices.length) return null;

  const preferredVoicePatterns = [
    /david/i,
    /mark/i,
    /alex/i,
    /daniel/i,
    /fred/i,
    /thomas/i,
    /george/i,
    /male/i
  ];

  return (
    availableVoices.find((voice) => preferredVoicePatterns.some((pattern) => pattern.test(voice.name))) ||
    availableVoices.find((voice) => /en(-|_)?us|english/i.test(`${voice.lang} ${voice.name}`)) ||
    availableVoices[0] ||
    null
  );
}

function typeWriter() {
  const currentRole = roles[roleIndex];
  const displayText = isDeleting
    ? currentRole.substring(0, charIndex - 1)
    : currentRole.substring(0, charIndex + 1);

  typingText.textContent = displayText;

  if (!isDeleting && charIndex === currentRole.length) {
    setTimeout(() => isDeleting = true, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  setTimeout(typeWriter, isDeleting ? typingSpeed / 2 : typingSpeed);
}

// Text-to-Speech Function
function speakWelcome(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    loadSpeechVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    const preferredVoice = getPreferredMaleVoice();

    utterance.rate = 0.92;
    utterance.pitch = 0.82;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang || 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  }
}

if ('speechSynthesis' in window) {
  loadSpeechVoices();
  window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
}

// Loading Screen
window.addEventListener('load', () => {
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
      // Start typing animation after loading
      typeWriter();
      
      // Play welcome voice message
      setTimeout(() => {
        speakWelcome("Welcome to Om Shah's portfolio. How can I help you today?");
        // Also add welcome message to chatbot
        addMessage("Welcome to Om Shah's portfolio! How can I help you today?", false);
      }, 500);
    }, 500);
  }, 2000);
});

// Music Control
let isMusicPlaying = false;
const hasMusicSource = Boolean(
  bgMusic &&
  (bgMusic.getAttribute('src') || bgMusic.querySelector('source[src]'))
);

if (musicBtn) {
  if (!hasMusicSource) {
    musicBtn.disabled = true;
    musicBtn.title = 'Add a music source to enable background audio';
  } else {
    musicBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.style.color = 'var(--primary-color)';
      } else {
        bgMusic.play().catch(e => {
          console.log('Audio play failed:', e);
        });
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicBtn.style.color = 'var(--secondary-color)';
      }
      isMusicPlaying = !isMusicPlaying;
    });
  }
}

// Voice Intro Button
const voiceBtn = document.getElementById('voiceBtn');
if (voiceBtn) {
  voiceBtn.addEventListener('click', () => {
    speakWelcome("Hi, I'm Om Shah. I'm a passionate Full Stack Developer and AI Enthusiast from Kathmandu, Nepal. I specialize in creating innovative digital experiences with modern web technologies. Explore my portfolio to see my work, and feel free to reach out if you'd like to collaborate!");
  });
}

function scrollToSection(targetId) {
  const targetSection = document.getElementById(targetId);

  if (!targetSection) return;

  const navOffset = 100;
  const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - navOffset;

  window.scrollTo({
    top: Math.max(offsetTop, 0),
    behavior: 'smooth'
  });
}

// Navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);

    // Update active link
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close mobile menu
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

scrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToSection(link.dataset.scrollTarget);
  });
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  const clickedInsideMenu = navMenu.contains(e.target);
  const clickedToggle = navToggle.contains(e.target);

  if (!clickedInsideMenu && !clickedToggle) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    navbar.style.boxShadow = 'none';
  }

  // Update active nav link based on scroll position
  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Contact Form
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  try {
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      const successMessage = result.message || 'Message sent successfully!';
      formMessage.className = 'form-message success';
      formMessage.innerHTML = successMessage;

      if (result.whatsappLink) {
        const whatsappButton = document.createElement('a');
        whatsappButton.href = result.whatsappLink;
        whatsappButton.target = '_blank';
        whatsappButton.rel = 'noopener noreferrer';
        whatsappButton.className = 'form-whatsapp-link';
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i> Send Same Message on WhatsApp';
        formMessage.appendChild(whatsappButton);
      }

      contactForm.reset();
    } else {
      throw new Error(result.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    formMessage.textContent = error.message || 'Failed to send message. Please try again.';
    formMessage.className = 'form-message error';
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }, 5000);
});

// Chatbot Functionality
chatbotToggle.addEventListener('click', () => {
  chatbot.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
  chatbot.classList.remove('active');
});

// Add message to chat
function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.textContent = message;

  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatPendingState(isPending) {
  isChatRequestPending = isPending;
  sendMessage.disabled = isPending;
  chatInput.disabled = isPending;
  sendMessage.style.opacity = isPending ? '0.7' : '1';
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message typing-indicator';
  typingDiv.id = 'typingIndicator';

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.textContent = 'Typing...';

  typingDiv.appendChild(messageContent);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Send message to chatbot
async function sendChatMessage(message) {
  if (isChatRequestPending) return;

  addMessage(message, true);
  setChatPendingState(true);
  addTypingIndicator();

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (data.reply) {
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(data.reply, false);
        speakWelcome(data.reply);
        setChatPendingState(false);
        chatInput.focus();
      }, 1000); // Simulate typing delay
    } else {
      throw new Error(data.error || 'Failed to get response');
    }
  } catch (error) {
    console.error('Chat error:', error);
    setTimeout(() => {
      const errorMsg = 'Sorry, I\'m having trouble responding right now. Please try again later.';
      removeTypingIndicator();
      addMessage(errorMsg, false);
      speakWelcome(errorMsg);
      setChatPendingState(false);
      chatInput.focus();
    }, 1000);
  }
}

// Chat input handlers
sendMessage.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message && !isChatRequestPending) {
    sendChatMessage(message);
    chatInput.value = '';
  }
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message && !isChatRequestPending) {
      sendChatMessage(message);
      chatInput.value = '';
    }
  }
});

// Portfolio hover effects
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-10px) rotateX(5deg)';
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0) rotateX(0)';
  });
});

// Skill bars animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');

  skillBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.width = bar.style.width || '0%';
    }, index * 200);
  });
}

// Trigger skill bars animation when skills section is in view
const skillsSection = document.querySelector('.skills');
const observerOptions = {
  threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

if (skillsSection) {
  observer.observe(skillsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image');

  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
});

// Particle effect (optional enhancement)
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    hero.appendChild(particle);
  }
}

// Add particle styles dynamically
const particleStyles = document.createElement('style');
particleStyles.textContent = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
  }
`;
document.head.appendChild(particleStyles);

// Initialize particles
createParticles();

// Prevent right-click context menu (optional)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add loading class to body
  document.body.classList.add('loading');

  // Remove loading class after animations
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 3000);
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + M to toggle music
  if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
    e.preventDefault();
    musicBtn.click();
  }

  // Escape to close chatbot
  if (e.key === 'Escape' && chatbot.classList.contains('active')) {
    chatbot.classList.remove('active');
  }
});

// Performance optimization - lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Add some accessibility improvements
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Console welcome message
console.log(`
🚀 Welcome to Om Shah's Portfolio!

🌟 Full Stack Developer | AI Enthusiast | Creative Designer

📧 Contact: shahomprakash2004@gmail.com
📱 WhatsApp: +91 9761819137

Made with ❤️ and lots of ☕
`);
