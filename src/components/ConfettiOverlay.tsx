import React from 'react';
import '../styles/Confetti.css';

interface ConfettiOverlayProps {
  durationMs?: number;
  onClose?: () => void;
}

const colors = ['#2C4795', '#1E78E0', '#49A3FF', '#FFD166', '#06D6A0', '#EF476F'];

const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ durationMs = 2500, onClose }) => {
  React.useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onClose]);

  const pieces = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {pieces.map((i) => {
        const left = Math.random() * 100; // vw percentage
        const size = 6 + Math.random() * 10; // px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 0.6; // s
        const duration = 1.8 + Math.random() * 1.4; // s
        const rotation = Math.random() * 360;
        const style: React.CSSProperties = {
          left: `${left}vw`,
          width: size,
          height: size,
          backgroundColor: color,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          transform: `rotate(${rotation}deg)`
        };
        return <span key={i} className="confetti-piece" style={style} />;
      })}
      <div className="confetti-message">Section completed! 🎉</div>
    </div>
  );
};

export default ConfettiOverlay;
