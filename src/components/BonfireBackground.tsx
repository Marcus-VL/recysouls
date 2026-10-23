import React from "react";

export function BonfireBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* High-quality vector illustration representing the RecySouls Eco-Bonfire */}
      <svg 
        className="absolute bottom-[-10px] right-[-20px] md:bottom-2 md:right-4 w-[280px] h-[340px] md:w-[450px] md:h-[500px] opacity-20 md:opacity-35 transition-all duration-700"
        viewBox="0 0 500 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glowing filter */}
          <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Flame Gradients */}
          <linearGradient id="tealFlameGrad" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#042f2e" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#2dd4bf" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="swordGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="50%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Ambient glow behind the bonfire */}
        <circle 
          cx="250" 
          cy="420" 
          r="160" 
          fill="url(#tealFlameGrad)" 
          opacity="0.3" 
          filter="url(#glow-teal)" 
        />

        {/* Pile of electronic scrap ashes (The Mound of Rebirth) */}
        <path 
          d="M 50,480 Q 250,380 450,480 L 470,520 Q 250,550 30,520 Z" 
          fill="#18181b" 
          stroke="#2dd4bf" 
          strokeWidth="1.5" 
          opacity="0.55" 
        />
        
        {/* Futuristic circuit board traces in the ash mound */}
        <path 
          d="M 120,460 L 190,440 L 220,460" 
          stroke="#14b8a6" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
          opacity="0.6" 
        />
        <path 
          d="M 380,455 L 310,435 L 290,455" 
          stroke="#059669" 
          strokeWidth="1.5" 
          strokeDasharray="4 2" 
          opacity="0.5" 
        />
        <circle cx="220" cy="460" r="3" fill="#2dd4bf" />
        <circle cx="290" cy="455" r="3" fill="#34d399" />

        {/* The Coiled Sword (Espada Espiralada dos Guardiões) */}
        {/* Guard & Grip */}
        <rect x="238" y="140" width="24" height="6" rx="2" fill="url(#swordGrad)" stroke="#111" />
        <rect x="246" y="90" width="8" height="50" rx="1" fill="#27272a" stroke="#111" />
        {/* Pommel */}
        <circle cx="250" cy="85" r="6" fill="url(#swordGrad)" stroke="#111" />

        {/* Twisted, Coiled Blade */}
        {/* Custom path for the twisted blade stuck into the ground */}
        <path 
          d="M 248,146 
             C 240,180 260,200 248,240 
             C 238,280 258,300 248,340 
             C 240,380 260,400 248,450 
             L 252,450 
             C 260,400 242,380 252,340
             C 260,300 240,280 252,240
             C 262,200 242,180 252,146 Z" 
          fill="url(#swordGrad)" 
          stroke="#09090b" 
          strokeWidth="1.5" 
        />

        {/* Soft Green & Teal Cosmic Flames (Fogueira da Restauração) */}
        {/* Inner intense flame */}
        <path 
          d="M 220,470 C 200,320 280,250 250,180 C 235,260 300,340 280,470 Z" 
          fill="url(#tealFlameGrad)" 
          opacity="0.85" 
          style={{ transformOrigin: '250px 450px', animation: "pulse 3.5s infinite ease-in-out" }}
        />
        {/* Secondary soft outer flame */}
        <path 
          d="M 170,480 C 150,380 220,320 235,240 C 255,300 320,360 330,480 Z" 
          fill="url(#tealFlameGrad)" 
          opacity="0.5" 
          style={{ transformOrigin: '250px 450px', animation: "pulse 4.5s infinite ease-in-out" }}
        />
        {/* Left side spark flame */}
        <path 
          d="M 195,480 C 160,420 230,370 230,290 C 240,340 270,390 260,480 Z" 
          fill="url(#tealFlameGrad)" 
          opacity="0.6" 
          style={{ transformOrigin: '250px 450px', animation: "pulse 3s infinite ease-in-out" }}
        />

        {/* Nature Sprouts / Leaves wrapping the hilt and glowing along the blade */}
        {/* Ivy Vine with leaves wrapping the hilt */}
        <path 
          d="M 235,140 Q 242,120 252,110 T 258,95" 
          stroke="#10b981" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round" 
        />
        {/* Leaf 1 */}
        <path d="M 258,95 Q 268,91 268,85 Q 256,91 258,95 Z" fill="url(#leafGrad)" />
        {/* Leaf 2 */}
        <path d="M 242,120 Q 230,116 234,110 Q 242,116 242,120 Z" fill="url(#leafGrad)" stroke="#047857" strokeWidth="0.5" />
        
        {/* Leaves climbing the coiled blade */}
        <path d="M 244,180 Q 232,176 236,170 Q 244,176 244,180 Z" fill="url(#leafGrad)" />
        <path d="M 256,230 Q 268,225 264,218 Q 254,224 256,230 Z" fill="url(#leafGrad)" />
        <path d="M 242,280 Q 228,285 232,292 Q 242,286 242,280 Z" fill="url(#leafGrad)" />
        <path d="M 258,350 Q 272,345 270,338 Q 258,344 258,350 Z" fill="url(#leafGrad)" />
        <path d="M 243,390 Q 229,395 233,402 Q 243,396 243,390 Z" fill="url(#leafGrad)" />

        {/* Small floating green embers / leaf spores flying upwards */}
        <circle cx="210" cy="270" r="4" fill="#a7f3d0" opacity="0.8" style={{ animation: "pulse 2s infinite" }} />
        <circle cx="290" cy="240" r="3" fill="#6ee7b7" opacity="0.9" style={{ animation: "pulse 2.5s infinite" }} />
        <circle cx="260" cy="150" r="5" fill="#34d399" opacity="0.75" />
        <circle cx="180" cy="330" r="3" fill="#14b8a6" opacity="0.8" />
        <circle cx="330" cy="310" r="4.5" fill="#2dd4bf" opacity="0.65" />
        <circle cx="230" cy="110" r="3" fill="#a7f3d0" opacity="0.85" />
        <circle cx="280" cy="120" r="2.5" fill="#6ee7b7" opacity="0.7" />

        <circle cx="250" cy="70" r="2" fill="#34d399" opacity="0.5" />
        <circle cx="270" cy="50" r="3.5" fill="#2dd4bf" opacity="0.6" />
        <circle cx="220" cy="40" r="2" fill="#a7f3d0" opacity="0.7" />
      </svg>
    </div>
  );
}
