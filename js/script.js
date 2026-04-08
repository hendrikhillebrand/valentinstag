/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VALENTINE WEBSITE - CLEAN VERSION
 * Ohne Süßigkeiten / Ohne Besondere Überraschung
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.hearts = ["💕", "💖", "💗", "💝", "💘", "💓", "💞", "💟"];
        this.colors = ["#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#DC143C", "#FFD700"];

        this.resize();
        window.addEventListener("resize", () => this.resize());

        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = window.innerWidth < 768 ? 25 : 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 15 + 5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5 - 0.3,
            opacity: Math.random() * 0.5 + 0.3,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            type: Math.random() > 0.7 ? "emoji" : "circle",
            emoji: this.hearts[Math.floor(Math.random() * this.hearts.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;

            if (particle.y < -50) {
                particle.y = this.canvas.height + 50;
                particle.x = Math.random() * this.canvas.width;
            }
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;

            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate((particle.rotation * Math.PI) / 180);

            if (particle.type === "emoji") {
                this.ctx.font = `${particle.size}px Arial`;
                this.ctx.fillText(particle.emoji, -particle.size / 2, particle.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.fill();
            }

            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }

    explode(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 5 + 3;

            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;
            particle.speedX = Math.cos(angle) * velocity;
            particle.speedY = Math.sin(angle) * velocity;
            particle.size = Math.random() * 20 + 10;

            this.particles.push(particle);

            setTimeout(() => {
                const index = this.particles.indexOf(particle);
                if (index > -1) this.particles.splice(index, 1);
            }, 2000);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING HEARTS MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
class FloatingHeartsManager {
    constructor(container) {
        this.container = container;
        this.hearts = ["❤️", "💕", "💖", "💗", "💝", "💘", "💓", "💞"];
        this.active = true;
        this.intervalId = null;

        this.start();
    }

    start() {
        const createHeart = () => {
            if (!this.active) return;

            const heart = document.createElement("div");
            heart.className = "floating-heart";
            heart.textContent = this.hearts[Math.floor(Math.random() * this.hearts.length)];
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.fontSize = Math.random() * 20 + 15 + "px";
            heart.style.animationDuration = Math.random() * 3 + 4 + "s";

            this.container.appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        };

        this.intervalId = setInterval(createHeart, 800);

        for (let i = 0; i < 5; i++) {
            setTimeout(createHeart, i * 200);
        }
    }

    stop() {
        this.active = false;
        if (this.intervalId) clearInterval(this.intervalId);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFETTI SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
class ConfettiSystem {
    constructor() {
        this.colors = ["#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#DC143C", "#FFD700", "#FF0066"];
    }

    explode(x, y, count = 100) {
        for (let i = 0; i < count; i++) {
            this.createConfetti(x, y);
        }
    }

    createConfetti(x, y) {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${Math.random() * 12 + 8}px;
            height: ${Math.random() * 12 + 8}px;
            background: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
            border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
            pointer-events: none;
            z-index: 9999;
        `;

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 400 + 200;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 300;
        const gravity = 500;
        const duration = Math.random() * 2 + 2;

        confetti.animate(
            [
                { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
                {
                    transform: `translate(${vx * duration * 0.5}px, ${
                        vy * duration + gravity * duration * duration * 0.5
                    }px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ],
            {
                duration: duration * 1000,
                easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            }
        ).onfinish = () => confetti.remove();
    }

    celebrate() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.explode(centerX, centerY, 150);
        setTimeout(() => this.explode(centerX - 200, centerY - 100, 50), 200);
        setTimeout(() => this.explode(centerX + 200, centerY - 100, 50), 400);
        setTimeout(() => this.explode(centerX, centerY + 100, 50), 600);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPARKLE EFFECT
// ═══════════════════════════════════════════════════════════════════════════════
class SparkleEffect {
    static create(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement("div");
            sparkle.innerHTML = "✨";
            sparkle.style.cssText = `
                position: fixed;
                left: ${x + (Math.random() - 0.5) * 100}px;
                top: ${y + (Math.random() - 0.5) * 100}px;
                font-size: ${Math.random() * 15 + 10}px;
                pointer-events: none;
                z-index: 1000;
            `;

            document.body.appendChild(sparkle);

            sparkle.animate(
                [
                    { transform: "scale(0) rotate(0deg)", opacity: 1 },
                    { transform: "scale(1.5) rotate(180deg)", opacity: 0 }
                ],
                {
                    duration: 800,
                    easing: "ease-out"
                }
            ).onfinish = () => sparkle.remove();
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEART TRAIL
// ═══════════════════════════════════════════════════════════════════════════════
class HeartTrail {
    constructor() {
        this.hearts = ["💕", "💖", "💗", "💝"];
        this.active = false;
        this.boundMouseMove = this.onMouseMove.bind(this);
    }

    start() {
        if (this.active) return;
        this.active = true;
        document.addEventListener("mousemove", this.boundMouseMove);
    }

    stop() {
        this.active = false;
        document.removeEventListener("mousemove", this.boundMouseMove);
    }

    onMouseMove(e) {
        if (!this.active || Math.random() > 0.3) return;

        const heart = document.createElement("div");
        heart.textContent = this.hearts[Math.floor(Math.random() * this.hearts.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
        `;

        document.body.appendChild(heart);

        heart.animate(
            [
                { transform: "translate(0, 0) scale(1)", opacity: 1 },
                { transform: "translate(0, -50px) scale(0.5)", opacity: 0 }
            ],
            {
                duration: 1000,
                easing: "ease-out"
            }
        ).onfinish = () => heart.remove();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
class ScreenManager {
    constructor() {
        this.screens = {
            intro: document.getElementById("screen-intro"),
            sad: document.getElementById("screen-sad"),
            success: document.getElementById("screen-success"),
            teddy: document.getElementById("screen-teddy"),
            letter: document.getElementById("screen-letter")
        };

        this.currentScreen = "intro";
    }

    show(screenName) {
        if (!this.screens[screenName]) return;

        Object.values(this.screens).forEach((screen) => {
            if (screen) {
                screen.classList.remove("active");
            }
        });

        setTimeout(() => {
            this.screens[screenName].classList.add("active");
            this.currentScreen = screenName;
            this.onScreenShow(screenName);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    }

    onScreenShow(screenName) {
        if (screenName === "success" && window.confettiSystem) {
            window.confettiSystem.celebrate();
        }

        if (screenName === "teddy") {
            this.animateRoses();
        }
    }

    animateRoses() {
        const roses = document.querySelectorAll(".rose");
        roses.forEach((rose, i) => {
            rose.style.animation = "none";
            setTimeout(() => {
                rose.style.animation = "rose-glow 2s ease-in-out infinite";
                rose.style.animationDelay = `${i * 0.3}s`;
            }, 100);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════
class ValentineApp {
    constructor() {
        this.init();
    }

    init() {
        this.initParticleSystem();
        this.initFloatingHearts();
        this.initScreenManager();
        this.initEventListeners();
        this.initButtonEffects();
        this.initParallax();

        this.heartTrail = new HeartTrail();
        this.heartTrail.start();

        console.log("%c💕 Valentine's Website Loaded! 💕", "color: #FF1493; font-size: 20px; font-weight: bold;");
        console.log("%cMade with love for someone special ❤️", "color: #FF69B4; font-size: 14px;");
    }

    initParticleSystem() {
        const canvas = document.getElementById("particles-canvas");
        if (canvas) {
            window.particleSystem = new ParticleSystem(canvas);
        }
    }

    initFloatingHearts() {
        const container = document.getElementById("floating-hearts-container");
        if (container) {
            window.floatingHearts = new FloatingHeartsManager(container);
        }
    }

    initScreenManager() {
        window.screenManager = new ScreenManager();
        window.confettiSystem = new ConfettiSystem();
    }

    initEventListeners() {
        const btnYes = document.getElementById("btn-yes");
        if (btnYes) {
            btnYes.addEventListener("click", (e) => {
                if (window.confettiSystem) {
                    window.confettiSystem.explode(e.clientX, e.clientY, 80);
                }
                if (window.screenManager) {
                    window.screenManager.show("success");
                }
            });
        }

        const btnNo = document.getElementById("btn-no");
        if (btnNo) {
            btnNo.addEventListener("click", () => {
                if (window.screenManager) {
                    window.screenManager.show("sad");
                }
            });
        }

        const btnTryAgain = document.getElementById("btn-try-again");
        if (btnTryAgain) {
            btnTryAgain.addEventListener("click", () => {
                if (window.screenManager) {
                    window.screenManager.show("intro");
                }
            });
        }

        const giftCards = document.querySelectorAll(".gift-card");
        giftCards.forEach((card) => {
            card.addEventListener("click", () => {
                const gift = card.dataset.gift;
                if (gift && window.screenManager && window.screenManager.screens[gift]) {
                    window.screenManager.show(gift);
                }
            });
        });

        const navButtons = document.querySelectorAll(".btn-back, .btn-next");
        navButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.back || btn.dataset.next;
                if (target && window.screenManager && window.screenManager.screens[target]) {
                    window.screenManager.show(target);
                }
            });
        });

        const btnRestart = document.getElementById("btn-restart");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                if (window.confettiSystem) {
                    window.confettiSystem.celebrate();
                }
                setTimeout(() => {
                    if (window.screenManager) {
                        window.screenManager.show("intro");
                    }
                }, 500);
            });
        }
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll(".btn, .gift-card");

        buttons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement("span");
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                `;

                btn.style.position = "relative";
                btn.style.overflow = "hidden";
                btn.appendChild(ripple);

                ripple.animate(
                    [
                        { width: "0", height: "0", opacity: 1 },
                        { width: "300px", height: "300px", opacity: 0 }
                    ],
                    {
                        duration: 600,
                        easing: "ease-out"
                    }
                ).onfinish = () => ripple.remove();
            });

            btn.addEventListener("mouseenter", () => {
                const rect = btn.getBoundingClientRect();
                SparkleEffect.create(rect.left + rect.width / 2, rect.top, 5);
            });
        });
    }

    initParallax() {
        let ticking = false;

        document.addEventListener("mousemove", (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (window.innerWidth - e.pageX) / 50;
                    const y = (window.innerHeight - e.pageY) / 50;

                    const plane = document.querySelector(".paper-plane-container");
                    const calendar = document.querySelector(".calendar-widget");

                    if (plane) {
                        plane.style.transform = `translate(${x}px, ${y}px)`;
                    }
                    if (calendar) {
                        calendar.style.transform = `translate(${-x}px, ${-y}px) rotate(5deg)`;
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF1493, #C71585);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            box-shadow: 0 10px 30px rgba(255, 20, 147, 0.4);
            z-index: 10000;
            animation: toast-in 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = "toast-out 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function preloadImages() {
    const images = [];
    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

function addDynamicStyles() {
    const styles = document.createElement("style");
    styles.textContent = `
        @keyframes toast-in {
            from { transform: translateX(-50%) translateY(50px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }

        @keyframes toast-out {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(50px); opacity: 0; }
        }
    `;
    document.head.appendChild(styles);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE ON DOM READY
// ═══════════════════════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
    addDynamicStyles();
    preloadImages();

    window.valentineApp = new ValentineApp();

    if ("ontouchstart" in window) {
        document.body.classList.add("touch-device");
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            // Pause expensive animations if needed
        } else {
            // Resume if needed
        }
    });
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = { ValentineApp, ParticleSystem, ConfettiSystem };
}