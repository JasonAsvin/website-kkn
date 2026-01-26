import React from 'react';

interface VisionMissionMottoProps {
  type: 'vision' | 'mission' | 'motto';
  title: string;
  content: string;
  subtitle?: string;
}

export const VisionMissionMotto: React.FC<VisionMissionMottoProps> = ({
  type,
  title,
  content,
  subtitle,
}) => {
  const isMotto = type === 'motto';

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="prose max-w-none">
        {isMotto ? (
          <>
            <p className="text-xl text-gray-900 leading-relaxed text-center font-semibold mb-2">
              {content}
            </p>
            {subtitle && (
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                {subtitle}
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default VisionMissionMotto;
