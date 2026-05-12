export function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-float absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.16 210 / 0.45), transparent 70%)" }}
      />
      <div
        className="animate-float absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ animationDelay: "-6s", background: "radial-gradient(circle, oklch(0.65 0.18 250 / 0.4), transparent 70%)" }}
      />
      <div
        className="animate-float absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ animationDelay: "-12s", background: "radial-gradient(circle, oklch(0.85 0.18 215 / 0.35), transparent 70%)" }}
      />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
