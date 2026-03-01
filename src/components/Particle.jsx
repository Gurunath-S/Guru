import React, { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import "./Particle.css";

function Particle() {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    // Helper function to generate random trajectory
    const getRandomTrajectory = () => {
      const edge = Math.floor(Math.random() * 4);
      let startX, startY, endX, endY;

      if (edge === 0) { // Top
        startX = Math.random() * 100; startY = -10;
        endX = Math.random() * 100; endY = 110;
      } else if (edge === 1) { // Right
        startX = 110; startY = Math.random() * 100;
        endX = -10; endY = Math.random() * 100;
      } else if (edge === 2) { // Bottom
        startX = Math.random() * 100; startY = 110;
        endX = Math.random() * 100; endY = -10;
      } else { // Left
        startX = -10; startY = Math.random() * 100;
        endX = 110; endY = Math.random() * 100;
      }

      const angle = Math.atan2(
        (endY - startY) * window.innerHeight,
        (endX - startX) * window.innerWidth
      ) * (180 / Math.PI);

      return { startX, startY, endX, endY, angle };
    };

    // --- COMET SPAWN LOOP ---
    const spawnComets = () => {
      const numObjects = Math.floor(Math.random() * 2) + 1; // 1 or 2 comets
      const { startX: baseStartX, startY: baseStartY, endX: baseEndX, endY: baseEndY } = getRandomTrajectory();

      const newDuration = Math.random() * 0.8 + 0.5; // Fast comets (0.5-1.3s)
      const newComets = [];

      for (let i = 0; i < numObjects; i++) {
        const offsetStartX = baseStartX + (Math.random() * 10 - 5);
        const offsetStartY = baseStartY + (Math.random() * 10 - 5);
        const offsetEndX = baseEndX + (Math.random() * 10 - 5);
        const offsetEndY = baseEndY + (Math.random() * 10 - 5);

        const angle = Math.atan2(
          (offsetEndY - offsetStartY) * window.innerHeight,
          (offsetEndX - offsetStartX) * window.innerWidth
        ) * (180 / Math.PI);

        newComets.push({
          id: Math.random().toString(36).substring(7),
          type: 'comet',
          size: Math.random() * 5 + 3,
          startX: offsetStartX, startY: offsetStartY,
          endX: offsetEndX, endY: offsetEndY,
          angle,
          duration: newDuration,
        });
      }

      setObjects(prev => [...prev.filter(o => o.type !== 'comet'), ...newComets]); // Replace old comets

      setTimeout(() => {
        setObjects(prev => prev.filter(o => o.type !== 'comet')); // Despawn comets
        setTimeout(spawnComets, Math.random() * 20000 + 10000); // Wait 10-30s
      }, newDuration * 1000 + 500);
    };

    // --- ASTEROID SPAWN LOOP ---
    const spawnAsteroid = () => {
      const { startX, startY, endX, endY, angle } = getRandomTrajectory();
      const newDuration = Math.random() * 8 + 7; // Slow asteroids (7-15s)

      const newAsteroid = {
        id: Math.random().toString(36).substring(7),
        type: 'asteroid',
        size: Math.random() * 25 + 15,
        startX, startY, endX, endY, angle,
        duration: newDuration,
      };

      setObjects(prev => [...prev.filter(o => o.type !== 'asteroid'), newAsteroid]); // Replace old asteroids

      setTimeout(() => {
        setObjects(prev => prev.filter(o => o.type !== 'asteroid')); // Despawn asteroid
        setTimeout(spawnAsteroid, Math.random() * 3000 + 7000); // Wait 7-10s
      }, newDuration * 1000 + 500);
    };

    // Start loops
    const cometTimeout = setTimeout(spawnComets, 5000);
    const asteroidTimeout = setTimeout(spawnAsteroid, 2000);

    return () => {
      clearTimeout(cometTimeout);
      clearTimeout(asteroidTimeout);
    };
  }, []);

  return (
    <>
      {objects.map(obj => (
        <div
          key={obj.id}
          className={`space-object ${obj.type}`}
          style={{
            '--start-x': `${obj.startX}vw`,
            '--start-y': `${obj.startY}vh`,
            '--end-x': `${obj.endX}vw`,
            '--end-y': `${obj.endY}vh`,
            '--angle': `${obj.angle}deg`,
            '--duration': `${obj.duration}s`,
            width: `${obj.size}px`,
            height: `${obj.size}px`,
            marginTop: `${-obj.size / 2}px`,
            marginLeft: `${-obj.size / 2}px`
          }}
        ></div>
      ))}
      <Particles
        id="tsparticles"
        params={{
          particles: {
            number: {
              value: 160,
              density: { enable: true, value_area: 1500 },
            },
            color: {
              value: ["#c770f0", "#3a7bd5", "#00d2ff", "#ffffff"],
            },
            line_linked: {
              enable: false,
              opacity: 0.03,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "out",
              random: true,
              speed: 0.3,
              straight: false,
            },
            size: {
              value: 1,
            },
            opacity: {
              anim: { enable: true, speed: 1, opacity_min: 0.05 },
            },
          },
          interactivity: {
            events: {
              onDiv: {
                enable: true,
                selectors: ".space-object",
                mode: "repulse",
                type: "circle",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              push: {
                particles_nb: 1,
              },
              repulse: {
                distance: 120,
                duration: 0.4,
              },
            },
          },
          retina_detect: true,
        }}
      />
    </>
  );
}

export default Particle;
