document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Any additional interactivity or animations can be added here
    // For example, smooth scrolling for the CTA button
    document.querySelector('.cta-button').addEventListener('click', function() {
        // Example smooth scroll to a specific section
        document.querySelector('#entre-agora').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;
    let animationID, currentIndex = 0;
    let autoPlayInterval;
    let autoPlayTimeout;

    function setPositionByIndex() {
        currentTranslate = currentIndex * -carousel.clientWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            carousel.style.cursor = 'grabbing';
            clearInterval(autoPlayInterval); // Stop auto-play on drag
            clearTimeout(autoPlayTimeout); // Clear any pending auto-play timeout
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        carousel.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;
        if (movedBy < -100 && currentIndex < items.length - 1) currentIndex += 1;
        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

        setPositionByIndex();
        autoPlayTimeout = setTimeout(() => {
            autoPlayInterval = setInterval(autoPlay, 7000); // Restart auto-play after delay
        }, 7000); // Restart auto-play after 7 seconds of inactivity
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    items.forEach((item, index) => {
        const itemImage = item.querySelector('img');
        itemImage.addEventListener('dragstart', (e) => e.preventDefault());

        // Touch events
        item.addEventListener('touchstart', touchStart(index));
        item.addEventListener('touchend', touchEnd);
        item.addEventListener('touchmove', touchMove);

        // Mouse events
        item.addEventListener('mousedown', touchStart(index));
        item.addEventListener('mouseup', touchEnd);
        item.addEventListener('mouseleave', touchEnd);
        item.addEventListener('mousemove', touchMove);
    });

    window.addEventListener('resize', setPositionByIndex);

    function autoPlay() {
        currentIndex = (currentIndex + 1) % items.length;
        setPositionByIndex();
    }

    autoPlayInterval = setInterval(autoPlay, 5000); // Change slide every 7 seconds
});