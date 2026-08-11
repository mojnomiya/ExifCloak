// Shared SVG diagrams for blog cards and detail pages

export function DiagramStrip() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <rect x="60" y="10" width="60" height="80" rx="4" stroke="var(--border)" strokeWidth="1.2" fill="var(--bg)" />
      <path d="M90 10V24h14" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="70" y="34" width="40" height="2.5" rx="1" fill="var(--text-tertiary)" opacity="0.5" />
      <rect x="70" y="42" width="30" height="2.5" rx="1" fill="var(--warning)" opacity="0.7" />
      <rect x="70" y="50" width="35" height="2.5" rx="1" fill="var(--text-tertiary)" opacity="0.5" />
      <rect x="70" y="58" width="38" height="2.5" rx="1" fill="var(--danger)" opacity="0.7" />
      <rect x="70" y="66" width="28" height="2.5" rx="1" fill="var(--warning)" opacity="0.7" />
      <rect x="70" y="74" width="33" height="2.5" rx="1" fill="var(--text-tertiary)" opacity="0.5" />
      <line x1="68" y1="43" x2="102" y2="43" stroke="var(--danger)" strokeWidth="1" opacity="0.8" />
      <line x1="68" y1="59" x2="110" y2="59" stroke="var(--danger)" strokeWidth="1" opacity="0.8" />
      <line x1="68" y1="67" x2="100" y2="67" stroke="var(--danger)" strokeWidth="1" opacity="0.8" />
      <path d="M118 44 L140 36" stroke="var(--danger)" strokeWidth="0.8" opacity="0.5" />
      <path d="M118 60 L145 58" stroke="var(--danger)" strokeWidth="0.8" opacity="0.5" />
      <rect x="134" y="30" width="30" height="10" rx="3" fill="var(--danger)" opacity="0.1" />
      <text x="139" y="37" fontSize="6" fill="var(--danger)" opacity="0.7">removed</text>
    </svg>
  );
}

export function DiagramC2PA() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <path d="M90 28L50 45l40 17 40-17-40-17z" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.2" />
      <path d="M50 55l40 17 40-17" stroke="var(--border)" strokeWidth="1.2" fill="none" />
      <path d="M50 65l40 17 40-17" stroke="var(--warning)" strokeWidth="1.2" fill="none" opacity="0.7" />
      <rect x="105" y="15" width="32" height="14" rx="3" fill="var(--warning)" opacity="0.15" stroke="var(--warning)" strokeWidth="0.8" />
      <text x="111" y="24" fontSize="7" fill="var(--warning)" fontWeight="600">AI</text>
      <rect x="38" y="70" width="16" height="12" rx="2" fill="var(--bg)" stroke="var(--text-tertiary)" strokeWidth="1" />
      <path d="M42 70v-4a4 4 0 018 0v4" stroke="var(--text-tertiary)" strokeWidth="1" fill="none" />
      <text x="60" y="80" fontSize="6" fill="var(--text-tertiary)">signed manifest</text>
    </svg>
  );
}

export function DiagramGPS() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <line x1="30" y1="20" x2="30" y2="90" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="60" y1="20" x2="60" y2="90" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="90" y1="20" x2="90" y2="90" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="120" y1="20" x2="120" y2="90" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="150" y1="20" x2="150" y2="90" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="20" y1="35" x2="160" y2="35" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="20" y1="55" x2="160" y2="55" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <line x1="20" y1="75" x2="160" y2="75" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
      <path d="M90 30c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z" fill="var(--danger)" opacity="0.2" stroke="var(--danger)" strokeWidth="1.2" />
      <circle cx="90" cy="44" r="4" fill="var(--danger)" opacity="0.5" />
      <line x1="70" y1="24" x2="110" y2="72" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <text x="115" y="88" fontSize="7" fill="var(--text-tertiary)" opacity="0.5">23.81°N 90.41°E</text>
    </svg>
  );
}

