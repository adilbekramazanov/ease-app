// Логотип ease — официальные ассеты бренда (PNG, прозрачный фон).
// Вариант подбираем под фон: *-dark для светлых поверхностей, *-cream для тёмных.
// В single-file сборке импортированные картинки инлайнятся как base64.
import horizontalDark from '../assets/brand/ease-horizontal-dark.png';
import horizontalCream from '../assets/brand/ease-horizontal-cream.png';
import stackedDark from '../assets/brand/ease-stacked-dark.png';

const SRC = {
  'horizontal-dark': horizontalDark,
  'horizontal-cream': horizontalCream,
  'stacked-dark': stackedDark,
};

// height — высота в px; ширина авто (пропорции ассета сохраняются).
export default function Logo({ variant = 'horizontal-dark', height = 28, className = '' }) {
  return (
    <img
      className={`logo-img ${className}`}
      src={SRC[variant] || horizontalDark}
      alt="ease"
      style={{ height, width: 'auto', display: 'block' }}
      draggable="false"
    />
  );
}
