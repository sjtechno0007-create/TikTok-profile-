import React, { useRef } from "react";

export default function ThreeDTiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 16; // degrees
    const rotX = (0.5 - y) * 16;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 400ms ease";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 400);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="bg-white/6 backdrop-blur-md border border-white/6 rounded-2xl shadow-xl p-6"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
