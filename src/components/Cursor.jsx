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

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            requestAnimationFrame(animate);
        };

        const onMouseDown = () => ring.classList.add("clicking");
        const onMouseUp = () => ring.classList.remove("clicking");

        const onMouseEnterLink = () => ring.classList.add("hovering");
        const onMouseLeaveLink = () => ring.classList.remove("hovering");

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        document.querySelectorAll("a, button").forEach((el) => {
            el.addEventListener("mouseenter", onMouseEnterLink);
            el.addEventListener("mouseleave", onMouseLeaveLink);
        });

        animate();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
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
