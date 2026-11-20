import React from 'react';

export const Loading = ({ text = 'Loading data...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="w-8 h-8 border-2 border-[#CFE4DD] border-t-[#0F5C4E] rounded-full animate-spin" />
      <p className="text-sm text-[#5C6B66]">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#F6F7F4]/85 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
