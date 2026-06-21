import type {
  LucideIcon,
} from 'lucide-react';

interface ActionIconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  title?: string;
  variant?: 'default' | 'danger' | 'success';
}

export function ActionIconButton({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
}: ActionIconButtonProps) {
  const variants = {
    default:
      'hover:bg-slate-100 hover:text-blue-600',
    danger:
      'hover:bg-red-50 hover:text-red-600',
    success:
      'hover:bg-emerald-50 hover:text-emerald-600',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1.5 rounded-lg
        text-slate-500
        transition-colors
        ${variants[variant]}
      `}
    >
      <Icon className="size-4" />
    </button>
  );
}