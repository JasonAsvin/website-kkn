import React from 'react';

interface AccordionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  subtitle?: string;
  color?: 'emerald' | 'yellow' | 'red' | 'indigo' | 'violet';
  children: React.ReactNode;
}

const colorMap: Record<string, { bg: string; hover: string }> = {
  emerald: {
    bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200',
    hover: '',
  },
  yellow: {
    bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200',
    hover: '',
  },
  red: {
    bg: 'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200',
    hover: '',
  },
  indigo: {
    bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200',
    hover: '',
  },
  violet: {
    bg: 'bg-gradient-to-r from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200',
    hover: '',
  },
};

export const Accordion: React.FC<AccordionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  subtitle,
  color = 'emerald',
  children,
}) => {
  const bgStyle = colorMap[color]?.bg || colorMap['emerald'].bg;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${bgStyle} transition`}
      >
        <div className="flex items-center gap-4 text-left">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-2sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
