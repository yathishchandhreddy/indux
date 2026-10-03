import React from 'react';

interface AudioWaveformProps {
  state: 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'answer';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ state }) => {
  if (state === 'idle') return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      <span className={`w-1.5 rounded-full bg-emerald-600 ${state === 'listening' ? 'animate-wave-1' : 'h-3'}`} />
      <span className={`w-1.5 rounded-full bg-emerald-500 ${state === 'listening' ? 'animate-wave-2' : 'h-6'}`} />
      <span className={`w-1.5 rounded-full bg-amber-500 ${state === 'listening' ? 'animate-wave-3' : 'h-8'}`} />
      <span className={`w-1.5 rounded-full bg-emerald-500 ${state === 'listening' ? 'animate-wave-4' : 'h-5'}`} />
      <span className={`w-1.5 rounded-full bg-emerald-600 ${state === 'listening' ? 'animate-wave-5' : 'h-3'}`} />
      <span className={`w-1.5 rounded-full bg-emerald-400 ${state === 'listening' ? 'animate-wave-2' : 'h-4'}`} />
      <span className={`w-1.5 rounded-full bg-amber-400 ${state === 'listening' ? 'animate-wave-4' : 'h-7'}`} />
    </div>
  );
};
