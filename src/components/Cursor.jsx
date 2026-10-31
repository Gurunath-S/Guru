import React, { useEffect, useRef } from "react";
import "../cursor.css";

function Cursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        let animId;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
            animId = requestAnimationFrame(animate);
        };

        const onMouseDown = () => ring.classList.add("clicking");
        const onMouseUp = () => ring.classList.remove("clicking");

        const onMouseOver = (e) => {
            if (e.target.closest("a, button, [role='button'], input, textarea")) {
                ring.classList.add("hovering");
            } else {
                ring.classList.remove("hovering");
            }
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mousedown", onMouseDown, { passive: true });
        window.addEventListener("mouseup", onMouseUp, { passive: true });
        window.addEventListener("mouseover", onMouseOver, { passive: true });

        animate();

        return () => {
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseover", onMouseOver);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}

export default Cursor;
