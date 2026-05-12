export default function SurfboardIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 32"
      className={className}
      style={{ width: '8px', height: '20px' }}
    >
      <path
        d="M6 0C3.5 0 1.5 4 1 8C0.3 13 0 18 0.5 23C1 27 2.5 30 4 31.5C5 32.3 5.5 32 6 32C6.5 32 7 32.3 8 31.5C9.5 30 11 27 11.5 23C12 18 11.7 13 11 8C10.5 4 8.5 0 6 0Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
