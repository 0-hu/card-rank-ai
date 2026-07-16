import React from "react";

interface CardLogoProps {
  className?: string;
}

export default function CardLogo({ className = "w-6 h-6" }: CardLogoProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rear Card (Rotated -12deg) */}
      <g transform="translate(35, 50) rotate(-12) translate(-25, -35)">
        <rect
          x="0"
          y="0"
          width="50"
          height="70"
          rx="6"
          fill="currentColor"
          fillOpacity="0.03"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2.5"
        />
      </g>
      {/* Middle Card (Rotated -4deg) */}
      <g transform="translate(52, 50) rotate(-4) translate(-25, -35)">
        <rect
          x="0"
          y="0"
          width="50"
          height="70"
          rx="6"
          fill="currentColor"
          fillOpacity="0.03"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2.5"
        />
      </g>
      {/* Front Card (Rotated 0deg) */}
      <g transform="translate(72, 50) rotate(0) translate(-25, -35)">
        <rect
          x="0"
          y="0"
          width="50"
          height="70"
          rx="6"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        {/* Inner margin border */}
        <rect
          x="4"
          y="4"
          width="42"
          height="62"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.3"
          fill="none"
        />
        {/* Diamond / Rhombus pattern in the center */}
        <path
          d="M 25 18 L 38 35 L 25 52 L 12 35 Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
