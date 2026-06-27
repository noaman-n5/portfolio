document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // Modern Gravity & Network Background Animation (Canvas)
    // =========================================================================
    const particlesContainer = document.getElementById('particles-container');

    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        particlesContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let width, height;
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        const isDarkTheme = () => document.documentElement.getAttribute('data-theme') !== 'light';
        
        let particles = [];
        // Scale particle count with screen size
        const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 100);
        
        let mouse = { x: null, y: null, radius: 200 };
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 1;
                // Add a slower gravity-like constant drop and natural random velocity
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() * 0.5) + 0.15; // Slower natural gravity falling down
                this.density = (Math.random() * 20) + 1;
            }

            draw() {
                const color = isDarkTheme() ? 'rgba(139, 92, 246, 0.7)' : 'rgba(37, 99, 235, 0.6)';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Natural gravity movement
                this.x += this.vx;
                this.y += this.vy;

                // Loop around when falling off screen
                if (this.y > height) {
                    this.y = 0 - this.size;
                    this.x = Math.random() * width;
                }
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;

                // Mouse Gravity Attraction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Gravity calculation
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = forceDirectionX * force * this.density;
                        let directionY = forceDirectionY * force * this.density;
                        
                        // Attract towards mouse at a much slower and smoother rate
                        this.x += directionX * 0.02;
                        this.y += directionY * 0.02;
                    } 
                }
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            connect();
        }

        // Connect particles with lines if they are close (adds a tech/network vibe)
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = (dx * dx) + (dy * dy);
                    
                    // Only connect if within distance threshold
                    if (distance < 12000) {
                        opacityValue = 1 - (distance / 12000);
                        const isDark = isDarkTheme();
                        ctx.strokeStyle = isDark ? `rgba(59, 130, 246, ${opacityValue * 0.4})` : `rgba(37, 99, 235, ${opacityValue * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        init();
        animate();
    }

    // =========================================================================
    // Theme Toggle Functionality
    // =========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlEl = document.documentElement;

    // Check localStorage for saved theme, otherwise default is 'dark'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // =========================================================================
    // Mobile Navigation Toggle
    // =========================================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        
        if (mobileNav.classList.contains('active')) {
            mobileMenuIcon.classList.remove('fa-bars');
            mobileMenuIcon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu open
        } else {
            mobileMenuIcon.classList.remove('fa-xmark');
            mobileMenuIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuIcon.classList.remove('fa-xmark');
            mobileMenuIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });

    // =========================================================================
    // Scroll Animations (Intersection Observer)
    // =========================================================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // =========================================================================
    // Smart Navbar: Background, Auto-Hide, & Active Links
    // =========================================================================
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    // Auto-hide and background styling
    window.addEventListener('scroll', () => {
        // Add/remove scrolled class for 3D styling
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Auto-hide on scroll down, show on scroll up
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Scrolling down
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Active Link Highlighting (Spy Scroll)
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    const activeLinkObserver = new IntersectionObserver((entries) => {
        let currentSectionId = '';
        
        // Find the section currently intersecting
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSectionId = entry.target.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinksList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Adjust depending on when you want to trigger active state
        threshold: 0
    });

    sections.forEach(sec => {
        activeLinkObserver.observe(sec);
    });

    // =========================================================================
    // Contact Form Action
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const subject = encodeURIComponent('New message from ' + name + ' via Portfolio');
            const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
            
            window.location.href = `mailto:noaman653@gmail.com?subject=${subject}&body=${body}`;
            
            // Reset the form after sending
            contactForm.reset();
        });
    }
});
