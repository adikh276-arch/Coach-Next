// Learn section images for all coaching areas - Using high-quality SVG data URLs for distinct, relevant visuals.
// This ensures that each article has a unique, professional icon even without a connection to an external image server.

const createIcon = (color: string, icon: string) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="40" fill="url(#g)" />
      <g transform="translate(50, 50) scale(4)" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${icon}
      </g>
    </svg>
  `)}`;
};

// Icons definitions (SVG paths)
const icons = {
  path: '<path d="M13 18l6-6-6-6M2 12h17"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  chart: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  brain: '<path d="M9.5 2A5 5 0 0112 12a5 5 0 012.5-10"/><path d="M12 12v10"/><path d="M16 6a5 5 0 011 9"/><path d="M7 6a5 5 0 00-1 9"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  message: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/> <polyline points="2 17 12 22 22 17"/> <polyline points="2 12 12 17 22 12"/>',
  paint: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l5 5"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="22"/><line x1="15" y1="22" x2="15" y2="22"/><line x1="9" y1="18" x2="9" y2="18"/><line x1="15" y1="18" x2="15" y2="18"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
};

export const learnImages: Record<string, string[]> = {
  career: [
    createIcon("#3B82F6", icons.path),
    createIcon("#2563EB", icons.user),
    createIcon("#1D4ED8", icons.message),
    createIcon("#1E40AF", icons.zap),
  ],
  executive: [
    createIcon("#4F46E5", icons.briefcase),
    createIcon("#4338CA", icons.target),
    createIcon("#3730A3", icons.shield),
    createIcon("#312E81", icons.zap),
  ],
  wellness: [
    createIcon("#EC4899", icons.heart),
    createIcon("#DB2777", icons.sun),
    createIcon("#BE185D", icons.layers),
    createIcon("#9D174D", icons.zap),
  ],
  leadership: [
    createIcon("#10B981", icons.shield),
    createIcon("#059669", icons.user),
    createIcon("#047857", icons.message),
    createIcon("#065F46", icons.zap),
  ],
  finance: [
    createIcon("#F59E0B", icons.dollar),
    createIcon("#D97706", icons.chart),
    createIcon("#B45309", icons.layers),
    createIcon("#92400E", icons.zap),
  ],
  performance: [
    createIcon("#F97316", icons.target),
    createIcon("#EA580C", icons.zap),
    createIcon("#C2410C", icons.chart),
    createIcon("#9A3412", icons.path),
  ],
  mindset: [
    createIcon("#8B5CF6", icons.brain),
    createIcon("#7C3AED", icons.sun),
    createIcon("#6D28D9", icons.star),
    createIcon("#5B21B6", icons.zap),
  ],
  spiritual: [
    createIcon("#FBBF24", icons.sun),
    createIcon("#F59E0B", icons.heart),
    createIcon("#D97706", icons.star),
    createIcon("#B45309", icons.path),
  ],
  "mental-health": [
    createIcon("#F472B6", icons.brain),
    createIcon("#EC4899", icons.heart),
    createIcon("#DB2777", icons.sun),
    createIcon("#BE185D", icons.zap),
  ],
  transform: [
    createIcon("#A855F7", icons.zap),
    createIcon("#9333EA", icons.path),
    createIcon("#7E22CE", icons.star),
    createIcon("#6B21A8", icons.layers),
  ],
  communicate: [
    createIcon("#60A5FA", icons.message),
    createIcon("#3B82F6", icons.user),
    createIcon("#2563EB", icons.zap),
    createIcon("#1D4ED8", icons.layers),
  ],
  organization: [
    createIcon("#64748B", icons.layers),
    createIcon("#475569", icons.building),
    createIcon("#334155", icons.target),
    createIcon("#1E293B", icons.zap),
  ],
  creativity: [
    createIcon("#F43F5E", icons.paint),
    createIcon("#10B981", icons.sun),
    createIcon("#3B82F6", icons.star),
    createIcon("#F59E0B", icons.zap),
  ],
  employee: [
    createIcon("#0EA5E9", icons.user),
    createIcon("#0284C7", icons.briefcase),
    createIcon("#0369A1", icons.message),
    createIcon("#075985", icons.zap),
  ],
  corporate: [
    createIcon("#1E293B", icons.building),
    createIcon("#0F172A", icons.shield),
    createIcon("#334155", icons.target),
    createIcon("#475569", icons.zap),
  ],
  confidence: [
    createIcon("#fbbf24", icons.star),
    createIcon("#f59e0b", icons.sun),
    createIcon("#d97706", icons.shield),
    createIcon("#b45309", icons.zap),
  ],
};
