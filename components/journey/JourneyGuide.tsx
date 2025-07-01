
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { journeySteps, JourneyStep } from './journeyConfig';
import Button from '../ui/Button';
import { CloseIcon } from '../ui/Icons';

interface JourneyGuideProps {
  journeyState: {
    active: boolean;
    step: number;
  };
  onNext: () => void;
  onEnd: () => void;
}

const JourneyGuide: React.FC<JourneyGuideProps> = ({ journeyState, onNext, onEnd }) => {
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [style, setStyle] = useState({});

  const { active, step } = journeyState;
  const stepConfig = journeySteps[step];

  useLayoutEffect(() => {
    if (!active || !stepConfig) return;

    const findElement = () => {
      if (stepConfig.targetSelector) {
        const element = document.querySelector(stepConfig.targetSelector);
        setTargetElement(element);
        if (element) {
          const rect = element.getBoundingClientRect();
          const highlightStyle = {
            position: 'absolute' as const,
            top: `${rect.top - 4}px`,
            left: `${rect.left - 4}px`,
            width: `${rect.width + 8}px`,
            height: `${rect.height + 8}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            borderRadius: '8px',
            zIndex: 1000,
            pointerEvents: 'none' as const,
            transition: 'all 0.3s ease-in-out',
          };
          setStyle(highlightStyle);
        } else {
          setStyle({}); // Hide if not found yet
        }
      } else {
        // For centered steps
        setTargetElement(null);
        setStyle({});
      }
    };

    findElement(); // Initial find
    const interval = setInterval(findElement, 200); // Retry to find element as UI renders

    return () => clearInterval(interval);

  }, [active, step, stepConfig]);

  if (!active || !stepConfig) {
    return null;
  }

  const getPopoverPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = targetElement.getBoundingClientRect();
    const popoverHeight = 150; // Estimated height
    const popoverWidth = 320; // 80 rem
    const offset = 12;

    switch(stepConfig.placement) {
      case 'top':
        return { top: rect.top - popoverHeight - offset, left: rect.left + rect.width / 2 - popoverWidth / 2 };
      case 'bottom':
        return { top: rect.bottom + offset, left: rect.left + rect.width / 2 - popoverWidth / 2 };
      case 'left':
        return { top: rect.top + rect.height / 2 - popoverHeight / 2, left: rect.left - popoverWidth - offset };
      case 'right':
        return { top: rect.top + rect.height / 2 - popoverHeight / 2, left: rect.right + offset };
      default: // center
         return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Highlighter */}
      {targetElement && <div style={style}></div>}
      
      {/* Fallback overlay for centered steps */}
      {!targetElement && <div className="fixed inset-0 bg-black/60"></div>}

      {/* Popover */}
      <div
        style={getPopoverPosition()}
        className="fixed w-80 bg-white rounded-lg shadow-2xl z-[1001] transition-all duration-300 ease-in-out"
        role="dialog"
        aria-labelledby="journey-title"
      >
        <div className="p-5">
           <button onClick={onEnd} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full" aria-label="End tour">
                <CloseIcon className="w-5 h-5" />
            </button>
          <h3 id="journey-title" className="text-lg font-bold text-slate-800 pr-6">{stepConfig.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{stepConfig.content}</p>
        </div>
        <div className="px-5 py-3 bg-slate-50 flex items-center justify-between rounded-b-lg">
           <span className="text-xs text-slate-500">Paso {step + 1} de {journeySteps.length}</span>
           <div>
            {step > 0 && !stepConfig.awaitsClose && (
                <Button onClick={onEnd} variant="ghost" className="px-3 py-1.5 text-xs">Salir</Button>
            )}
            {!stepConfig.awaitsClose && (
                 <Button onClick={onNext} variant="primary" className="ml-2 px-3 py-1.5 text-xs">
                    {step === journeySteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyGuide;
