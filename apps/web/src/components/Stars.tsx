import { useId } from 'react';

interface StarsProps {
  rating: number;
  size?: number;
  color?: string;
}

/** Inline-SVG star rating with fractional fill. No emoji, crisp at any size. */
export default function Stars({ rating, size = 14, color = '#1A1714' }: StarsProps) {
  const uid = useId();
  return (
    <span className="inline-flex" style={{ gap: Math.round(size * 0.14) }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const gradId = `star-${uid}-${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={gradId}>
                <stop offset={`${fill * 100}%`} stopColor={color} />
                <stop offset={`${fill * 100}%`} stopColor={color} stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.3l2.7 5.9 6.5.6-4.9 4.3 1.5 6.4L12 16.9 6.2 20.1l1.5-6.4L2.8 8.8l6.5-.6z"
              fill={`url(#${gradId})`}
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          </svg>
        );
      })}
    </span>
  );
}
