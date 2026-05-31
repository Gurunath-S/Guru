import React, { useState, useEffect, useRef } from "react";
import { FaRocket, FaHeart, FaVolumeUp, FaVolumeMute, FaTrophy, FaArrowLeft } from "react-icons/fa";
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
    // Resume context if suspended (browser security)
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
}

const sounds = new SoundEngine();

export default function Arcade() {
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("astro_shooter_high_score") || "0", 10);
  });

  const [gameState, setGameState] = useState("IDLE"); // IDLE, COUNTDOWN, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [muted, setMuted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [screenShake, setScreenShake] = useState(false);

  const canvasRef = useRef(null);
  const gameLoopId = useRef(null);
  const keysPressed = useRef({});
  const mousePos = useRef({ x: 0, y: 0 });

  // Game Engine state refs to avoid stale React state references in 60fps loop
  const astronautRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    radius: 20,
    lastFired: 0,
    fireRate: 200 // ms
  });
  const lasersRef = useRef([]);
  const bugsRef = useRef([]);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const gameScoreRef = useRef(0);
  const gameShieldRef = useRef(100);
  const lastSpawnTime = useRef(0);
  const spawnInterval = useRef(1500); // starts spawning every 1.5 seconds

  // Initialize sounds muted state
  useEffect(() => {
    sounds.muted = muted;
  }, [muted]);

  // Prevent scroll when playing
  useEffect(() => {
    if (gameState === "PLAYING" || gameState === "COUNTDOWN") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [gameState]);

  // Bind keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "PLAYING") return;
      keysPressed.current[e.key.toLowerCase()] = true;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
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
  }, [gameState]);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      if (gameState === "PLAYING") {
        fireLaser();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gameState]);

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
    }, 1000);

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

    lasersRef.current = [];
    bugsRef.current = [];
    particlesRef.current = [];
    gameScoreRef.current = 0;
    gameShieldRef.current = 100;
    spawnInterval.current = 1500;
    lastSpawnTime.current = performance.now();

    setScore(0);
    setShield(100);

    // Populate starfield background
    const stars = [];
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 6000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2
      });
    }
    starsRef.current = stars;

    setGameState("COUNTDOWN");
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

    const laserSpeed = 12;
    lasersRef.current.push({
      x: astro.x + Math.cos(angle) * astro.radius,
      y: astro.y + Math.sin(angle) * astro.radius,
      vx: Math.cos(angle) * laserSpeed,
      vy: Math.sin(angle) * laserSpeed,
      angle: angle,
      radius: 4
    });

    // Spawn tiny muzzle flash particles
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

    // Pick a random edge to spawn the bug off-screen
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { // Top
      x = Math.random() * width;
      y = -40;
    } else if (edge === 1) { // Right
      x = width + 40;
      y = Math.random() * height;
    } else if (edge === 2) { // Bottom
      x = Math.random() * width;
      y = height + 40;
    } else { // Left
      x = -40;
      y = Math.random() * height;
    }

    // Bug items representing errors
    const errorTypes = [
      { text: "SyntaxError", color: "#ff4d4d", points: 20 },
      { text: "404 NotFound", color: "#ff9900", points: 30 },
      { text: "NullPointerException", color: "#ff3366", points: 50 },
      { text: "Merge Conflict ❌", color: "#ff33ff", points: 40 },
      { text: "TypeError", color: "#ff3300", points: 25 },
      { text: "🐛 Bug", color: "#00ffcc", points: 15 }
    ];

    const type = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    // Travel direction generally towards the center of the viewport
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
      radius: Math.max(type.text.length * 4.5, 18), // collision bounding box
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03
    });
  };

  const createExplosion = (x, y, color) => {
    sounds.playExplosion();
    // Spawns 12 bright exploding particles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 4 + 1.5
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
    setGameState("GAMEOVER");
    cancelAnimationFrame(gameLoopId.current);

    if (gameScoreRef.current > highScore) {
      setHighScore(gameScoreRef.current);
      localStorage.setItem("astro_shooter_high_score", gameScoreRef.current.toString());
    }
  };

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas to exact viewport bounds
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const loop = (timestamp) => {
      updateGame();
      drawGame(ctx);
      gameLoopId.current = requestAnimationFrame(loop);
    };

    gameLoopId.current = requestAnimationFrame(loop);
  };

  const updateGame = () => {
    // 1. Spawning
    const now = performance.now();
    // Accelerate spawn intervals over score scaling
    const dynamicInterval = Math.max(300, spawnInterval.current - (gameScoreRef.current * 3));
    if (now - lastSpawnTime.current > dynamicInterval) {
      spawnBug();
      lastSpawnTime.current = now;
    }

    // 2. Astronaut Physics
    const astro = astronautRef.current;
    const accel = 0.4;
    const damping = 0.94;
    const maxSpeed = 7;

    // Movement inputs (WASD / Arrows)
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

    // Apply drag
    astro.vx *= damping;
    astro.vy *= damping;

    // Clamp speed limits
    const speed = Math.sqrt(astro.vx * astro.vx + astro.vy * astro.vy);
    if (speed > maxSpeed) {
      astro.vx = (astro.vx / speed) * maxSpeed;
      astro.vy = (astro.vy / speed) * maxSpeed;
    }

    // Update position
    astro.x += astro.vx;
    astro.y += astro.vy;

    // Clamp to viewport borders with slight rebound
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

    // Rotate astronaut face to look at mouse pointer
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

    // 3. Update stars parallax effect
    starsRef.current.forEach((star) => {
      star.x -= star.speed * (astro.vx * 0.1 + 0.5); // base drift + player velocity react
      if (star.x < 0) {
        star.x = window.innerWidth;
        star.y = Math.random() * window.innerHeight;
      }
    });

    // 4. Update lasers
    lasersRef.current = lasersRef.current.filter((laser) => {
      laser.x += laser.vx;
      laser.y += laser.vy;

      // Keep if within screen boundaries
      return (
        laser.x >= 0 &&
        laser.x <= window.innerWidth &&
        laser.y >= 0 &&
        laser.y <= window.innerHeight
      );
    });

    // 5. Update particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      return p.life > 0;
    });

    // 6. Update bugs and collision checks
    bugsRef.current = bugsRef.current.filter((bug) => {
      bug.x += bug.vx;
      bug.y += bug.vy;
      bug.angle += bug.rotationSpeed;

      // Check laser collision
      let hit = false;
      lasersRef.current.forEach((laser) => {
        const ldx = laser.x - bug.x;
        const ldy = laser.y - bug.y;
        const dist = Math.sqrt(ldx * ldx + ldy * ldy);
        if (dist < bug.radius + laser.radius) {
          hit = true;
          laser.x = -9999; // destroy laser
        }
      });

      if (hit) {
        createExplosion(bug.x, bug.y, bug.color);
        gameScoreRef.current += bug.points;
        setScore(gameScoreRef.current);
        return false; // remove bug
      }

      // Check astronaut collision
      const adx = astro.x - bug.x;
      const ady = astro.y - bug.y;
      const distToAstro = Math.sqrt(adx * adx + ady * ady);
      if (distToAstro < bug.radius + astro.radius) {
        createExplosion(bug.x, bug.y, "#ff3333");
        triggerDamage();

        gameShieldRef.current = Math.max(0, gameShieldRef.current - 20);
        setShield(gameShieldRef.current);

        if (gameShieldRef.current <= 0) {
          triggerGameOver();
        }
        return false; // remove bug
      }

      // Keep if on-screen or close to boundaries
      return (
        bug.x >= -100 &&
        bug.x <= window.innerWidth + 100 &&
        bug.y >= -100 &&
        bug.y <= window.innerHeight + 100
      );
    });
  };

  const drawGame = (ctx) => {
    // Clear screen with a semitransparent overlay to get beautiful neon light tracers
    ctx.fillStyle = "rgba(10, 4, 22, 0.4)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 1. Draw Starfield Parallax
    starsRef.current.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Lasers
    lasersRef.current.forEach((laser) => {
      ctx.save();
      ctx.translate(laser.x, laser.y);
      ctx.rotate(laser.angle);
      
      // Neon green light tracer line
      ctx.shadowColor = "#00ffcc";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-8, -1.5, 16, 3);
      ctx.restore();
    });

    // 3. Draw Bugs (floating text errors or emojis)
    bugsRef.current.forEach((bug) => {
      ctx.save();
      ctx.translate(bug.x, bug.y);
      ctx.rotate(bug.angle);

      // Red/pink neon glow for errors
      ctx.shadowColor = bug.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = bug.color;
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(bug.text, 0, 0);

      // Draw bounding box details for retro vibe
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.strokeRect(-bug.radius, -10, bug.radius * 2, 20);

      ctx.restore();
    });

    // 4. Draw Particles
    particlesRef.current.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    // 5. Draw Astronaut
    const astro = astronautRef.current;
    ctx.save();
    ctx.translate(astro.x, astro.y);
    ctx.rotate(astro.angle);

    // Neon drop shadow
    ctx.shadowColor = "#be50f4";
    ctx.shadowBlur = 15;

    // Backpack (Left of orientation)
    ctx.fillStyle = "#a588c0";
    ctx.fillRect(-22, -10, 8, 20);

    // Body suit (White)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-2, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Helmet visor (Dark faceplate with HUD glow)
    ctx.fillStyle = "#2d1950";
    ctx.beginPath();
    ctx.arc(4, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Visor Glass
    ctx.fillStyle = "#00ffcc";
    ctx.shadowColor = "#00ffcc";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(6, 0, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thruster nozzles (Rear)
    ctx.fillStyle = "#333333";
    ctx.shadowBlur = 0;
    ctx.fillRect(-24, -6, 2, 4);
    ctx.fillRect(-24, 2, 2, 4);

    ctx.restore();
  };

  const handleExit = () => {
    cancelAnimationFrame(gameLoopId.current);
    setGameState("IDLE");
  };

  return (
    <div className="arcade-section-container">
      {/* Inline Space Mission Launcher Dashboard */}
      {gameState === "IDLE" && (
        <div className="space-terminal">
          <div className="terminal-glitch-border"></div>
          <div className="terminal-header">
            <FaRocket className="rocket-icon" />
            <h3>SPACE MISSION TERMINAL v2.5</h3>
          </div>

          <div className="terminal-body">
            <p className="terminal-desc">
              An astronaut is lost in cyberspace! Clean up code-leaks, compiler warnings, and floating bugs that are drifting across the portfolio layout.
            </p>
            <div className="terminal-stats">
              <div className="stat-card">
                <FaTrophy className="stat-icon trophy" />
                <div className="stat-info">
                  <span className="stat-label">RECORD HIGH SCORE</span>
                  <span className="stat-value neon-purple">{highScore} PTS</span>
                </div>
              </div>
            </div>

            <div className="controls-guide">
              <h5>MISSION CONTROLS</h5>
              <ul>
                <li><span>WASD / Arrow Keys</span>: Floating Movement (drift inertia)</li>
                <li><span>Mouse Movement</span>: Aim Laser Guns</li>
                <li><span>Left Click / Spacebar</span>: Fire Laser Cannon</li>
              </ul>
            </div>

            <button className="launch-mission-btn" onClick={initiateGame}>
              LAUNCH SPACE MISSION
            </button>
          </div>
        </div>
      )}

      {/* Global Full-Screen Game Overlay */}
      {(gameState === "COUNTDOWN" || gameState === "PLAYING" || gameState === "GAMEOVER") && (
        <div className={`space-game-overlay ${screenShake ? "shake-effect" : ""}`}>
          
          {/* Transparent Canvas Layer */}
          <canvas ref={canvasRef} className="space-game-canvas" />

          {/* Countdown timer */}
          {gameState === "COUNTDOWN" && (
            <div className="countdown-overlay">
              <span className="countdown-num">{countdown === 0 ? "LAUNCH!" : countdown}</span>
            </div>
          )}

          {/* Interactive HUD HUD */}
          {gameState === "PLAYING" && (
            <div className="game-hud-panel">
              <div className="hud-metric">
                <span className="hud-title">SCORE:</span>
                <span className="hud-metric-value text-cyan">{score}</span>
              </div>

              <div className="hud-shield-container">
                <span className="hud-title"><FaHeart className="heart-icon" /> SHIELD:</span>
                <div className="shield-bar-bg">
                  <div className="shield-bar-fill" style={{ width: `${shield}%` }}></div>
                </div>
              </div>

              <div className="hud-buttons">
                <button 
                  className="hud-audio-btn" 
                  onClick={() => setMuted(!muted)}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <button className="exit-mission-btn" onClick={handleExit}>
                  EXIT MISSION
                </button>
              </div>
            </div>
          )}

          {/* Retro Game Over screen */}
          {gameState === "GAMEOVER" && (
            <div className="gameover-overlay">
              <div className="gameover-box">
                <h1 className="error-title">CRITICAL ERROR</h1>
                <p className="error-desc">Astronaut shield fully depleted. Cyber-bugs took over.</p>
                
                <div className="gameover-stats">
                  <div className="gameover-stat">
                    <span>FINAL SCORE:</span>
                    <span className="score-val text-cyan">{score}</span>
                  </div>
                  {score >= highScore && score > 0 && (
                    <div className="new-record-tag">NEW RECORD ESTABLISHED!</div>
                  )}
                </div>

                <div className="gameover-actions">
                  <button className="retry-btn" onClick={initiateGame}>
                    RETRY MISSION
                  </button>
                  <button className="exit-btn" onClick={handleExit}>
                    CLOSE CONSOLE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
