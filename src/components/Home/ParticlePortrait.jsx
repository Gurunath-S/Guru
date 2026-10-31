import React, { useRef, useEffect, useState } from "react";
import portraitImg from "../../Assets/image.png";

const ParticlePortrait = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const linesRef = useRef([]);
    const imageLoadedRef = useRef(false);
    const startTimeRef = useRef(null);
    const [size, setSize] = useState(() => {
        if (typeof window !== "undefined") {
            const width = window.innerWidth;
            if (width <= 480) return Math.min(320, width - 40);
            if (width <= 768) return Math.min(380, width - 60);
            return 450;
        }
        return 450;
    });

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setSize(Math.min(320, width - 40));
            } else if (width <= 768) {
                setSize(Math.min(380, width - 60));
            } else {
                setSize(450);
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const canvasWidth = size;
        const canvasHeight = size;
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        ctx.scale(dpr, dpr);

        let animationId;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = portraitImg;

        img.onload = () => {
            const offscreen = document.createElement("canvas");
            const offCtx = offscreen.getContext("2d");
            offscreen.width = canvasWidth;
            offscreen.height = canvasHeight;

            const scale = 0.85;
            const imgAspect = img.width / img.height;

            let drawHeight = canvasHeight * scale;
            let drawWidth = drawHeight * imgAspect;

            if (drawWidth > canvasWidth * scale) {
                drawWidth = canvasWidth * scale;
                drawHeight = drawWidth / imgAspect;
            }

            const offsetX = (canvasWidth - drawWidth) / 2;
            const offsetY = (canvasHeight - drawHeight) / 2;

            offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
            const pixels = imageData.data;

            const particles = [];
            const colGap = size <= 320 ? 5.2 : size <= 380 ? 5.8 : 6.4;
            const rowGap = size <= 320 ? 7.4 : size <= 380 ? 8.2 : 9.2;
            const ASCII_CHARS = [".", "'", ":", "\"", ";", "+", "="];

            for (let y = 0; y < canvasHeight; y += rowGap) {
                for (let x = 0; x < canvasWidth; x += colGap) {
                    const px = Math.floor(x);
                    const py = Math.floor(y);
                    if (px < 0 || px >= canvasWidth || py < 0 || py >= canvasHeight) continue;

                    const i = (py * canvasWidth + px) * 4;
                    const a = pixels[i + 3];

                    if (a > 90) {
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];

                        // Perceived luminance formula (Rec. 601)
                        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                        // Map brightness to requested ASCII character set (. ' : " ; + =)
                        const charIndex = Math.min(
                            ASCII_CHARS.length - 1,
                            Math.floor(brightness * ASCII_CHARS.length)
                        );
                        const char = ASCII_CHARS[charIndex];

                        const scatterX = (Math.random() - 0.5) * 260;
                        const scatterY = (Math.random() - 0.5) * 260;

                        particles.push({
                            x: x + scatterX,
                            y: y + scatterY,
                            targetX: x,
                            targetY: y,
                            vx: 0,
                            vy: 0,
                            char: char,
                            baseAlpha: 0.45 + brightness * 0.55,
                            currentAlpha: 0,
                            delay: Math.random() * 0.35,
                        });
                    }
                }
            }

            linesRef.current = particles;
            imageLoadedRef.current = true;
            startTimeRef.current = performance.now();
            startLoop();
        };

        const fontSize = size <= 320 ? 8 : size <= 380 ? 9 : 10;
        let isVisible = true;
        let isRunning = false;

        const startLoop = () => {
            if (!isRunning && isVisible && imageLoadedRef.current) {
                isRunning = true;
                animationId = requestAnimationFrame(draw);
            }
        };

        const draw = () => {
            if (!isVisible) {
                isRunning = false;
                return;
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            if (!imageLoadedRef.current) {
                isRunning = false;
                return;
            }

            const particles = linesRef.current;
            const mouse = mouseRef.current;
            const elapsed = (performance.now() - startTimeRef.current) / 1000;

            ctx.font = `600 ${fontSize}px "Space Grotesk", "Fira Code", monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#c770f0";

            let maxMovement = 0;

            for (let j = 0; j < particles.length; j++) {
                const p = particles[j];
                const particleTime = elapsed - p.delay;

                if (particleTime < 0) continue;

                const fadeProgress = Math.min(particleTime / 1.5, 1);
                const easedFade = 1 - Math.pow(1 - fadeProgress, 2);
                p.currentAlpha = p.baseAlpha * easedFade;

                const moveProgress = Math.min(particleTime / 2.2, 1);
                const easedMove = 1 - Math.pow(1 - moveProgress, 3);

                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 65;

                    if (dist < maxDist && dist > 0) {
                        const force = (1 - dist / maxDist) * 3;
                        p.vx += (dx / dist) * force;
                        p.vy += (dy / dist) * force;
                    }
                }

                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;

                const pullStrength = 0.01 + easedMove * 0.07;
                p.vx += dx * pullStrength;
                p.vy += dy * pullStrength;

                p.vx *= 0.92;
                p.vy *= 0.92;

                p.x += p.vx;
                p.y += p.vy;

                const speed = Math.abs(p.vx) + Math.abs(p.vy);
                if (speed > maxMovement) maxMovement = speed;

                ctx.globalAlpha = p.currentAlpha;
                ctx.fillText(p.char, p.x, p.y);
            }

            ctx.globalAlpha = 1;

            // Idle detection: sleep if motion settled and mouse inactive to save 100% CPU
            if (elapsed > 2.5 && !mouse.active && maxMovement < 0.03) {
                isRunning = false;
                return;
            }

            animationId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
            startLoop();
        };

        const handleTouchMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouseRef.current.x = touch.clientX - rect.left;
            mouseRef.current.y = touch.clientY - rect.top;
            mouseRef.current.active = true;
            startLoop();
        };

        const handleLeave = () => {
            mouseRef.current.active = false;
        };

        // Pause offscreen with IntersectionObserver
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startLoop();
                } else if (animationId) {
                    cancelAnimationFrame(animationId);
                    isRunning = false;
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleLeave);
        canvas.addEventListener("touchmove", handleTouchMove);
        canvas.addEventListener("touchend", handleLeave);

        startLoop();

        return () => {
            observer.disconnect();
            if (animationId) cancelAnimationFrame(animationId);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleLeave);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleLeave);
        };
    }, [size]);

    return (
        <canvas
            ref={canvasRef}
            className="simulation-container"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                cursor: "crosshair",
                pointerEvents: "auto", // Ensure container registers mouse movement
            }}
        />
    );
};

export default ParticlePortrait;
