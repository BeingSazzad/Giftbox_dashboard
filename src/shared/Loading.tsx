import React from "react";

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        {/* Rotating hexagon rings */}
        <div className="hex-ring ring-1">
          <div className="hexagon"></div>
        </div>
        <div className="hex-ring ring-2">
          <div className="hexagon"></div>
        </div>
        <div className="hex-ring ring-3">
          <div className="hexagon"></div>
        </div>

        {/* Center pulse */}
        <div className="center-pulse"></div>

        {/* Orbiting particles */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      {/* @ts-ignore */}
      <style jsx>{`
        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          position: relative;
          overflow: hidden;
        }

        .loader-container::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 30% 50%,
            rgba(245, 158, 11, 0.05) 0%,
            transparent 50%
          );
          animation: bgShift 8s ease-in-out infinite;
        }

        @keyframes bgShift {
          0%,
          100% {
            transform: translate(-10%, -10%) scale(1);
          }
          50% {
            transform: translate(10%, 10%) scale(1.1);
          }
        }

        .loader-content {
          position: relative;
          width: 200px;
          height: 200px;
        }

        /* Hexagon Rings */
        .hex-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .hexagon {
          width: 80px;
          height: 46px;
          background: transparent;
          border-left: 2px solid #f59e0b;
          border-right: 2px solid #f59e0b;
          position: relative;
        }

        .hexagon::before,
        .hexagon::after {
          content: "";
          position: absolute;
          width: 0;
          border-left: 40px solid transparent;
          border-right: 40px solid transparent;
        }

        .hexagon::before {
          bottom: 100%;
          border-bottom: 23px solid #f59e0b;
        }

        .hexagon::after {
          top: 100%;
          border-top: 23px solid #f59e0b;
        }

        .ring-1 {
          animation: rotateHex1 3s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            infinite;
        }

        .ring-1 .hexagon {
          width: 120px;
          height: 69px;
          border-left: 3px solid #f59e0b;
          border-right: 3px solid #f59e0b;
          opacity: 0.4;
          filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
        }

        .ring-1 .hexagon::before,
        .ring-1 .hexagon::after {
          border-left: 60px solid transparent;
          border-right: 60px solid transparent;
        }

        .ring-1 .hexagon::before {
          border-bottom: 34.5px solid #f59e0b;
        }

        .ring-1 .hexagon::after {
          border-top: 34.5px solid #f59e0b;
        }

        .ring-2 {
          animation: rotateHex2 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            infinite;
        }

        .ring-2 .hexagon {
          width: 90px;
          height: 52px;
          border-left: 2.5px solid #fbbf24;
          border-right: 2.5px solid #fbbf24;
          opacity: 0.6;
          filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.6));
        }

        .ring-2 .hexagon::before,
        .ring-2 .hexagon::after {
          border-left: 45px solid transparent;
          border-right: 45px solid transparent;
        }

        .ring-2 .hexagon::before {
          border-bottom: 26px solid #fbbf24;
        }

        .ring-2 .hexagon::after {
          border-top: 26px solid #fbbf24;
        }

        .ring-3 {
          animation: rotateHex3 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            infinite;
        }

        .ring-3 .hexagon {
          filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.8));
          opacity: 0.9;
        }

        @keyframes rotateHex1 {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) scale(1.1);
          }
        }

        @keyframes rotateHex2 {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotate(-180deg) scale(0.95);
          }
        }

        @keyframes rotateHex3 {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotate(120deg) scale(1.05);
          }
        }

        /* Center Pulse */
        .center-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #f59e0b 0%, #fbbf24 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-in-out infinite;
          box-shadow:
            0 0 20px rgba(245, 158, 11, 0.8),
            0 0 40px rgba(245, 158, 11, 0.4),
            0 0 60px rgba(245, 158, 11, 0.2);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.7;
          }
        }

        /* Orbiting Particles */
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);
        }

        .particle-1 {
          animation: orbit1 4s linear infinite;
        }

        .particle-2 {
          animation: orbit2 4s linear infinite;
          animation-delay: -1s;
        }

        .particle-3 {
          animation: orbit3 4s linear infinite;
          animation-delay: -2s;
        }

        .particle-4 {
          animation: orbit4 4s linear infinite;
          animation-delay: -3s;
        }

        @keyframes orbit1 {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(100px)
              scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(180deg) translateX(100px)
              scale(0.5);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(100px)
              scale(1);
            opacity: 1;
          }
        }

        @keyframes orbit2 {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(80px)
              scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(180deg) translateX(80px)
              scale(0.5);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(80px)
              scale(1);
            opacity: 1;
          }
        }

        @keyframes orbit3 {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(60px)
              scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(180deg) translateX(60px)
              scale(0.5);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(60px)
              scale(1);
            opacity: 1;
          }
        }

        @keyframes orbit4 {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(40px)
              scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(180deg) translateX(40px)
              scale(0.5);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(40px)
              scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
