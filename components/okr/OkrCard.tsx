import React from 'react';
import { Objective, User, Team } from '../../types';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { TrashIcon, EditIcon } from '../ui/Icons';

interface OkrCardProps {
  objective: Objective;
  users: User[];
  teams: Team[];
  onDelete?: (objectiveId: string) => void;
  onEdit?: (objective: Objective) => void;
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

const OkrCard: React.FC<OkrCardProps> = ({ objective, users, teams, onDelete, onEdit }) => {
  const owner = getOwner(objective, users, teams);
  const overallProgress = calculateOverallProgress(objective);

  const typeColorClasses = {
    Company: 'bg-indigo-100 text-indigo-700',
    Team: 'bg-sky-100 text-sky-700',
    Individual: 'bg-emerald-100 text-emerald-700',
  };

  const levelColorClasses = {
    Committed: 'bg-slate-100 text-slate-600',
    Aspirational: 'bg-amber-100 text-amber-700',
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents event bubbling
    if (onDelete) {
      onDelete(objective.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents event bubbling
    if (onEdit) {
      onEdit(objective);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeColorClasses[objective.type]}`}>{objective.type}</span>
             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelColorClasses[objective.level]}`}>{objective.level}</span>
          </div>
           <div className="flex items-center space-x-1">
            {owner && (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                {objective.ownerType === 'User' && <img src={(owner as User).avatarUrl} alt={owner.name} className="h-6 w-6 rounded-full" />}
                <span>{owner.name}</span>
              </div>
            )}
            {onEdit && (
                <button
                    onClick={handleEditClick}
                    className="text-slate-400 hover:text-brand-600 transition-colors p-1 rounded-full hover:bg-brand-100"
                    aria-label="Edit OKR"
                >
                    <EditIcon className="h-4 w-4" />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={handleDeleteClick}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-100"
                    aria-label="Delete OKR"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            )}
           </div>
        </div>
        <h3 className="text-md font-semibold text-slate-800 mt-2">{objective.title}</h3>
      </div>
      <div className="p-4 space-y-4 flex-grow">
        {objective.keyResults.map(kr => {
          const krProgress = kr.targetValue === 0 ? 100 : (kr.currentValue / kr.targetValue) * 100;
          return (
            <div key={kr.id}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-slate-600">{kr.description}</span>
                <span className="font-medium text-slate-700">{Math.round(krProgress)}%</span>
              </div>
              <ProgressBar progress={krProgress} level={objective.level} />
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
         <div className="flex justify-between items-center mb-1 text-sm font-medium">
            <span className="text-slate-600">Overall Progress</span>
            <span className="text-brand-700">{Math.round(overallProgress)}%</span>
          </div>
        <ProgressBar progress={overallProgress} level={objective.level} />
      </div>
    </Card>
  );
};

export default OkrCard;