document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor tracking
    const cursor = document.querySelector('.glow-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const updateCursor = (e) => {
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
    };
    window.addEventListener('mousemove', updateCursor);

    // 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    });

    function handleMouseMove(e) {
        const card = this;
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Intensity of tilt
        const maxTilt = 15; // pixels/degrees
        const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
        const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

        const inner = card.querySelector('.card-inner');
        const avatar = card.querySelector('.card-avatar');

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Parallax movement on avatar — moves opposite to tilt for depth
        if (avatar) {
            const moveX = (mouseX / (rect.width / 2)) * 12;
            const moveY = (mouseY / (rect.height / 2)) * 12;
            avatar.style.transform = `translate(calc(-50% + ${moveX}px), calc(-55% + ${moveY}px))`;
        }
    }

    function handleMouseEnter() {
        const inner = this.querySelector('.card-inner');
        const avatar = this.querySelector('.card-avatar');
        inner.style.transition = 'none'; // remove transition for immediate follow
        if (avatar) {
            avatar.style.transition = 'filter 0.8s ease, opacity 0.8s ease';
        }
    }

    function handleMouseLeave() {
        const inner = this.querySelector('.card-inner');
        const avatar = this.querySelector('.card-avatar');
        inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.6s ease';
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        if (avatar) {
            avatar.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease, opacity 0.8s ease';
            avatar.style.transform = 'translate(-50%, -55%)';
        }
    }

    // HTML5 Canvas Background Effect
    initCanvas();
});

function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1200})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}
