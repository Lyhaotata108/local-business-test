import React, { useState } from 'react';
import { steps } from '../../data/questions';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StepWizardProps {
  onComplete: (answers: Record<string, string>) => void;
}

const StepWizard: React.FC<StepWizardProps> = ({ onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Ensure required questions in current step are answered
  const canProceed = currentStep.questions.every(q => {
    if (q.optional) return true;
    return !!answers[q.id];
  });

  const progress = ((currentStepIdx) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Step {currentStepIdx + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-6 shadow-md border-slate-200">
              <CardContent className="p-6 md:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentStep.title}</h2>
                  {currentStep.description && (
                    <p className="text-slate-600">{currentStep.description}</p>
                  )}
                </div>

                <div className="space-y-8">
                  {currentStep.questions.map((q) => (
                    <div key={q.id} className="space-y-4">
                      <label className="block text-base font-medium text-slate-900">
                        {q.label} {q.optional && <span className="text-slate-400 font-normal">(Optional)</span>}
                      </label>
                      
                      {q.type === 'radio' && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleChange(q.id, opt.value)}
                                className={`text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white'
                                }`}
                              >
                                <span className={isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}>
                                  {opt.label}
                                </span>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'url' && (
                        <Input 
                          type="url" 
                          placeholder="https://..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="max-w-md bg-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStepIdx === 0}
            className={currentStepIdx === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            size="lg" 
            onClick={handleNext} 
            disabled={!canProceed}
            className="px-8"
          >
            {currentStepIdx === steps.length - 1 ? 'See Results' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default StepWizard;
