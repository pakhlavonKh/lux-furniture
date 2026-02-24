// CategoryIcons.tsx
import React from "react";

type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const StorageIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="miter"
    className={className}
  >
    <rect x="18" y="10" width="60" height="48" />

    <line x1="42" y1="10" x2="42" y2="58" />
    <line x1="60" y1="10" x2="60" y2="58" />

    <line x1="34" y1="30" x2="34" y2="36" />
    <line x1="38" y1="30" x2="38" y2="36" />

    <line x1="60" y1="20" x2="78" y2="20" />

    <line x1="62" y1="24" x2="76" y2="24" />

    <path d="M66 24 Q66 28 70 28 Q74 28 74 24" />

    <rect x="60" y="42" width="18" height="8" />
    <rect x="60" y="50" width="18" height="8" />

    <line x1="68" y1="46" x2="70" y2="46" />
    <line x1="68" y1="54" x2="70" y2="54" />

    <line x1="22" y1="58" x2="22" y2="62" />
    <line x1="74" y1="58" x2="74" y2="62" />

    <line x1="12" y1="64" x2="84" y2="64" />
  </svg>
);


export const KitchenIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="miter"
    className={className}
  >
    <rect x="16" y="8" width="64" height="16" />
    <line x1="32" y1="8" x2="32" y2="24" />
    <line x1="64" y1="8" x2="64" y2="24" />

    <line x1="26" y1="16" x2="26" y2="20" />
    <line x1="58" y1="16" x2="58" y2="20" />

    <line x1="48" y1="24" x2="48" y2="30" />

    <path d="M36 30 L60 30 L54 38 L42 38 Z" />

    <rect x="12" y="40" width="72" height="18" />

    <path d="M22 36 Q22 32 26 32 Q30 32 30 36" />
    <line x1="12" y1="40" x2="40" y2="40" />
    <line x1="28" y1="40" x2="28" y2="58" />

    <line x1="22" y1="46" x2="22" y2="50" />
    <line x1="30" y1="46" x2="30" y2="50" />

    <rect x="42" y="42" width="16" height="14" />
    <rect x="46" y="46" width="8" height="6" />

    <circle cx="44" cy="38" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="48" cy="38" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="52" cy="38" r="1.2" fill="currentColor" stroke="none" />

    <line x1="62" y1="44" x2="74" y2="44" />
    <line x1="62" y1="50" x2="74" y2="50" />
    <line x1="62" y1="56" x2="74" y2="56" />

    <line x1="18" y1="58" x2="18" y2="62" />
    <line x1="78" y1="58" x2="78" y2="62" />

    <line x1="8" y1="64" x2="88" y2="64" />
  </svg>
);


export const GardenIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M24 30 L48 14 L72 30 Z" />
    <line x1="48" y1="14" x2="48" y2="40" />

    <ellipse cx="48" cy="42" rx="14" ry="4" />
    <line x1="48" y1="46" x2="48" y2="56" />
    <ellipse cx="48" cy="58" rx="6" ry="2" />

    <rect x="28" y="40" width="8" height="6" rx="1" />
    <line x1="28" y1="46" x2="26" y2="56" />
    <line x1="36" y1="46" x2="38" y2="56" />

    <rect x="60" y="40" width="8" height="6" rx="1" />
    <line x1="60" y1="46" x2="58" y2="56" />
    <line x1="68" y1="46" x2="70" y2="56" />

    <line x1="18" y1="60" x2="78" y2="60" />
  </svg>
);



export const OfficeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="miter"
    className={className}
  >
    <rect x="28" y="10" width="40" height="20" />

    <rect x="34" y="14" width="6" height="4" />
    <line x1="46" y1="14" x2="46" y2="26" />
    <line x1="52" y1="14" x2="52" y2="26" />
    <circle cx="60" cy="16" r="2" />
    <rect x="58" y="20" width="4" height="6" />

    <rect x="14" y="38" width="68" height="4" />

    <line x1="20" y1="42" x2="20" y2="58" />

    <rect x="62" y="42" width="18" height="16" />
    <line x1="62" y1="47" x2="80" y2="47" />
    <line x1="62" y1="52" x2="80" y2="52" />

    <rect x="18" y="28" width="18" height="10" />
    <line x1="27" y1="38" x2="27" y2="42" />
    <line x1="22" y1="42" x2="32" y2="42" />

    <rect x="44" y="36" width="8" height="10" />
    <rect x="42" y="46" width="12" height="4" />
    <line x1="48" y1="50" x2="48" y2="56" />
    <ellipse cx="48" cy="58" rx="6" ry="2" />

    <line x1="10" y1="64" x2="86" y2="64" />
  </svg>
);



export const ChildrenIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="20" y="40" width="52" height="8" />

    <rect x="20" y="28" width="10" height="20" />

    <rect x="62" y="32" width="10" height="16" />

    <ellipse cx="36" cy="34" rx="6" ry="3" />

    <rect x="74" y="36" width="10" height="12" />

    <line x1="14" y1="58" x2="86" y2="58" />
  </svg>
);



export const IndustrialIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="20" y="14" width="56" height="22" />

    <rect x="32" y="20" width="20" height="8" />

    <line x1="62" y1="18" x2="62" y2="30" />
    <circle cx="62" cy="16" r="2" />

    <line x1="70" y1="18" x2="70" y2="30" />
    <line x1="68" y1="16" x2="72" y2="16" />

    <rect x="16" y="36" width="64" height="6" />

    <rect x="20" y="42" width="14" height="12" />
    <line x1="20" y1="48" x2="34" y2="48" />

    <rect x="62" y="42" width="14" height="12" />
    <line x1="62" y1="48" x2="76" y2="48" />

    <line x1="20" y1="54" x2="20" y2="60" />
    <line x1="76" y1="54" x2="76" y2="60" />

    <line x1="10" y1="64" x2="86" y2="64" />
  </svg>
);



export const AccessoriesIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 96 72"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="22" y="38" width="52" height="6" />
    <line x1="28" y1="38" x2="28" y2="48" />
    <line x1="68" y1="38" x2="68" y2="48" />

    <path d="M38 18 L58 18 L54 28 L42 28 Z" />

    <line x1="48" y1="28" x2="48" y2="36" />

    <ellipse cx="48" cy="38" rx="6" ry="2.5" />

    <circle cx="64" cy="32" r="3" />

    <line x1="14" y1="56" x2="82" y2="56" />
  </svg>
);