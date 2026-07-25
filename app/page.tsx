'use client';

import React, { useState } from 'react';
import { SwipeDeck } from '@/components/SwipeDeck';
import { MOCK_MOVIES } from '@/data/mockMovies';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);

  const handleSwipe = (movieId: string, direction: string) => {
    const movie = MOCK_MOVIES.find((m) => m.id === movieId);
    const logEntry = `Swiped ${direction.toUpperCase()} on "${movie?.title}"`;
    setLogs((prev) => [logEntry, ...prev]);
  };

  const handleFinish = () => {
    setLogs((prev) => ['🎉 Sprint finished! All cards swiped.', ...prev]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
          CineMatch Swipe Preview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Drag cards in 4 directions or click the buttons below
        </p>
      </div>

      {/* Swipe Deck Container */}
      <div className="w-full max-w-md pb-20">
        <SwipeDeck 
          movies={MOCK_MOVIES} 
          onSwipe={handleSwipe} 
          onFinish={handleFinish} 
        />
      </div>

      {/* Real-time Interaction Log */}
      <div className="w-full max-w-sm mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <h4 className="font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Interaction Log
        </h4>
        <div className="space-y-1 max-h-28 overflow-y-auto font-mono text-slate-400">
          {logs.length === 0 ? (
            <p className="italic text-slate-600">No swipes recorded yet...</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className="border-b border-slate-800/50 pb-1">
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
