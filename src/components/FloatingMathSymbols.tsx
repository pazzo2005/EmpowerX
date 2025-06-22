
import { useEffect } from "react";

const FloatingMathSymbols = () => {
  const symbols = ["π", "√", "∑", "∞", "∫", "Δ", "α", "β", "γ", "θ", "φ", "Ω", "∇", "±", "≠", "≤", "≥"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const symbols = document.querySelectorAll('.math-symbol');
      symbols.forEach((symbol, index) => {
        const speed = (index + 1) * 0.02;
        const x = (e.clientX * speed) % 50;
        const y = (e.clientY * speed) % 50;
        const rotation = (x + y) * 2;
        (symbol as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.2})`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="math-symbol absolute transition-all duration-1000 ease-out"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.3}s`,
            fontSize: `${3 + Math.random() * 4}rem`,
            color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
            textShadow: '0 0 30px currentColor, 0 0 60px currentColor',
            filter: 'blur(0.5px)',
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default FloatingMathSymbols;
