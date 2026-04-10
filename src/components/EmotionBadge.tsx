import type { Emotion } from '../types';

const EMOTION_COLORS: Record<string, { bg: string; text: string }> = {
  awe:           { bg: '#EEEDFE', text: '#3C3489' },
  joy:           { bg: '#FAEEDA', text: '#633806' },
  solitude:      { bg: '#E6F1FB', text: '#0C447C' },
  wonder:        { bg: '#E1F5EE', text: '#085041' },
  nostalgia:     { bg: '#FAECE7', text: '#712B13' },
  excitement:    { bg: '#FBEAF0', text: '#4B1528' },
  peace:         { bg: '#EAF3DE', text: '#27500A' },
  melancholy:    { bg: '#F1EFE8', text: '#2C2C2A' },
  realisation:   { bg: '#E1F5EE', text: '#0F6E56' },
  learning:      { bg: '#E6F1FB', text: '#185FA5' },
  retrospection: { bg: '#EEEDFE', text: '#534AB7' },
  enlightenment: { bg: '#FAEEDA', text: '#854F0B' },
  experience:    { bg: '#EAF3DE', text: '#3B6D11' },
} as const;

interface EmotionBadgeProps {
  emotion: Emotion;
}

export default function EmotionBadge({ emotion }: EmotionBadgeProps) {
  const colors = EMOTION_COLORS[emotion.emotion] ?? { bg: '#F1F0EC', text: '#666660' };
  const intensity = Math.round(emotion.intensity * 100);

  return (
    <span
      title={`${emotion.emotion} · ${emotion.secondary} · ${intensity}% intensity`}
      style={{
        fontFamily: 'var(--sans)',
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 9px',
        borderRadius: 100,
        background: colors.bg,
        color: colors.text,
        letterSpacing: '0.04em',
        display: 'inline-block',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {emotion.one_word}
    </span>
  );
}
