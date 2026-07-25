'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, usePanInfo } from 'framer-motion';
import { Heart, X, SkipForward, Star, RefreshCw } from 'lucide-react';

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: string;
  rating: string;
  posterUrl: string;
  hook: string;
  platforms: string[];
}

interface SwipeDeckProps {
  movies: Movie[];
  onSwipe: (movieId: string, direction: 'like' | 'dislike' | 'skip' | 'superlike') => void;
  onFinish: () => void;
}

const SWIPE_THRESHOLD = 100; // Pixels required to trigger an action

export function SwipeDeck({ movies, onSwipe, onFinish }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(movies.length - 1);
  const [isFlipped, setIsFlipped] = useState(false);

  // Motion values for smooth drag mechanics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic visual transformations based on drag distance
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // Opacity indicators for directional threshold triggers
  const likeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const dislikeOpacity = useTransform(x, [-20, -SWIPE_THRESHOLD], [0, 1]);
  const superlikeOpacity = useTransform(y, [-20, -SWIPE_THRESHOLD], [0, 1]);
  const skipOpacity = useTransform(y, [20, SWIPE_THRESHOLD], [0, 1]);

  const currentMovie = movies[currentIndex];

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  };

  const handleDragEnd = (_: unknown, info: usePanInfo) => {
    const xOffset = info.offset.x;
    const yOffset = info.offset.y;

    // Determine primary gesture axis based on absolute distance
    if (Math.abs(xOffset) > Math.abs(yOffset)) {
      if (xOffset > SWIPE_THRESHOLD) {
        executeSwipe('like');
      } else if (xOffset < -SWIPE_THRESHOLD) {
        executeSwipe('dislike');
      } else {
        resetPosition();
      }
    } else {
      if (yOffset < -SWIPE_THRESHOLD) {
        executeSwipe('superlike');
      } else if (yOffset > SWIPE_THRESHOLD) {
        executeSwipe('skip');
      } else {
        resetPosition();
      }
    }
  };

  const executeSwipe = (direction: 'like' | 'dislike' | 'skip' | 'superlike') => {
    triggerHaptic();
    onSwipe(currentMovie.id, direction);
    setIsFlipped(false);
    x.set(0);
    y.set(0);

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onFinish();
    }
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };

  if (currentIndex < 0 || !currentMovie) {
    return (
      <div className="flex flex-col items-center justify-center h-[520px] bg-slate-900 rounded-3xl text-white p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Sprint Completed!</h3>
        <p className="text-slate-400">Evaluating room matches...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm h-[560px] mx-auto select-none touch-none">
      {/* Background card preview for depth */}
      {currentIndex > 0 && (
        <div className="absolute inset-0 scale-95 translate-y-4 rounded-3xl bg-slate-800 border border-slate-700 shadow-xl opacity-60 overflow-hidden pointer-events-none" />
      )}

      {/* Active Top Card */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ x, y, rotate }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* OVERLAY BADGES (Fade in on drag) */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 border-4 border-emerald-500 text-emerald-500 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[-15deg] bg-slate-950/80">
          LIKE
        </motion.div>
        
        <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-8 right-8 z-20 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[15deg] bg-slate-950/80">
          VETO
        </motion.div>

        <motion.div style={{ opacity: superlikeOpacity }} className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 border-4 border-amber-400 text-amber-400 font-extrabold text-2xl px-4 py-1 rounded-xl bg-slate-950/80">
          SUPER LIKE
        </motion.div>

        <motion.div style={{ opacity: skipOpacity }} className="absolute top-8 left-1/2 -translate-x-1/2 z-20 border-4 border-slate-400 text-slate-300 font-extrabold text-2xl px-4 py-1 rounded-xl bg-slate-950/80">
          SKIP
        </motion.div>

        {/* CARD CONTENT FRAME */}
        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="relative h-full w-full flex flex-col justify-between p-6">
            <div className="absolute inset-0 -z-10">
              <img 
                src={currentMovie.posterUrl} 
                alt={currentMovie.title} 
                className="w-full h-full object-cover opacity-40 blur-sm scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Poster Header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                ★ {currentMovie.rating}
              </span>
              <button 
                onClick={() => setIsFlipped(true)}
                className="text-xs text-slate-300 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Flip Details
              </button>
            </div>

            {/* Movie Info Footer */}
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white leading-tight">{currentMovie.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span>{currentMovie.year}</span>
                <span>•</span>
                <span>{currentMovie.runtime}</span>
              </div>
              <p className="text-sm text-slate-200 line-clamp-2 italic font-light">
                "{currentMovie.hook}"
              </p>
              
              <div className="flex gap-2 pt-2">
                {currentMovie.platforms.map((platform) => (
                  <span key={platform} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* BACK OF CARD (Details view) */
          <div className="relative h-full w-full p-6 flex flex-col justify-between bg-slate-900 text-slate-100">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{currentMovie.title}</h3>
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {currentMovie.hook}
              </p>
            </div>
            <p className="text-xs text-slate-500 text-center">Tap button or flip back to swipe</p>
          </div>
        )}
      </motion.div>

      {/* FALLBACK ON-SCREEN ACTION BUTTONS */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center items-center gap-4">
        <button 
          onClick={() => executeSwipe('dislike')}
          className="p-3 rounded-full bg-slate-800 text-rose-500 border border-slate-700 shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <button 
          onClick={() => executeSwipe('skip')}
          className="p-3 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <SkipForward className="w-6 h-6" />
        </button>
        <button 
          onClick={() => executeSwipe('superlike')}
          className="p-3 rounded-full bg-slate-800 text-amber-400 border border-slate-700 shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <Star className="w-6 h-6" />
        </button>
        <button 
          onClick={() => executeSwipe('like')}
          className="p-3 rounded-full bg-slate-800 text-emerald-500 border border-slate-700 shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