export function DiagramGUI() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <rect x="20" y="25" width="60" height="45" rx="4" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="28" cy="31" r="2" fill="var(--danger)" opacity="0.5" />
      <circle cx="34" cy="31" r="2" fill="var(--warning)" opacity="0.5" />
      <circle cx="40" cy="31" r="2" fill="var(--success)" opacity="0.5" />
      <text x="26" y="48" fontSize="5" fontFamily="monospace" fill="var(--text-tertiary)">$ exiftool</text>
      <text x="26" y="56" fontSize="5" fontFamily="monospace" fill="var(--text-tertiary)">  -all= *.jpg</text>
      <line x1="20" y1="25" x2="80" y2="70" stroke="var(--danger)" strokeWidth="1.5" opacity="0.4" />
      <path d="M88 50 L98 50" stroke="var(--text-tertiary)" strokeWidth="1" />
      <path d="M95 47 L100 50 L95 53" stroke="var(--text-tertiary)" strokeWidth="1" fill="none" />
      <rect x="105" y="25" width="60" height="45" rx="4" fill="var(--bg)" stroke="var(--text-tertiary)" strokeWidth="1.2" />
      <circle cx="113" cy="31" r="2" fill="var(--danger)" opacity="0.7" />
      <circle cx="119" cy="31" r="2" fill="var(--warning)" opacity="0.7" />
      <circle cx="125" cy="31" r="2" fill="var(--success)" opacity="0.7" />
      <rect x="110" y="38" width="20" height="28" rx="2" fill="var(--bg-hover)" />
      <rect x="134" y="38" width="26" height="4" rx="1" fill="var(--text-tertiary)" opacity="0.3" />
      <rect x="134" y="46" width="20" height="3" rx="1" fill="var(--text-tertiary)" opacity="0.2" />
      <rect x="134" y="52" width="22" height="3" rx="1" fill="var(--text-tertiary)" opacity="0.2" />
      <rect x="134" y="58" width="18" height="3" rx="1" fill="var(--text-tertiary)" opacity="0.2" />
      <circle cx="135" cy="80" r="8" fill="var(--success)" opacity="0.15" />
      <path d="M131 80l3 3 5-6" stroke="var(--success)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function DiagramEXIF() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <rect x="65" y="8" width="50" height="68" rx="3" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.2" />
      <path d="M90 8V18h10" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="70" y="26" width="40" height="8" rx="2" fill="var(--bg-hover)" />
      <text x="73" y="32" fontSize="5" fill="var(--text-tertiary)">EXIF</text>
      <rect x="70" y="38" width="40" height="8" rx="2" fill="var(--bg-hover)" />
      <text x="73" y="44" fontSize="5" fill="var(--text-tertiary)">GPS</text>
      <rect x="70" y="50" width="40" height="8" rx="2" fill="var(--bg-hover)" />
      <text x="73" y="56" fontSize="5" fill="var(--text-tertiary)">IPTC</text>
      <rect x="70" y="62" width="40" height="8" rx="2" fill="var(--bg-hover)" />
      <text x="73" y="68" fontSize="5" fill="var(--text-tertiary)">XMP</text>
      <line x1="115" y1="30" x2="130" y2="30" stroke="var(--text-tertiary)" strokeWidth="0.6" />
      <text x="132" y="32" fontSize="5.5" fill="var(--text-secondary)">camera, lens, ISO</text>
      <line x1="115" y1="42" x2="130" y2="42" stroke="var(--text-tertiary)" strokeWidth="0.6" />
      <text x="132" y="44" fontSize="5.5" fill="var(--text-secondary)">lat, long, altitude</text>
      <line x1="115" y1="54" x2="130" y2="54" stroke="var(--text-tertiary)" strokeWidth="0.6" />
      <text x="132" y="56" fontSize="5.5" fill="var(--text-secondary)">caption, keywords</text>
      <line x1="115" y1="66" x2="130" y2="66" stroke="var(--text-tertiary)" strokeWidth="0.6" />
      <text x="132" y="68" fontSize="5.5" fill="var(--text-secondary)">software, history</text>
      <rect x="65" y="82" width="50" height="18" rx="3" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="0.8" />
      <text x="75" y="93" fontSize="6" fill="var(--text-tertiary)">pixel data</text>
    </svg>
  );
}

export function DiagramBatch() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <rect x="38" y="18" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--border)" strokeWidth="0.8" opacity="0.5" />
      <rect x="44" y="14" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--border)" strokeWidth="0.8" opacity="0.7" />
      <rect x="50" y="10" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
      <rect x="55" y="20" width="22" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="55" y="26" width="18" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="55" y="32" width="20" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.4" />
      <rect x="55" y="38" width="16" height="2" rx="1" fill="var(--text-tertiary)" opacity="0.4" />
      <path d="M92 34 L108 34" stroke="var(--text-tertiary)" strokeWidth="1.2" />
      <path d="M105 30 L110 34 L105 38" stroke="var(--text-tertiary)" strokeWidth="1.2" fill="none" />
      <rect x="115" y="18" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--success)" strokeWidth="0.8" opacity="0.5" />
      <rect x="121" y="14" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--success)" strokeWidth="0.8" opacity="0.7" />
      <rect x="127" y="10" width="34" height="42" rx="3" fill="var(--bg)" stroke="var(--success)" strokeWidth="1" />
      <path d="M139 26l4 4 7-8" stroke="var(--success)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="40" y="72" width="100" height="8" rx="4" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="0.8" />
      <rect x="40" y="72" width="73" height="8" rx="4" fill="var(--success)" opacity="0.3" />
      <text x="60" y="92" fontSize="6" fill="var(--text-tertiary)">146 / 200 processed</text>
    </svg>
  );
}

