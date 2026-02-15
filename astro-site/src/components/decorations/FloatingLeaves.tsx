import { useEffect, useState } from 'react';

interface Props {
  count?: number;
  className?: string;
}

interface Leaf {
  id: number;
  variant: 'oak' | 'maple' | 'birch';
  parallaxSpeed: 'slow' | 'medium' | 'fast';
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export default function FloatingLeaves({ count = 8, className = '' }: Props) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const variants: Array<'oak' | 'maple' | 'birch'> = ['oak', 'maple', 'birch'];
    const parallaxSpeeds: Array<'slow' | 'medium' | 'fast'> = ['slow', 'medium', 'fast'];
    const generatedLeaves: Leaf[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      variant: variants[Math.floor(Math.random() * variants.length)],
      parallaxSpeed: parallaxSpeeds[i % 3],
      left: Math.random() * 100,
      size: 30 + Math.random() * 40,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
    }));
    setLeaves(generatedLeaves);
  }, [count]);

  const leafPaths = {
    oak: 'M24 2c-3 0-6 2-8 4-2-2-5-4-8-4-6 0-8 6-8 10 0 8 6 14 12 18 2 1 3 2 4 2s2-1 4-2c6-4 12-10 12-18 0-4-2-10-8-10z M24 28c-1 0-2-1-3-1-5-3-10-8-10-15 0-3 1-7 5-7 2 0 4 1 6 3l2 2 2-2c2-2 4-3 6-3 4 0 5 4 5 7 0 7-5 12-10 15-1 0-2 1-3 1z',
    maple: 'M24 2L20 12 10 8 14 18 4 22 14 26 10 36 20 32 24 42 28 32 38 36 34 26 44 22 34 18 38 8 28 12z',
    birch: 'M24 2c-2 0-4 1-5 3L12 18c-1 2-2 4-2 6 0 4 3 8 7 10l5 2c1 0 2 0 2 0l5-2c4-2 7-6 7-10 0-2-1-4-2-6L27 5c-1-2-3-3-5-3z M24 6c1 0 2 0 2 1l7 13c1 1 1 2 1 3 0 2-2 5-4 6l-5 2h-2l-5-2c-2-1-4-4-4-6 0-1 0-2 1-3l7-13c0-1 1-1 2-1z'
  };

  return (
    <div className={`floating-leaves-container ${className}`} aria-hidden="true">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`floating-leaf parallax-leaf-${leaf.parallaxSpeed}`}
          data-parallax={leaf.parallaxSpeed === 'slow' ? '0.3' : leaf.parallaxSpeed === 'medium' ? '0.5' : '0.7'}
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        >
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={leafPaths[leaf.variant]} />
          </svg>
        </div>
      ))}
      <style>{`
        .floating-leaves-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .floating-leaf {
          position: absolute;
          top: -100px;
          color: var(--color-primary-400, #4ade80);
          opacity: 0.3;
          animation: float-down linear infinite;
          will-change: transform;
        }

        .floating-leaf svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        @keyframes float-down {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-leaf {
            animation: none;
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
