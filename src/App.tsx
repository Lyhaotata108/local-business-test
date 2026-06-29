import React, { useState } from 'react';
import Home from './components/Home';
import StepWizard from './components/Diagnostic/StepWizard';
import Results from './components/Diagnostic/Results';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleStart = () => {
    setView('diagnostic');
  };

  const handleComplete = (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setView('results');
  };

  const handleReset = () => {
    setAnswers({});
    setView('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div 
          className="text-xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
          onClick={() => view !== 'home' && setView('home')}
        >
          <div className="w-6 h-6 bg-blue-600 rounded-md text-white flex items-center justify-center text-xs">
            ★
          </div>
          LocalGrowth
        </div>
      </header>

      {view === 'home' && <Home onStart={handleStart} />}
      {view === 'diagnostic' && <StepWizard onComplete={handleComplete} />}
      {view === 'results' && <Results answers={answers} onReset={handleReset} />}
    </div>
  );
}
