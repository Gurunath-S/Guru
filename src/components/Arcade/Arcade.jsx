import React, { useState, useEffect, useRef } from "react";
import { FaGamepad, FaVolumeUp, FaVolumeMute, FaTimes, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Arcade.css";

// Audio Synth helper using Web Audio API
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playEat() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.error("Audio error", e);
    }
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sawtooth";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error("Audio error", e);
    }
  }

  playStart() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.08, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.15);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.15);
      });
    } catch (e) {
      console.error("Audio error", e);
    }
  }

  playBonus() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.12);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.12);
      });
    } catch (e) {
      console.error("Audio error", e);
    }
  }
}

const synth = new SoundSynth();

const GRID_SIZE_X = 20;
const GRID_SIZE_Y = 15;
const CELL_SIZE = 20; // Size of a cell on canvas (400x300)

export default function Arcade() {
  const [isFocused, setIsFocused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("bug_hunter_high_score") || "0", 10);
  });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("START"); // START, PLAYING, GAME_OVER
  const [muted, setMuted] = useState(false);

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Mutable game state variables to avoid closure stale state in game loop
  const snakeRef = useRef([{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]);
  const directionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 12, y: 7, type: "COFFEE" }); // COFFEE (☕), PR (🔀), STAR (⭐)
  const bugsRef = useRef([]); // Obstacles that can move
  const conflictsRef = useRef([]); // Static obstacles (❌)
  const particlesRef = useRef([]);
  const scoreRef = useRef(0);
  const speedRef = useRef(150); // Speed in ms
  const lastUpdateRef = useRef(0);

  // Initialize Audio Synth toggle state
  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  // Listen to keyboard direction keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFocused) return;

      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D", " ", "Enter"];
      if (keys.includes(e.key)) {
        e.preventDefault(); // Stop page scrolling
      }

      if (gameState !== "PLAYING") {
        if (e.key === "Enter" || e.key === " ") {
          startGame();
        }
        return;
      }

      const dir = directionRef.current;
      let newDir = null;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        if (dir.y === 0) newDir = { x: 0, y: -1 };
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        if (dir.y === 0) newDir = { x: 0, y: 1 };
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (dir.x === 0) newDir = { x: -1, y: 0 };
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (dir.x === 0) newDir = { x: 1, y: 0 };
      }

      if (newDir) {
        nextDirectionRef.current = newDir;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, gameState]);

  // Game initialization
  const startGame = () => {
    snakeRef.current = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 }
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    speedRef.current = 150;
    bugsRef.current = [];
    conflictsRef.current = [];
    particlesRef.current = [];
    spawnFood();
    setGameState("PLAYING");
    synth.playStart();
    lastUpdateRef.current = performance.now();
  };

  // Spawns items in empty cells
  const spawnFood = () => {
    const isOccupied = (x, y) => {
      if (snakeRef.current.some((seg) => seg.x === x && seg.y === y)) return true;
      if (bugsRef.current.some((bug) => bug.x === x && bug.y === y)) return true;
      if (conflictsRef.current.some((c) => c.x === x && c.y === y)) return true;
      return false;
    };

    let attempts = 0;
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE_X);
      y = Math.floor(Math.random() * GRID_SIZE_Y);
      attempts++;
    } while (isOccupied(x, y) && attempts < 100);

    const rand = Math.random();
    let type = "COFFEE"; // Standard
    if (rand > 0.85) {
      type = "PR"; // Pull Request (bonus points)
    } else if (rand > 0.7) {
      type = "STAR"; // Github Star (mid-tier)
    }

    foodRef.current = { x, y, type };
  };

  // Spawn obstacles: Bugs (moving) and Conflicts (static)
  const spawnObstacle = () => {
    const isOccupied = (x, y) => {
      if (snakeRef.current.some((seg) => seg.x === x && seg.y === y)) return true;
      if (foodRef.current.x === x && foodRef.current.y === y) return true;
      if (bugsRef.current.some((bug) => bug.x === x && bug.y === y)) return true;
      if (conflictsRef.current.some((c) => c.x === x && c.y === y)) return true;
      return false;
    };

    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * GRID_SIZE_X);
      y = Math.floor(Math.random() * GRID_SIZE_Y);
      attempts++;
    } while (isOccupied(x, y) && attempts < 100);

    if (Math.random() > 0.5) {
      // Spawn static Merge Conflict
      conflictsRef.current.push({ x, y });
    } else {
      // Spawn moving Bug
      bugsRef.current.push({
        x,
        y,
        dirX: Math.random() > 0.5 ? 1 : -1,
        dirY: Math.random() > 0.5 ? 1 : -1
      });
    }
  };

  // Create explosion particles on eat
  const spawnParticles = (x, y, color) => {
    const px = x * CELL_SIZE + CELL_SIZE / 2;
    const py = y * CELL_SIZE + CELL_SIZE / 2;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.05 + 0.03,
        color
      });
    }
  };

  // Direction handler for on-screen controls
  const handleVirtualDir = (dx, dy) => {
    if (gameState !== "PLAYING") return;
    const dir = directionRef.current;
    if (dx !== 0 && dir.x === 0) {
      nextDirectionRef.current = { x: dx, y: 0 };
    } else if (dy !== 0 && dir.y === 0) {
      nextDirectionRef.current = { x: 0, y: dy };
    }
  };

  // Main Canvas Rendering & Game Loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const updateGame = () => {
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      const dir = nextDirectionRef.current;
      directionRef.current = dir;

      // Update head position
      head.x += dir.x;
      head.y += dir.y;

      // Check grid wall collision
      if (head.x < 0 || head.x >= GRID_SIZE_X || head.y < 0 || head.y >= GRID_SIZE_Y) {
        gameOver();
        return;
      }

      // Check self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
      }

      // Check conflict obstacles collision
      if (conflictsRef.current.some((c) => c.x === head.x && c.y === head.y)) {
        gameOver();
        return;
      }

      // Check bug collision
      if (bugsRef.current.some((b) => b.x === head.x && b.y === head.y)) {
        gameOver();
        return;
      }

      // Insert new head at the beginning
      snake.unshift(head);

      // Check if food is eaten
      const food = foodRef.current;
      if (head.x === food.x && head.y === food.y) {
        let points = 10;
        let pColor = "#cd5ff8";

        if (food.type === "PR") {
          points = 50;
          pColor = "#00ffcc";
          synth.playBonus();
        } else if (food.type === "STAR") {
          points = 25;
          pColor = "#ffcc00";
          synth.playEat();
        } else {
          synth.playEat();
        }

        // Add to score
        scoreRef.current += points;
        setScore(scoreRef.current);

        spawnParticles(food.x, food.y, pColor);
        spawnFood();

        // Speed scaling & obstacle spawning
        if (scoreRef.current % 30 === 0) {
          spawnObstacle();
          speedRef.current = Math.max(70, speedRef.current - 8);
        }
      } else {
        // Remove tail if no food eaten
        snake.pop();
      }

      snakeRef.current = snake;

      // Update moving Bugs
      bugsRef.current = bugsRef.current.map((bug) => {
        let nx = bug.x + bug.dirX;
        let ny = bug.y + bug.dirY;

        // Bounce off bounds
        if (nx < 0 || nx >= GRID_SIZE_X) {
          bug.dirX *= -1;
          nx = bug.x + bug.dirX;
        }
        if (ny < 0 || ny >= GRID_SIZE_Y) {
          bug.dirY *= -1;
          ny = bug.y + bug.dirY;
        }

        return { ...bug, x: nx, y: ny };
      });
    };

    const gameOver = () => {
      setGameState("GAME_OVER");
      synth.playCrash();

      // Check high score
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem("bug_hunter_high_score", scoreRef.current.toString());
      }
    };

    const draw = () => {
      // Clear canvas with deep violet
      ctx.fillStyle = "#0c0517";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(190, 80, 244, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE_X; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j <= GRID_SIZE_Y; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * CELL_SIZE);
        ctx.lineTo(canvas.width, j * CELL_SIZE);
        ctx.stroke();
      }

      // Draw game content depending on state
      if (gameState === "START") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#be50f4";
        ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("BUG HUNTER ARCADE", canvas.width / 2, canvas.height / 2 - 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'Space Grotesk', sans-serif";
        ctx.fillText("Eat code items, avoid Bugs & Conflicts!", canvas.width / 2, canvas.height / 2 + 10);

        ctx.fillStyle = "#00ffcc";
        ctx.font = "12px monospace";
        ctx.fillText("PRESS [SPACE / ENTER] OR CLICK PLAY", canvas.width / 2, canvas.height / 2 + 45);
      } else if (gameState === "GAME_OVER") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#ff4a4a";
        ctx.font = "bold 24px 'Space Grotesk', sans-serif";
        ctx.fillText("CRITICAL ERROR", canvas.width / 2, canvas.height / 2 - 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'Space Grotesk', sans-serif";
        ctx.fillText(`Final Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 - 5);

        if (scoreRef.current >= highScore && scoreRef.current > 0) {
          ctx.fillStyle = "#ffcc00";
          ctx.font = "14px monospace";
          ctx.fillText("NEW HIGH SCORE!", canvas.width / 2, canvas.height / 2 + 20);
        }

        ctx.fillStyle = "#00ffcc";
        ctx.font = "12px monospace";
        ctx.fillText("PRESS [SPACE] OR PLAY TO RETRY", canvas.width / 2, canvas.height / 2 + 50);
      } else {
        // PLAYING

        // 1. Draw Food
        const food = foodRef.current;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let foodChar = "☕";
        if (food.type === "PR") foodChar = "🔀";
        if (food.type === "STAR") foodChar = "⭐";
        ctx.fillText(foodChar, food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2);

        // 2. Draw Static Merge Conflicts (❌)
        conflictsRef.current.forEach((c) => {
          ctx.font = "14px sans-serif";
          ctx.fillText("❌", c.x * CELL_SIZE + CELL_SIZE / 2, c.y * CELL_SIZE + CELL_SIZE / 2);
        });

        // 3. Draw Moving Bugs (🐛)
        bugsRef.current.forEach((b) => {
          ctx.font = "14px sans-serif";
          ctx.fillText("🐛", b.x * CELL_SIZE + CELL_SIZE / 2, b.y * CELL_SIZE + CELL_SIZE / 2);
        });

        // 4. Draw Snake
        const snake = snakeRef.current;
        const bodyChars = ["{", "s", "n", "a", "k", "e", "}", "1", "0", "[", "]", "c", "o", "d", "e"];
        snake.forEach((segment, idx) => {
          // Neon shadow for the snake
          ctx.shadowColor = idx === 0 ? "#00ffcc" : "#be50f4";
          ctx.shadowBlur = 8;

          ctx.fillStyle = idx === 0 ? "#00ffcc" : "rgba(190, 80, 244, 0.85)";
          
          if (idx === 0) {
            // Draw head
            ctx.font = "bold 13px monospace";
            ctx.fillText("()=>", segment.x * CELL_SIZE + CELL_SIZE / 2, segment.y * CELL_SIZE + CELL_SIZE / 2);
          } else {
            // Draw body as code characters
            const charIdx = (idx - 1) % bodyChars.length;
            ctx.font = "12px monospace";
            ctx.fillText(bodyChars[charIdx], segment.x * CELL_SIZE + CELL_SIZE / 2, segment.y * CELL_SIZE + CELL_SIZE / 2);
          }
        });

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      // Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        return p.life > 0;
      });
      ctx.globalAlpha = 1.0;
    };

    const loop = (timestamp) => {
      if (gameState === "PLAYING") {
        const elapsed = timestamp - lastUpdateRef.current;
        if (elapsed > speedRef.current) {
          updateGame();
          lastUpdateRef.current = timestamp;
        }
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, highScore]);

  return (
    <div className="arcade-section-container">
      <div 
        className={`arcade-window ${isFocused ? "focused" : ""}`}
        tabIndex="0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Header */}
        <div className="arcade-header">
          <div className="arcade-title">
            <FaGamepad style={{ animation: "pulse 1.5s infinite" }} />
            BUG_HUNTER_V1.EXE
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button 
              className="audio-toggle-btn"
              onClick={() => setMuted(!muted)}
              style={{ color: "#c770f0", fontSize: "14px", textDecoration: "none" }}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
        </div>

        {/* Screen Area */}
        <div className="arcade-screen-container">
          <div className="crt-effect" onClick={() => { if(gameState !== "PLAYING") startGame(); }}>
            <canvas 
              ref={canvasRef} 
              width={GRID_SIZE_X * CELL_SIZE} 
              height={GRID_SIZE_Y * CELL_SIZE} 
              className="arcade-canvas" 
            />
            {/* Focus overlay */}
            {!isFocused && (
              <div className="arcade-focus-overlay">
                <span className="focus-text">CLICK TO PLAY</span>
                <span className="focus-subtext">Click here to capture controls</span>
              </div>
            )}
          </div>

          {/* HUD Info */}
          <div className="arcade-hud">
            <div className="hud-item">
              <span>SCORE:</span>
              <span className="hud-value">{score}</span>
            </div>
            <div className="hud-item">
              <span>HI-SCORE:</span>
              <span className="hud-value">{highScore}</span>
            </div>
          </div>

          {/* Virtual arrow keys for Mobile support */}
          <div className="arcade-controls">
            <div className="control-row">
              <button 
                className="control-btn" 
                onClick={() => handleVirtualDir(0, -1)}
                aria-label="Move Up"
              >
                <FaArrowUp />
              </button>
            </div>
            <div className="control-row" style={{ margin: "5px 0" }}>
              <button 
                className="control-btn" 
                onClick={() => handleVirtualDir(-1, 0)}
                aria-label="Move Left"
              >
                <FaArrowLeft />
              </button>
              <div style={{ width: "50px" }}></div>
              <button 
                className="control-btn" 
                onClick={() => handleVirtualDir(1, 0)}
                aria-label="Move Right"
              >
                <FaArrowRight />
              </button>
            </div>
            <div className="control-row">
              <button 
                className="control-btn" 
                onClick={() => handleVirtualDir(0, 1)}
                aria-label="Move Down"
              >
                <FaArrowDown />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom instructions */}
        <div className="arcade-footer">
          {gameState === "PLAYING" ? (
            <span>Use Arrow Keys or WASD to control your Dev-Snake.</span>
          ) : (
            <span>Click the screen or press SPACE to launch the arcade game.</span>
          )}
        </div>
      </div>
    </div>
  );
}
