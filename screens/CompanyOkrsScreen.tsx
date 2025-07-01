import React, { useState } from 'react';
import { Objective, User, Team } from '../types';
import OkrCard from '../components/okr/OkrCard';
import { ChevronDownIcon, ChevronRightIcon } from '../components/ui/Icons';

interface CompanyOkrsScreenProps {
  objectives: Objective[];
  users: User[];
  teams: Team[];
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void;
}

interface ObjectiveNodeProps {
  objective: Objective;
  allObjectives: Objective[];
  users: User[];
  teams: Team[];
  level: number;
  onDelete: (objectiveId: string) => void;
  onEdit: (objective: Objective) => void;
}

const ObjectiveNode: React.FC<ObjectiveNodeProps> = ({ objective, allObjectives, users, teams, level, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const children = allObjectives.filter(o => o.parentId === objective.id);

  return (
    <div style={{ marginLeft: `${level * 2}rem` }} className="my-4">
      <div className="flex items-center mb-2">
        {children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 p-1 rounded-full hover:bg-slate-200">
            {isExpanded ? <ChevronDownIcon className="h-5 w-5 text-slate-500" /> : <ChevronRightIcon className="h-5 w-5 text-slate-500" />}
          </button>
        )}
         <div className="w-full">
            <OkrCard objective={objective} users={users} teams={teams} onDelete={onDelete} onEdit={onEdit} />
         </div>
      </div>
      
      {isExpanded && children.length > 0 && (
        <div className="border-l-2 border-slate-300 pl-4">
          {children.map(child => (
            <ObjectiveNode
              key={child.id}
              objective={child}
              allObjectives={allObjectives}
              users={users}
              teams={teams}
              level={level + 1}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CompanyOkrsScreen: React.FC<CompanyOkrsScreenProps> = ({ objectives, users, teams, onDeleteObjective, onEditObjective }) => {
  const topLevelObjectives = objectives.filter(o => !o.parentId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Company OKR Alignment</h1>
      <p className="mt-1 text-slate-600">Visualizing how all objectives connect, from company-wide goals to individual contributions.</p>
      
      <div className="mt-8">
        {topLevelObjectives.map(obj => (
          <ObjectiveNode
            key={obj.id}
            objective={obj}
            allObjectives={objectives}
            users={users}
            teams={teams}
            level={0}
            onDelete={onDeleteObjective}
            onEdit={onEditObjective}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyOkrsScreen;