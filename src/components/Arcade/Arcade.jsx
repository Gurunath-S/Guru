import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaVolumeUp, FaVolumeMute, FaTrophy, FaPause, FaPlay, FaRedo, FaTimes } from "react-icons/fa";
import "./Arcade.css";

// Web Audio API Synthesizer for retro sound effects
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sawtooth";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playHit() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "square";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.setValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playGameOver() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [300, 220, 150, 90];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.15, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.15 + 0.25);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.25);
      });
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playCountdown() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playLaunch() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  playRevive() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      [330, 440, 554, 659, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.06 + 0.12);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.12);
      });
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }
}

const sounds = new SoundEngine();

export default function Arcade({ isOpen = false, onClose = () => {} }) {
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("astro_shooter_high_score") || "0", 10);
  });

  const [gameState, setGameState] = useState("IDLE"); // IDLE, COUNTDOWN, PLAYING, PAUSED, REVIVE_PROMPT
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [muted, setMuted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [screenShake, setScreenShake] = useState(false);

  const canvasRef = useRef(null);
  const gameLoopId = useRef(null);
  const keysPressed = useRef({});
  const mousePos = useRef({ x: 0, y: 0 });
  const invulnerableUntil = useRef(0);

  // Game Engine state refs to avoid stale React state in 60fps loop
  const astronautRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    radius: 20,
    lastFired: 0,
    fireRate: 190 // ms
  });
  const lasersRef = useRef([]);
  const bugsRef = useRef([]);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const gameScoreRef = useRef(0);
  const gameShieldRef = useRef(100);
  const lastSpawnTime = useRef(0);
  const spawnInterval = useRef(1500);
  const lastReportedScore = useRef(0);

  // Initialize sounds muted state
  useEffect(() => {
    sounds.muted = muted;
  }, [muted]);

  // Handle isOpen prop changes: launch immediately or close
  useEffect(() => {
    if (isOpen) {
      initiateGame();
    } else {
      cancelAnimationFrame(gameLoopId.current);
      setGameState("IDLE");
    }
  }, [isOpen]);

  // Prevent scroll when actively playing or countdown
  useEffect(() => {
    if (isOpen && (gameState === "PLAYING" || gameState === "COUNTDOWN")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, gameState]);

  // Bind keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const key = e.key.toLowerCase();

      // Pause toggle with Escape or 'p'
      if (key === "escape" || key === "p") {
        if (gameState === "PLAYING") {
          e.preventDefault();
          cancelAnimationFrame(gameLoopId.current);
          setGameState("PAUSED");
          return;
        } else if (gameState === "PAUSED") {
          e.preventDefault();
          handleResume();
          return;
        }
      }

      // Quick continue with Spacebar or Enter when shield depleted
      if (gameState === "REVIVE_PROMPT" && (key === " " || key === "enter")) {
        e.preventDefault();
        handleContinue();
        return;
      }

      if (gameState !== "PLAYING") return;

      keysPressed.current[key] = true;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, gameState]);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      if (isOpen && gameState === "PLAYING") {
        fireLaser();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, gameState]);

  // Handle countdown logic before starting the game
  useEffect(() => {
    if (gameState !== "COUNTDOWN") return;

    sounds.init();
    setCountdown(3);
    sounds.playCountdown();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sounds.playLaunch();
          setGameState("PLAYING");
          startGameLoop();
          return 0;
        } else {
          sounds.playCountdown();
          return prev - 1;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [gameState]);

  const initiateGame = () => {
    sounds.init();
    // Setup initial astronaut position in the center
    astronautRef.current.x = window.innerWidth / 2;
    astronautRef.current.y = window.innerHeight / 2;
    astronautRef.current.vx = 0;
    astronautRef.current.vy = 0;
    astronautRef.current.angle = 0;
    invulnerableUntil.current = performance.now() + 2500; // brief invulnerability at start

    lasersRef.current = [];
    bugsRef.current = [];
    particlesRef.current = [];
    gameScoreRef.current = 0;
    lastReportedScore.current = 0;
    gameShieldRef.current = 100;
    spawnInterval.current = 1400;
    lastSpawnTime.current = performance.now();

    setScore(0);
    setShield(100);

    // Populate starfield background
    const stars = [];
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 7000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.5 + 0.3
      });
    }
    starsRef.current = stars;

    setGameState("COUNTDOWN");
  };

  const handleContinue = () => {
    sounds.playRevive();
    gameShieldRef.current = 100;
    setShield(100);
    invulnerableUntil.current = performance.now() + 3500; // 3.5s shield barrier

    // Vaporize bugs directly on top of astronaut
    const astro = astronautRef.current;
    bugsRef.current = bugsRef.current.filter((bug) => {
      const dx = bug.x - astro.x;
      const dy = bug.y - astro.y;
      return Math.sqrt(dx * dx + dy * dy) > 160;
    });

    setGameState("PLAYING");
    startGameLoop();
  };

  const handlePause = () => {
    cancelAnimationFrame(gameLoopId.current);
    setGameState("PAUSED");
  };

  const handleResume = () => {
    setGameState("PLAYING");
    startGameLoop();
  };

  const handleExit = () => {
    cancelAnimationFrame(gameLoopId.current);
    setGameState("IDLE");
    if (onClose) onClose();
  };

  const fireLaser = () => {
    const astro = astronautRef.current;
    const now = performance.now();
    if (now - astro.lastFired < astro.fireRate) return;

    astro.lastFired = now;
    sounds.playLaser();

    // Fire laser from astronaut center in direction of mouse cursor
    const dx = mousePos.current.x - astro.x;
    const dy = mousePos.current.y - astro.y;
    const angle = Math.atan2(dy, dx);

    const laserSpeed = 13;
    lasersRef.current.push({
      x: astro.x + Math.cos(angle) * astro.radius,
      y: astro.y + Math.sin(angle) * astro.radius,
      vx: Math.cos(angle) * laserSpeed,
      vy: Math.sin(angle) * laserSpeed,
      angle: angle,
      radius: 4
    });

    // Tiny muzzle flash particles
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: astro.x + Math.cos(angle) * astro.radius,
        y: astro.y + Math.sin(angle) * astro.radius,
        vx: Math.cos(angle) * 3 + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * 3 + (Math.random() - 0.5) * 2,
        color: "#00ffcc",
        life: 1.0,
        decay: 0.08,
        size: Math.random() * 3 + 1
      });
    }
  };

  const spawnBug = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) {
      x = Math.random() * width;
      y = -40;
    } else if (edge === 1) {
      x = width + 40;
      y = Math.random() * height;
    } else if (edge === 2) {
      x = Math.random() * width;
      y = height + 40;
    } else {
      x = -40;
      y = Math.random() * height;
    }

    const errorTypes = [
      { text: "SyntaxError", color: "#ff4d4d", points: 20 },
      { text: "404 NotFound", color: "#ff9900", points: 30 },
      { text: "NullPointerException", color: "#ff3366", points: 50 },
      { text: "Merge Conflict ❌", color: "#ff33ff", points: 40 },
      { text: "TypeError", color: "#ff3300", points: 25 },
      { text: "🐛 Bug", color: "#00ffcc", points: 15 }
    ];

    const type = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    const targetX = width / 2 + (Math.random() - 0.5) * (width * 0.5);
    const targetY = height / 2 + (Math.random() - 0.5) * (height * 0.5);
    const angle = Math.atan2(targetY - y, targetX - x);
    const speed = Math.random() * 2 + 1;

    bugsRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      text: type.text,
      color: type.color,
      points: type.points,
      radius: Math.max(type.text.length * 4.5, 18),
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03
    });
  };

  const createExplosion = (x, y, color) => {
    sounds.playExplosion();
    if (particlesRef.current.length > 70) return;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.03,
        size: Math.random() * 3 + 1.5
      });
    }
  };

  const triggerDamage = () => {
    sounds.playHit();
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);
  };

  const triggerGameOver = () => {
    sounds.playGameOver();
    setGameState("REVIVE_PROMPT");
    cancelAnimationFrame(gameLoopId.current);

    if (gameScoreRef.current > highScore) {
      setHighScore(gameScoreRef.current);
      localStorage.setItem("astro_shooter_high_score", gameScoreRef.current.toString());
    }
  };

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      updateGame();
      drawGame(ctx);
      gameLoopId.current = requestAnimationFrame(loop);
    };

    gameLoopId.current = requestAnimationFrame(loop);
  };

  const updateGame = () => {
    const now = performance.now();
    const MAX_BUGS = 18;
    const dynamicInterval = Math.max(500, spawnInterval.current - (gameScoreRef.current * 1.5));
    if (bugsRef.current.length < MAX_BUGS && now - lastSpawnTime.current > dynamicInterval) {
      spawnBug();
      lastSpawnTime.current = now;
    }

    const astro = astronautRef.current;
    const accel = 0.42;
    const damping = 0.94;
    const maxSpeed = 7.5;

    const keys = keysPressed.current;
    let thrusting = false;
    if (keys["w"] || keys["arrowup"]) {
      astro.vy -= accel;
      thrusting = true;
    }
    if (keys["s"] || keys["arrowdown"]) {
      astro.vy += accel;
      thrusting = true;
    }
    if (keys["a"] || keys["arrowleft"]) {
      astro.vx -= accel;
      thrusting = true;
    }
    if (keys["d"] || keys["arrowright"]) {
      astro.vx += accel;
      thrusting = true;
    }

    astro.vx *= damping;
    astro.vy *= damping;

    const speed = Math.sqrt(astro.vx * astro.vx + astro.vy * astro.vy);
    if (speed > maxSpeed) {
      astro.vx = (astro.vx / speed) * maxSpeed;
      astro.vy = (astro.vy / speed) * maxSpeed;
    }

    astro.x += astro.vx;
    astro.y += astro.vy;

    const padding = astro.radius + 10;
    if (astro.x < padding) {
      astro.x = padding;
      astro.vx *= -0.5;
    }
    if (astro.x > window.innerWidth - padding) {
      astro.x = window.innerWidth - padding;
      astro.vx *= -0.5;
    }
    if (astro.y < padding) {
      astro.y = padding;
      astro.vy *= -0.5;
    }
    if (astro.y > window.innerHeight - padding) {
      astro.y = window.innerHeight - padding;
      astro.vy *= -0.5;
    }

    const dx = mousePos.current.x - astro.x;
    const dy = mousePos.current.y - astro.y;
    astro.angle = Math.atan2(dy, dx);

    // Continuous shoot when holding SPACEBAR
    if (keys[" "] || keys["spacebar"]) {
      fireLaser();
    }

    // Thrust flame particles
    if (thrusting && Math.random() > 0.4) {
      const flameAngle = astro.angle + Math.PI + (Math.random() - 0.5) * 0.5;
      particlesRef.current.push({
        x: astro.x - Math.cos(astro.angle) * astro.radius,
        y: astro.y - Math.sin(astro.angle) * astro.radius,
        vx: Math.cos(flameAngle) * (2 + Math.random() * 2),
        vy: Math.sin(flameAngle) * (2 + Math.random() * 2),
        color: Math.random() > 0.4 ? "#c770f0" : "#ff33ff",
        life: 1.0,
        decay: 0.05,
        size: Math.random() * 3 + 1
      });
    }

    starsRef.current.forEach((star) => {
      star.x -= star.speed * (astro.vx * 0.1 + 0.5);
      if (star.x < 0) {
        star.x = window.innerWidth;
        star.y = Math.random() * window.innerHeight;
      }
    });

    lasersRef.current = lasersRef.current.filter((laser) => {
      laser.x += laser.vx;
      laser.y += laser.vy;
      return (
        laser.x >= 0 &&
        laser.x <= window.innerWidth &&
        laser.y >= 0 &&
        laser.y <= window.innerHeight
      );
    });

    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      return p.life > 0;
    });

    const activeLasers = lasersRef.current;
    bugsRef.current = bugsRef.current.filter((bug) => {
      bug.x += bug.vx;
      bug.y += bug.vy;
      bug.angle += bug.rotationSpeed;

      let hit = false;
      for (let i = 0; i < activeLasers.length; i++) {
        const laser = activeLasers[i];
        if (laser.x < -1000) continue;
        const ldx = laser.x - bug.x;
        const ldy = laser.y - bug.y;
        const rSum = bug.radius + laser.radius;
        if (ldx * ldx + ldy * ldy < rSum * rSum) {
          hit = true;
          laser.x = -9999;
          break;
        }
      }

      if (hit) {
        createExplosion(bug.x, bug.y, bug.color);
        gameScoreRef.current += bug.points;
        return false;
      }

      const adx = astro.x - bug.x;
      const ady = astro.y - bug.y;
      const aSum = bug.radius + astro.radius;
      if (adx * adx + ady * ady < aSum * aSum) {
        // If invulnerable shield active, vaporize bug without taking damage
        if (performance.now() < invulnerableUntil.current) {
          createExplosion(bug.x, bug.y, "#00ffcc");
          sounds.playHit();
          gameScoreRef.current += bug.points;
          return false;
        }

        createExplosion(bug.x, bug.y, "#ff3333");
        triggerDamage();

        gameShieldRef.current = Math.max(0, gameShieldRef.current - 20);
        setShield(gameShieldRef.current);

        if (gameShieldRef.current <= 0) {
          triggerGameOver();
        }
        return false;
      }

      return (
        bug.x >= -100 &&
        bug.x <= window.innerWidth + 100 &&
        bug.y >= -100 &&
        bug.y <= window.innerHeight + 100
      );
    });

    if (lastReportedScore.current !== gameScoreRef.current) {
      lastReportedScore.current = gameScoreRef.current;
      setScore(gameScoreRef.current);
    }
  };

  const drawGame = (ctx) => {
    ctx.fillStyle = "rgba(10, 4, 22, 0.45)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 1. Draw Starfield Parallax
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < starsRef.current.length; i++) {
      const star = starsRef.current[i];
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Draw Lasers
    for (let i = 0; i < lasersRef.current.length; i++) {
      const laser = lasersRef.current[i];
      ctx.save();
      ctx.translate(laser.x, laser.y);
      ctx.rotate(laser.angle);
      
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-8, -2, 16, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-6, -1, 12, 2);
      ctx.restore();
    }

    // 3. Draw Bugs (floating text errors with retro cyber-badges)
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < bugsRef.current.length; i++) {
      const bug = bugsRef.current[i];
      ctx.save();
      ctx.translate(bug.x, bug.y);
      ctx.rotate(bug.angle);

      ctx.fillStyle = "rgba(10, 4, 25, 0.88)";
      ctx.fillRect(-bug.radius, -12, bug.radius * 2, 24);

      ctx.strokeStyle = bug.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-bug.radius, -12, bug.radius * 2, 24);

      ctx.fillStyle = bug.color;
      ctx.fillText(bug.text, 0, 0);

      ctx.restore();
    }

    // 4. Draw Particles
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 5. Draw Astronaut
    const astro = astronautRef.current;
    ctx.save();
    ctx.translate(astro.x, astro.y);
    ctx.rotate(astro.angle);

    // Backpack
    ctx.fillStyle = "#a588c0";
    ctx.fillRect(-22, -10, 8, 20);

    // Body suit (White)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-2, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Helmet visor
    ctx.fillStyle = "#2d1950";
    ctx.beginPath();
    ctx.arc(4, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Visor Glass reflection
    ctx.fillStyle = "#00ffcc";
    ctx.beginPath();
    ctx.ellipse(6, 0, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thruster nozzles
    ctx.fillStyle = "#333333";
    ctx.fillRect(-24, -6, 2, 4);
    ctx.fillRect(-24, 2, 2, 4);

    ctx.restore();

    // 6. Forcefield / Invulnerability shield aura
    if (performance.now() < invulnerableUntil.current) {
      const pulse = (Math.sin(performance.now() * 0.015) + 1) / 2;
      ctx.save();
      ctx.strokeStyle = `rgba(0, 255, 204, ${0.6 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(astro.x, astro.y, astro.radius + 14 + pulse * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Outer ripple
      ctx.strokeStyle = `rgba(199, 112, 240, ${0.4 + pulse * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(astro.x, astro.y, astro.radius + 20 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  // If not open, render absolutely nothing!
  if (!isOpen) return null;

  return (
    <div className={`space-game-overlay ${screenShake ? "shake-effect" : ""}`}>
      {/* Interactive Game Canvas */}
      <canvas ref={canvasRef} className="space-game-canvas" />

      {/* Countdown timer */}
      {gameState === "COUNTDOWN" && (
        <div className="countdown-overlay">
          <span className="countdown-num">{countdown === 0 ? "LAUNCH!" : countdown}</span>
          <p className="countdown-hint">WASD to Move • Mouse to Aim • Click to Fire</p>
        </div>
      )}

      {/* Active Game HUD */}
      {gameState === "PLAYING" && (
        <>
          <div className="game-hud-panel">
            <div className="hud-metric">
              <span className="hud-title">SCORE:</span>
              <span className="hud-metric-value text-cyan">{score}</span>
            </div>

            <div className="hud-metric d-none d-sm-flex">
              <span className="hud-title"><FaTrophy className="hud-trophy-icon" /> HIGH:</span>
              <span className="hud-metric-value neon-purple">{highScore}</span>
            </div>

            <div className="hud-shield-container">
              <span className="hud-title"><FaHeart className="heart-icon" /> SHIELD:</span>
              <div className="shield-bar-bg">
                <div 
                  className={`shield-bar-fill ${shield <= 20 ? "shield-critical" : shield <= 60 ? "shield-warning" : ""}`} 
                  style={{ width: `${shield}%` }}
                ></div>
              </div>
            </div>

            <div className="hud-buttons">
              <button 
                className="hud-control-btn" 
                onClick={handlePause}
                title="Pause Game (ESC / P)"
                aria-label="Pause Game"
              >
                <FaPause />
              </button>

              <button 
                className="hud-control-btn" 
                onClick={() => setMuted(!muted)}
                title={muted ? "Unmute Audio" : "Mute Audio"}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>

              <button 
                className="exit-mission-btn" 
                onClick={handleExit}
                title="Exit Game Mode"
              >
                <FaTimes className="me-1" /> EXIT
              </button>
            </div>
          </div>

          <div className="hud-controls-helper">
            <span>WASD / Arrows</span>: Move • <span>Mouse</span>: Aim • <span>Click / Space</span>: Fire • <span>P / ESC</span>: Pause
          </div>
        </>
      )}

      {/* Paused Screen Overlay */}
      {gameState === "PAUSED" && (
        <div className="gameover-overlay">
          <div className="gameover-box pause-box">
            <h2 className="pause-title">MISSION PAUSED</h2>
            <p className="pause-desc">Cyber-space is on standby. Your score and position are locked.</p>
            
            <div className="gameover-stats">
              <div className="gameover-stat">
                <span>SCORE:</span>
                <span className="score-val text-cyan">{score} PTS</span>
              </div>
              <div className="gameover-stat">
                <span>RECORD:</span>
                <span className="score-val neon-purple">{highScore} PTS</span>
              </div>
            </div>

            <div className="continue-actions">
              <button className="continue-mission-btn pulse-glow" onClick={handleResume}>
                <FaPlay className="me-2" /> RESUME MISSION
              </button>
              <div className="secondary-actions">
                <button className="retry-btn" onClick={initiateGame}>
                  <FaRedo className="me-1" /> RESTART
                </button>
                <button className="exit-btn" onClick={handleExit}>
                  <FaTimes className="me-1" /> EXIT GAME
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shield Depleted / Continue Prompt Overlay */}
      {gameState === "REVIVE_PROMPT" && (
        <div className="gameover-overlay">
          <div className="gameover-box continue-box">
            <div className="alert-badge">CYBER-SYSTEM WARNING</div>
            <h1 className="error-title">SHIELD DEPLETED!</h1>
            <p className="error-desc">
              Astronaut took heavy cyber-damage. Restore full shields now and continue your mission streak!
            </p>
            
            <div className="gameover-stats">
              <div className="gameover-stat">
                <span>CURRENT SCORE:</span>
                <span className="score-val text-cyan">{score} PTS</span>
              </div>
              <div className="gameover-stat">
                <span>RECORD HIGH:</span>
                <span className="score-val neon-purple">{highScore} PTS</span>
              </div>
              {score >= highScore && score > 0 && (
                <div className="new-record-tag">★ NEW RECORD ESTABLISHED! ★</div>
              )}
            </div>

            <div className="continue-actions">
              <button className="continue-mission-btn pulse-glow" onClick={handleContinue}>
                ⚡ CONTINUE MISSION
                <span className="continue-subtext">Restores 100% Shield + 3.5s Forcefield • Keeps Score</span>
              </button>

              <div className="secondary-actions">
                <button className="retry-btn" onClick={initiateGame}>
                  <FaRedo className="me-1" /> NEW RUN
                </button>
                <button className="exit-btn" onClick={handleExit}>
                  <FaTimes className="me-1" /> EXIT GAME
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
