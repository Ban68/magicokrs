import React, { useState } from 'react';
import { Objective, User, Team } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface OkrReviewCardProps {
  objective: Objective;
  users: User[];
  teams: Team[];
  onUpdateReflection: (objectiveId: string, reflection: string) => void;
}

const getOwner = (objective: Objective, users: User[], teams: Team[]) => {
  if (objective.ownerType === 'User') {
    return users.find(u => u.id === objective.ownerId);
  }
  return teams.find(t => t.id === objective.ownerId);
};

const calculateOverallProgress = (objective: Objective) => {
  if (objective.keyResults.length === 0) return 0;
  const totalProgress = objective.keyResults.reduce((sum, kr) => {
    const krProgress = kr.targetValue === 0 ? 100 : (kr.currentValue / kr.targetValue) * 100;
    return sum + krProgress;
  }, 0);
  return totalProgress / objective.keyResults.length;
};

const OkrReviewCard: React.FC<OkrReviewCardProps> = ({ objective, users, teams, onUpdateReflection }) => {
  const owner = getOwner(objective, users, teams);
  const overallProgress = calculateOverallProgress(objective);
  const finalScore = (overallProgress / 100).toFixed(2);
  
  const [reflectionText, setReflectionText] = useState(objective.reflection || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateReflection(objective.id, reflectionText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Reset saved message after 2s
  };

  const getScoreColor = () => {
    const score = parseFloat(finalScore);
    if (objective.level === 'Aspirational') {
      if (score >= 0.7) return 'text-green-600';
      if (score >= 0.4) return 'text-yellow-600';
      return 'text-red-600';
    }
    // Committed level
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-semibold text-slate-800 flex-1 pr-4">{objective.title}</h3>
           {owner && (
            <div className="flex items-center space-x-2 text-sm text-slate-500 flex-shrink-0">
              {objective.ownerType === 'User' && <img src={(owner as User).avatarUrl} alt={owner.name} className="h-6 w-6 rounded-full" />}
              <span>{owner.name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-center items-center bg-slate-50/80">
            <span className="text-sm text-slate-500 mb-1">Final Score</span>
            <span className={`text-5xl font-bold ${getScoreColor()}`}>{finalScore}</span>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full mt-2">{objective.level}</span>
        </div>
        <div className="md:col-span-2 p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Result Outcomes</h4>
            <ul className="space-y-2 text-sm">
                {objective.keyResults.map(kr => {
                    const finalValue = `${kr.currentValue}${kr.unit}`;
                    const targetValue = `${kr.targetValue}${kr.unit}`;
                    return (
                        <li key={kr.id} className="flex justify-between">
                            <span className="text-slate-600 w-3/4">{kr.description}</span>
                            <span className="font-mono text-slate-700 text-right">{finalValue} / {targetValue}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Evaluation &amp; Reflection</h4>
        <p className="text-xs text-slate-500 mb-3">What did we learn? What went well? What obstacles did we face? This context is more important than the score itself.</p>
        <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={4}
            className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="e.g., We excelled at X but struggled with Y due to Z. Next time, we should..."
        />
        <div className="mt-3 flex justify-end items-center">
            {isSaved && <span className="text-sm text-green-600 mr-4">Saved!</span>}
            <Button onClick={handleSave} variant="primary">Save Reflection</Button>
        </div>
      </div>
    </Card>
  );
};

export default OkrReviewCard;