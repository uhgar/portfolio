// Three.js particle wave animation for about section
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 50;

    // create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // particle wave animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;

        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            
            positions[i3 + 1] = Math.sin(x * 0.1 + time) * 5 + Math.cos(z * 0.1 + time) * 5;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.rotation.x = mouseY * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // resize handler
    window.addEventListener('resize', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            camera.aspect = aboutSection.clientWidth / aboutSection.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(aboutSection.clientWidth, aboutSection.clientHeight);
        }
    });

    // rotation on scroll
    window.addEventListener('scroll', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            const scrollProgress = 1 - (rect.top / window.innerHeight);
            
            if (scrollProgress > 0 && scrollProgress < 1) {
                particlesMesh.rotation.y = scrollProgress * Math.PI;
            }
        }
    });
});

// smooth scrolling effect
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add loaded class when Three.js animation is ready
    animate();
    
    // Fade in canvas after a short delay
    setTimeout(() => {
        canvas.classList.add('loaded');
    }, 300);

    // resize handler
    window.addEventListener('resize', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButton = document.querySelector('.hero-content button');
    
    // Scroll to about section from hero button
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe project cards
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Observe sections
    const sections = document.querySelectorAll('.about-section, .contact-section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
});

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formStatus = contactForm.querySelector('.form-status');

    // Validation functions
    function validateName(name) {
        return name.trim().length >= 2;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateSubject(subject) {
        return subject.trim().length >= 3;
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    // Show error message
    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            input.classList.add('error');
            input.classList.remove('success');
        }
    }

    // Show success
    function showSuccess(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    // Real-time validation
    nameInput.addEventListener('blur', function() {
        if (!validateName(this.value)) {
            showError(this, 'Please enter a valid name (at least 2 characters)');
        } else {
            showSuccess(this);
        }
    });

    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            showSuccess(this);
        }
    });

    subjectInput.addEventListener('blur', function() {
        if (!validateSubject(this.value)) {
            showError(this, 'Subject must be at least 3 characters');
        } else {
            showSuccess(this);
        }
    });

    messageInput.addEventListener('blur', function() {
        if (!validateMessage(this.value)) {
            showError(this, 'Message must be at least 10 characters');
        } else {
            showSuccess(this);
        }
    });

    // Clear error on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                const errorElement = document.getElementById(`${this.id}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    this.classList.remove('error');
                }
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;

        // Validate all fields
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Please enter a valid name');
            isValid = false;
        } else {
            showSuccess(nameInput);
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        if (!validateSubject(subjectInput.value)) {
            showError(subjectInput, 'Subject is required');
            isValid = false;
        } else {
            showSuccess(subjectInput);
        }

        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'Please enter a message (at least 10 characters)');
            isValid = false;
        } else {
            showSuccess(messageInput);
        }

        if (!isValid) {
            formStatus.textContent = 'Please fix the errors above';
            formStatus.className = 'form-status error';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending';
        btnText.classList.add('sending');

        // Simulate sending (replace with actual API call)
        setTimeout(() => {
            // Open email client
            const mailtoLink = `mailto:sraghuraman143@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent(`Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`)}`;
            
            window.location.href = mailtoLink;

            // Show success message
            formStatus.textContent = '✓ Opening your email client...';
            formStatus.className = 'form-status success';

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    input.classList.remove('success', 'error');
                });
                formStatus.style.display = 'none';
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                btnText.classList.remove('sending');
            }, 3000);
        }, 1000);
    });
});
