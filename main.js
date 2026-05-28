// ==================== 3 MODOS SEPARADOS ====================

document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let ripples = [];
    let currentMode = 1;
    const mouse = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.3 + 0.7;
            this.speedX = Math.random() * 1 - 0.225;
            this.speedY = Math.random() * 1 - 0.225;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = '#f87171';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f87171';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    

    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 10;
            this.alpha = 1.85;
            this.speed = 0.5;
        }

        

        update() {
            this.radius += this.speed;
            this.alpha -= 0.018;
        }

        draw() {
            ctx.strokeStyle = `rgba(248, 113, 113, ${this.alpha})`;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function initParticles() {
        particlesArray = [];
        const density = (canvas.width * canvas.height) / 7000;
        for (let i = 0; i < density; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < 145) {
                    ctx.strokeStyle = `rgba(248, 113, 113, ${0.22 - distance / 2000})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function connectToMouse() {
        if (!mouse.x || !mouse.y) return;
        for (let i = 0; i < particlesArray.length; i++) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance < mouse.radius) {
                ctx.strokeStyle = `rgba(248, 113, 113, ${1 - distance / mouse.radius})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentMode === 1 || currentMode === 2) { 
            // Normal e Partículas usam partículas
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });

            if (currentMode === 1) { // Só Normal tem teias
                connectParticles();
                connectToMouse();
            }
        } 
        else if (currentMode === 3) { // Gotas
            if (Math.random() < 0.18) {
                ripples.push(new Ripple(Math.random() * canvas.width, Math.random() * canvas.height * 0.65));
            }

            for (let i = ripples.length - 1; i >= 0; i--) {
                ripples[i].update();
                ripples[i].draw();
                if (ripples[i].alpha <= 0) ripples.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    window.changeMode = function(mode) {
        currentMode = mode;
        ripples = [];

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick').includes(mode)) btn.classList.add('active');
        });
    };

    // Eventos
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    initParticles();
    animate();
});