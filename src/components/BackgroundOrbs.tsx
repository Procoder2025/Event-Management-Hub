/* ============================================
   Background Effects
   Mesh gradient + floating orbs + star field
   ============================================ */

export default function BackgroundOrbs() {
  return (
    <>
      <div className="mesh-bg" />
      <div className="stars" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary orbs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-600 blur-[120px] opacity-20 -top-32 -left-32 animate-float" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-pink-500 blur-[120px] opacity-15 top-1/3 -right-24 animate-float-delayed" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500 blur-[120px] opacity-10 -bottom-32 left-[25%] animate-float-slow" />
        {/* Subtle accent */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-violet-400 blur-[80px] opacity-10 top-[60%] right-[20%] animate-float" />
      </div>
    </>
  );
}
