// ==================== EQUILÍBRIO: INTERAÇÃO FIXA EM TODO O SITE ====================

document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let pointsArray = []; 
    let ripples = [];
    let currentMode = 1;
    let count = 0; 

    // --- CONFIGURAÇÃO DO MOUSE (SINCRENISMO COM O VIEWPORT) ---
    const mouse = {
        x: null,
        y: null,
        radius: 250 // Alcance do imã das partículas
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let numCols = isMobile ? 28 : 65; 
    let numRows = isMobile ? 16 : 32; 

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const checkMobile = window.innerWidth <= 768;
        numCols = checkMobile ? 26 : 65; 
        numRows = checkMobile ? 15 : 32;

        initParticles();
    }

    // --- MODO 1: PARTÍCULAS TRADICIONAIS ---
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 1.0;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
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

    // --- MODO 2: GRADE DE PONTOS EM ONDA 3D ---
    class GridPoint {
        constructor(col, row) {
            this.col = col;
            this.row = row;
            this.baseSize = 1.6;
        }

        draw() {
            const spacingX = canvas.width / (numCols - 1);
            const spacingY = (canvas.height * 0.7) / (numRows - 1);

            const baseX = this.col * spacingX;
            const baseY = (canvas.height * 0.15) + (this.row * spacingY);

            const wave1 = Math.sin(this.col * 0.15 + count);
            const wave2 = Math.cos(this.row * 0.15 + count);
            let zEffect = wave1 + wave2; 

            let amplitude = isMobile ? 20 : 40;
            let y = baseY + (zEffect * amplitude);

            // Interação corrigida do mouse com a onda (Modo 2) ao longo do scroll
            if (mouse.x !== null && mouse.y !== null) {
                const dxMouse = baseX - mouse.x;
                const dyMouse = y - mouse.y;
                const distMouse = Math.hypot(dxMouse, dyMouse);
                if (distMouse < 180) {
                    y += (180 - distMouse) * 0.15;
                }
            }

            const sizeModifier = (zEffect + 2) / 4; 
            const size = this.baseSize * (0.5 + sizeModifier * 1.2);
            
            ctx.fillStyle = `rgba(248, 113, 113, ${0.15 + (sizeModifier * 0.65)})`;
            ctx.beginPath();
            ctx.arc(baseX, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- MODO 3: GOTAS D'ÁGUA ---
    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 10;
            this.alpha = 0.8;
            this.speed = 2.7;
        }

        update() {
            this.radius += this.speed;
            this.alpha -= 0.021;
        }

        draw() {
            ctx.strokeStyle = `rgba(248, 113, 113, ${this.alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function initParticles() {
        particlesArray = [];
        pointsArray = [];
        
        const density = isMobile ? 
            (canvas.width * canvas.height) / 13500 : 
            (canvas.width * canvas.height) / 7200;
        
        for (let i = 0; i < density; i++) {
            particlesArray.push(new Particle());
        }

        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {
                pointsArray.push(new GridPoint(col, row));
            }
        }
    }

    // --- LIGAÇÃO COM O MOUSE (CORRIGIDO PARA TODO O SITE) ---
    function connectParticles() {
        if (currentMode !== 1) return;

        const maxDist = isMobile ? 110 : 145;

        for (let a = 0; a < particlesArray.length; a++) {
            
            if (mouse.x !== null && mouse.y !== null) {
                const dxMouse = particlesArray[a].x - mouse.x;
                const dyMouse = particlesArray[a].y - mouse.y;
                const distMouse = Math.hypot(dxMouse, dyMouse);

                if (distMouse < mouse.radius) {
                    const calculatedOpacity = 0.85 - (distMouse / mouse.radius);
                    ctx.strokeStyle = `rgba(248, 113, 113, ${calculatedOpacity})`;
                    ctx.lineWidth = isMobile ? 1.2 : 1.8; 
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            for (let b = a + 1; b < particlesArray.length; b += 2) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDist) {
                    const opacity = isMobile ? 0.25 : 0.28;
                    ctx.strokeStyle = `rgba(248, 113, 113, ${opacity - distance / 1800})`;
                    ctx.lineWidth = isMobile ? 0.9 : 1.1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentMode === 1) {
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
        } 
        else if (currentMode === 2) {
            count += 0.025; 
            pointsArray.forEach(point => {
                point.draw();
            });
        } 
        else if (currentMode === 3) {
            if (Math.random() < (isMobile ? 0.09 : 0.17)) {
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

    // --- ALTERAÇÃO CHAVE: Usar clientX e clientY ignora a rolagem da página ---
    document.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    document.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    window.changeMode = function(mode) {
        currentMode = mode;
        ripples = []; 

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick').includes(mode)) btn.classList.add('active');
        });
    };

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    resizeCanvas();
    animate();
});