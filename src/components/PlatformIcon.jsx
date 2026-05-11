import { siReddit } from 'simple-icons'

export default function PlatformIcon({ platform, size = 32 }) {
  const s = size
  switch (platform) {
    case 'Google':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#fff" />
          <path d="M27.2 16.27c0-.79-.07-1.55-.2-2.27H16v4.3h6.27a5.36 5.36 0 0 1-2.32 3.52v2.92h3.75c2.2-2.02 3.5-5 3.5-8.47Z" fill="#4285F4"/>
          <path d="M16 28c3.15 0 5.79-1.04 7.72-2.82l-3.75-2.92c-1.04.7-2.38 1.11-3.97 1.11-3.05 0-5.63-2.06-6.55-4.83H5.57v3.02A11.99 11.99 0 0 0 16 28Z" fill="#34A853"/>
          <path d="M9.45 18.54A7.23 7.23 0 0 1 9.07 16c0-.88.15-1.73.38-2.54V10.44H5.57A12 12 0 0 0 4 16c0 1.94.46 3.77 1.57 5.56l3.88-3.02Z" fill="#FBBC05"/>
          <path d="M16 8.64c1.72 0 3.26.59 4.48 1.75l3.35-3.35C21.79 5.14 19.15 4 16 4a12 12 0 0 0-10.43 6.44l3.88 3.02C10.37 10.7 12.95 8.64 16 8.64Z" fill="#EA4335"/>
        </svg>
      )
    case 'Pinterest':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#E60023"/>
          <path d="M16 5C10 5 5 10 5 16c0 4.67 2.89 8.67 7.01 10.3-.1-.87-.18-2.2.04-3.14.2-.84 1.34-5.67 1.34-5.67s-.34-.68-.34-1.69c0-1.58.92-2.77 2.06-2.77.97 0 1.44.73 1.44 1.6 0 .98-.62 2.44-.94 3.8-.27 1.14.56 2.06 1.67 2.06 2 0 3.55-2.11 3.55-5.15 0-2.69-1.94-4.58-4.7-4.58-3.2 0-5.08 2.4-5.08 4.88 0 .97.37 2 .84 2.57a.34.34 0 0 1 .08.33c-.09.36-.28 1.14-.32 1.3-.05.21-.17.26-.38.16-1.4-.65-2.27-2.7-2.27-4.35 0-3.54 2.57-6.8 7.4-6.8 3.89 0 6.91 2.77 6.91 6.47 0 3.86-2.43 6.97-5.81 6.97-1.13 0-2.2-.59-2.57-1.28l-.7 2.6c-.25.97-.93 2.18-1.39 2.92A11 11 0 0 0 16 27c6.08 0 11-4.92 11-11 0-6.08-4.92-11-11-11Z" fill="white"/>
        </svg>
      )
    case 'X / Twitter':
    case 'X':
    case 'twitter':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0F172A"/>
          <path d="M18.24 14.87 24.07 8h-1.38l-5.07 5.88L13.26 8H8.4l6.1 8.88L8.4 24h1.38l5.33-6.19L19.44 24H24.3l-6.06-9.13Zm-1.88 2.19-.62-.88-4.92-7.03h2.11l3.97 5.67.62.88 5.15 7.36h-2.11l-4.2-5.99Z" fill="white"/>
        </svg>
      )
    case 'YouTube':
    case 'youtube':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF0000"/>
          <path d="M24.7 12.1a2.27 2.27 0 0 0-1.6-1.61C21.6 10.1 16 10.1 16 10.1s-5.6 0-7.1.4a2.27 2.27 0 0 0-1.6 1.6c-.4 1.5-.4 4.6-.4 4.6s0 3.1.4 4.6a2.27 2.27 0 0 0 1.6 1.6c1.5.4 7.1.4 7.1.4s5.6 0 7.1-.4a2.27 2.27 0 0 0 1.6-1.6c.4-1.5.4-4.6.4-4.6s0-3.1-.4-4.6Z" fill="white" fillOpacity="0.9"/>
          <path d="M14.2 18.8V13l4.7 2.9-4.7 2.9Z" fill="#FF0000"/>
        </svg>
      )
    case 'TikTok':
    case 'tiktok':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0F172A"/>
          <path d="M21 9h-2.5v9.5a2.5 2.5 0 1 1-2.5-2.5V13.5a5 5 0 1 0 5 5V13.2a6.8 6.8 0 0 0 4 1.3v-2.5A4.2 4.2 0 0 1 21 9Z" fill="white"/>
        </svg>
      )
    case 'LinkedIn':
    case 'linkedin':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0077B5"/>
          <path d="M10.5 13.5h2.5v9h-2.5v-9Zm1.25-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM15 13.5h2.4v1.2h.04c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.67 3 3.84V22.5h-2.5v-4.8c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.07V22.5H15v-9Z" fill="white"/>
        </svg>
      )
    case 'Instagram':
    case 'instagram':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#E1306C"/>
          <rect x="8.5" y="8.5" width="15" height="15" rx="4.5" stroke="white" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5"/>
          <circle cx="21" cy="11" r="1.2" fill="white"/>
        </svg>
      )
    case 'Reddit':
    case 'reddit':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF4500"/>
          <g transform="translate(7, 7) scale(0.75)">
            <path d={siReddit.path} fill="white"/>
          </g>
        </svg>
      )
    case 'Wikipedia':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="white"/>
          <circle cx="16" cy="16" r="13" stroke="#A2A9B1" strokeWidth="0.8" strokeDasharray="2.5 2"/>
          <text x="16" y="21.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="Georgia, serif" fontStyle="italic" fill="#101828">W</text>
        </svg>
      )
    case 'Facebook':
    case 'facebook':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#1877F2"/>
          <path d="M18.6 25.5v-8.6h2.9l.4-3.3h-3.3v-2.1c0-1 .3-1.6 1.6-1.6h1.7V6.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3h-2.7v3.3h2.7v8.6h3.1Z" fill="white"/>
        </svg>
      )
    case 'News':
    case 'news':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#155EEF"/>
          <rect x="8" y="9.5" width="16" height="13" rx="1.5" stroke="white" strokeWidth="1.5"/>
          <line x1="10.5" y1="13" x2="21.5" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="10.5" y1="16" x2="17" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="10.5" y1="19" x2="19" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'Web':
    case 'web':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#475467"/>
          <circle cx="16" cy="16" r="6.5" stroke="white" strokeWidth="1.5"/>
          <path d="M16 9.5c2 1.5 3 4 3 6.5s-1 5-3 6.5M16 9.5c-2 1.5-3 4-3 6.5s1 5 3 6.5M9.5 16h13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'Telegram':
    case 'telegram':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#2AABEE"/>
          <path d="M22.5 10.2 20 22.3c-.2.8-.7 1-1.4.6l-3.8-2.8-1.8 1.8c-.2.2-.4.4-.8.4l.3-3.9 7-6.3c.3-.3-.1-.4-.5-.2l-8.6 5.4-3.7-1.2c-.8-.3-.8-.8.2-1.2l14.4-5.6c.7-.2 1.3.2 1.1 1.1Z" fill="white"/>
        </svg>
      )
    default:
      return (
        <div style={{ width: s, height: s, borderRadius: '50%', background: '#475467', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: s * 0.35, fontWeight: 700 }}>
          {(platform || '?')[0]}
        </div>
      )
  }
}
