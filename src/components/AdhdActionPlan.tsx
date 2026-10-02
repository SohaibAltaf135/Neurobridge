import React, { useState, useEffect } from 'react';
import { MicroTask } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCheck, 
  Flame, 
  Sparkles,
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdhdActionPlanProps {
  tasks: MicroTask[];
  onToggleTask: (taskId: string) => void;
}

export const AdhdActionPlan: React.FC<AdhdActionPlanProps> = ({ tasks, onToggleTask }) => {
  // Focus Timer state (default 5 minutes = 300 seconds for micro-sessions)
  const [timerSeconds, setTimerSeconds] = useState<number>(300);
  const [initialSeconds, setInitialSeconds] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      // Trigger celebratory chime / confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Web Audio API beep chime
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) {
        // AudioContext fallback
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const setTimerPreset = (mins: number) => {
    setIsRunning(false);
    setTimerSeconds(mins * 60);
    setInitialSeconds(mins * 60);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleTaskClick = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!currentlyCompleted) {
      // Fire confetti when a task is checked off!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Gamification Streak */}
      <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Dysfunction Cure: Micro-Missions
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Never face an intimidating "study for 2 hours" block again. Complete these bite-sized 3–5 minute tasks one at a time.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {completedCount} of {tasks.length} Completed
            </span>
            <div className="text-[10px] text-slate-500">{progressPercent}% Progress</div>
          </div>
          <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Checklist of Missions */}
        <div className="lg:col-span-2 space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id, task.completed)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 group ${
                task.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-400 shadow-xs'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 group-hover:text-brand-600 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-500" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    ~{task.estimatedMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {task.explanation}
                </p>
                <div className="mt-2 text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 p-2 rounded-lg border border-brand-200/60 dark:border-brand-800/40">
                  🎯 <strong>Action:</strong> {task.actionItem}
                </div>
              </div>
            </div>
          ))}

          {progressPercent === 100 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center shadow-lg animate-bounce">
              <Trophy className="w-8 h-8 mx-auto mb-1" />
              <div className="font-extrabold text-sm">All Missions Complete!</div>
              <div className="text-xs text-emerald-100 mt-0.5">
                You just conquered this concept in under 15 focused minutes. High five! ✋
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Calming Pomodoro Focus Timer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-between text-center shadow-sm">
          <div className="w-full">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Focus Sprint Timer
            </h4>
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setTimerPreset(3)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${initialSeconds === 180 ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                3m Sprint
              </button>
              <button
                onClick={() => setTimerPreset(5)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${initialSeconds === 300 ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                5m Deep
              </button>
              <button
                onClick={() => setTimerPreset(10)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${initialSeconds === 600 ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                10m Flow
              </button>
            </div>
          </div>

          {/* Clock Display */}
          <div className="my-4 relative w-36 h-36 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-950 shadow-inner">
            <div className="text-center">
              <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatTime(timerSeconds)}
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                {isRunning ? 'Focused' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Start Sprint'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimerSeconds(initialSeconds);
              }}
              title="Reset Timer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
