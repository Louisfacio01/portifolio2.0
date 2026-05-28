// ==================== 3 MODOS: Normal | Teias | Ondas ====================

document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let currentMode = 1;
    const mouse = { x: null, y: null, radius: 170 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2 + 0.6;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            if (currentMode === 3) { // Ondas
                this.x += Math.cos(this.angle) * 1.2;
                this.y += Math.sin(this.angle) * 0.8 + 0.4;
                this.angle += 0.018;
            } else {
                this.x += this.speedX;
                this.y += this.speedY;
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = '#f87171';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const density = (canvas.width * canvas.height) / 6800;
        for (let i = 0; i < density; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        let maxDist = currentMode === 2 ? 190 : 145;   // Teias = mais distância

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDist) {
                    const opacity = currentMode === 2 ? 0.45 : 0.22;
                    ctx.strokeStyle = `rgba(248, 113, 113, ${opacity - distance / 2000})`;
                    ctx.lineWidth = currentMode === 2 ? 1.4 : 0.9;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function connectToMouse() {
        if (!mouse.x || !mouse.y || currentMode === 3) return;

        for (let i = 0; i < particlesArray.length; i++) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance < mouse.radius) {
                ctx.strokeStyle = `rgba(248, 113, 113, ${1 - distance / mouse.radius})`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });

        if (currentMode === 1 || currentMode === 2) {
            connectParticles();
            connectToMouse();
        }

        requestAnimationFrame(animate);
    }

    // Trocar Modo
    window.changeMode = function(mode) {
        currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('onclick').match(/\d+/)[0]) === mode) {
                btn.classList.add('active');
            }
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

    // Inicializar
    resizeCanvas();
    initParticles();
    animate();
});

VANTA.DOTS({
  el: "#your-element-selector",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00
})