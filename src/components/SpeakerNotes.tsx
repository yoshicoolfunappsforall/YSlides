import React from 'react';

export const SpeakerNotes = () => {
  return (
    <div className="h-[100px] bg-white border-t border-[#d9d9d9] flex flex-col relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-[#d9d9d9] rounded-full cursor-ns-resize"></div>
      <div className="flex-1 p-4">
        <textarea 
            className="w-full h-full resize-none focus:outline-none text-[13px] text-[#333] placeholder-[#999]"
            placeholder="Click to add notes"
        />
      </div>
    </div>
  );
};
