'use client'

/**
 * Aquarium Animated Background Component
 * Uses semantic Tailwind classes for theming
 */

export function AquariumBackground() {
  return (
    <>
      {/* Aquarium animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background">
        {/* Background image with blur overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyUqRTFl-E2nhNYtmq2dTNIyX6yjVRnp_s-5_SAEB-ujsRd7u1PcOlOmq1ZayEj0Qo4ucQXkjESIFsBaOs9YEwSqStlzvc1eFke-eUjosv42sjB-UgS62rO0kMtYFlqqjvT7s291TPhb4sq77XYq1INhZ7P3pUzFTxQibeDl6W3ew2Cd-Z2Jalf7J6M7lL1dEHW8quC3wcZM16irwkCOma-bN5hrlSoivr_z7fxhjthp-CRCQpotbC9qoa3VOun5eEbL9Dwyae_Mw")',
            filter: 'blur(4px)',
          }}
        />

        {/* Water effect overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 to-transparent animate-pulse" />

        {/* Bubbles */}
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />

        {/* Coral decorations */}
        <div className="coral coral-1">🪸</div>
        <div className="coral coral-2">🪸</div>
        <div className="coral coral-3">🪸</div>

        {/* Animated fish */}
        <div className="fish fish-1">🐠</div>
        <div className="fish fish-2">🐟</div>
        <div className="fish fish-3">🐡</div>
        <div className="fish fish-4">🐠</div>
        <div className="fish fish-5">🐟</div>

        {/* Light rays */}
        <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-primary/10 to-transparent blur-xl animate-sway" />
        <div className="absolute top-0 right-1/3 w-40 h-full bg-gradient-to-b from-primary/10 to-transparent blur-xl animate-sway-slow" />
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        @keyframes swim {
          0%, 100% {
            transform: translateX(-100%) translateY(0);
          }
          50% {
            transform: translateX(100vw) translateY(-20px);
          }
        }

        @keyframes swim-reverse {
          0%, 100% {
            transform: translateX(100vw) translateY(0) scaleX(-1);
          }
          50% {
            transform: translateX(-100%) translateY(20px) scaleX(-1);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(20px) rotate(2deg);
          }
        }

        @keyframes sway-slow {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(-20px) rotate(-2deg);
          }
        }

        .bubble {
          position: absolute;
          bottom: -20px;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), oklch(0.8 0.15 195 / 0.2));
          border-radius: 50%;
          animation: float-up linear infinite;
        }

        .bubble-1 {
          left: 10%;
          animation-duration: 8s;
          animation-delay: 0s;
        }

        .bubble-2 {
          left: 30%;
          width: 15px;
          height: 15px;
          animation-duration: 10s;
          animation-delay: 2s;
        }

        .bubble-3 {
          left: 50%;
          width: 8px;
          height: 8px;
          animation-duration: 6s;
          animation-delay: 4s;
        }

        .bubble-4 {
          left: 70%;
          width: 12px;
          height: 12px;
          animation-duration: 9s;
          animation-delay: 1s;
        }

        .bubble-5 {
          left: 85%;
          width: 10px;
          height: 10px;
          animation-duration: 7s;
          animation-delay: 3s;
        }

        .fish {
          position: absolute;
          font-size: 2rem;
          filter: drop-shadow(0 0 8px oklch(0.8 0.15 195 / 0.3));
        }

        .fish-1 {
          top: 15%;
          animation: swim 25s linear infinite;
        }

        .fish-2 {
          top: 40%;
          animation: swim-reverse 30s linear infinite;
          animation-delay: 2s;
        }

        .fish-3 {
          top: 60%;
          animation: swim 28s linear infinite;
          animation-delay: 5s;
        }

        .fish-4 {
          top: 80%;
          animation: swim-reverse 32s linear infinite;
          animation-delay: 8s;
        }

        .fish-5 {
          top: 25%;
          font-size: 1.5rem;
          animation: swim 22s linear infinite;
          animation-delay: 10s;
        }

        .coral {
          position: absolute;
          font-size: 4rem;
          filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          animation: sway 4s ease-in-out infinite;
        }

        .coral-1 {
          bottom: 5%;
          left: 10%;
        }

        .coral-2 {
          bottom: 3%;
          right: 15%;
          font-size: 5rem;
          animation: sway-slow 5s ease-in-out infinite;
        }

        .coral-3 {
          bottom: 8%;
          left: 45%;
          font-size: 3.5rem;
          animation: sway 6s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </>
  )
}
