import React from 'react';

export const Loading = ({ text = 'Loading historical analytics...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-3 border-[#D6AD60]/20 border-t-[#D6AD60] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-[#788391] font-mono tracking-wide">
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#F5F1E8]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
