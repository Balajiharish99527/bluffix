"use client";

import React from "react";

export const CivilianIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
    <defs>
      <linearGradient id="civGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#civGrad)" fillOpacity="0.1" stroke="url(#civGrad)" strokeWidth="2" strokeDasharray="10 5" />
    <path d="M100 50 L130 80 L130 130 L100 160 L70 130 L70 80 Z" fill="url(#civGrad)" fillOpacity="0.2" stroke="url(#civGrad)" strokeWidth="4" />
    <circle cx="100" cy="95" r="15" fill="white" />
    <path d="M75 140 Q100 120 125 140" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="100" cy="100" r="90" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.2">
      <animate attributeName="r" values="90;95;90" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const ImpostorIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="impGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#9f1239" />
      </linearGradient>
    </defs>
    <rect x="40" y="40" width="120" height="120" rx="20" fill="url(#impGrad)" fillOpacity="0.1" stroke="url(#impGrad)" strokeWidth="2" />
    <path d="M60 140 L100 60 L140 140 Z" fill="url(#impGrad)" fillOpacity="0.3" stroke="url(#impGrad)" strokeWidth="4" />
    <path d="M85 90 L115 90" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <path d="M70 150 L130 150" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
    {/* Glitch circles */}
    <circle cx="50" cy="50" r="5" fill="#f43f5e">
      <animate attributeName="opacity" values="0;1;0" dur="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="150" cy="150" r="8" fill="#f43f5e">
      <animate attributeName="opacity" values="1;0;1" dur="0.3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const LiarIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="liarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="70" fill="url(#liarGrad)" fillOpacity="0.1" stroke="url(#liarGrad)" strokeWidth="2" />
    <path d="M70 80 Q100 140 130 80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <circle cx="80" cy="70" r="5" fill="white" />
    <circle cx="120" cy="70" r="5" fill="white" />
    <path d="M100 130 L100 170" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" />
  </svg>
);
