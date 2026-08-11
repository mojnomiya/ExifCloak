// Playful SVG illustrations used throughout the site

export function MetadataStrip() {
  // Animated diagram showing metadata fields being removed from a file
  return (
    <svg width="420" height="280" viewBox="0 0 280 180" fill="none" className="mx-auto">
      {/* File shape */}
      <rect x="90" y="20" width="100" height="130" rx="6" stroke="var(--border)" strokeWidth="1.5" fill="var(--bg-raised)" />
      <path d="M150 20V44h24" stroke="var(--border)" strokeWidth="1.5" fill="none" />

      {/* Metadata lines (some animating away) */}
      <rect x="105" y="55" width="50" height="3" rx="1.5" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="105" y="65" width="35" height="3" rx="1.5" fill="var(--warning)" className="fade-up" style={{ animationDelay: "0.2s" }} />
      <rect x="105" y="75" width="60" height="3" rx="1.5" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="105" y="85" width="40" height="3" rx="1.5" fill="var(--warning)" className="fade-up" style={{ animationDelay: "0.5s" }} />
      <rect x="105" y="95" width="55" height="3" rx="1.5" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="105" y="105" width="45" height="3" rx="1.5" fill="var(--danger)" className="fade-up" style={{ animationDelay: "0.8s" }} />
      <rect x="105" y="115" width="30" height="3" rx="1.5" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="105" y="125" width="50" height="3" rx="1.5" fill="var(--text-tertiary)" opacity="0.4" />

      {/* Floating stripped items going away */}
      <g className="float" style={{ animationDelay: "0s" }}>
        <rect x="20" y="60" width="40" height="10" rx="3" fill="var(--warning)" opacity="0.2" />
        <text x="25" y="68" fontSize="6" fill="var(--warning)" opacity="0.6">GPS</text>
      </g>
      <g className="float" style={{ animationDelay: "1s" }}>
        <rect x="220" y="80" width="44" height="10" rx="3" fill="var(--danger)" opacity="0.2" />
        <text x="225" y="88" fontSize="6" fill="var(--danger)" opacity="0.6">C2PA</text>
      </g>
      <g className="float" style={{ animationDelay: "2s" }}>
        <rect x="15" y="110" width="52" height="10" rx="3" fill="var(--warning)" opacity="0.2" />
        <text x="20" y="118" fontSize="6" fill="var(--warning)" opacity="0.6">DALL·E</text>
      </g>

      {/* Arrows pointing outward */}
      <path d="M90 68 L65 65" stroke="var(--warning)" strokeWidth="0.8" opacity="0.4" className="draw-line" />
      <path d="M190 85 L218 83" stroke="var(--danger)" strokeWidth="0.8" opacity="0.4" className="draw-line" style={{ animationDelay: "0.5s" }} />
      <path d="M90 113 L70 115" stroke="var(--warning)" strokeWidth="0.8" opacity="0.4" className="draw-line" style={{ animationDelay: "1s" }} />
    </svg>
  );
}

export function ShieldCheck() {
  // Animated shield with checkmark — represents "clean" state
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="float">
      <path
        d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
        fill="var(--bg-raised)"
        stroke="var(--success)"
        strokeWidth="1.5"
      />
      <path
        d="M16 24l5.5 5.5L33 18"
        stroke="var(--success)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
    </svg>
  );
}

export function OfflineGlobe() {
  // Globe with a slash through the wifi — represents offline processing
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="float" style={{ animationDelay: "1.5s" }}>
      <circle cx="20" cy="20" r="14" stroke="var(--text-tertiary)" strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="20" cy="20" rx="6" ry="14" stroke="var(--text-tertiary)" strokeWidth="1.2" opacity="0.5" />
      <line x1="6" y1="20" x2="34" y2="20" stroke="var(--text-tertiary)" strokeWidth="1.2" opacity="0.5" />
      {/* Slash */}
      <line x1="8" y1="8" x2="32" y2="32" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function SpinnerCog() {
  // Slowly spinning gear — represents processing
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="spin-slow" style={{ opacity: 0.3 }}>
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
        stroke="var(--text-tertiary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="var(--text-tertiary)" strokeWidth="1.5" />
    </svg>
  );
}
