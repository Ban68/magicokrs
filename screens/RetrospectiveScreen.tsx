import React from 'react';
import { Objective, User, Team } from '../types';
import OkrReviewCard from '../components/okr/OkrReviewCard';

interface RetrospectiveScreenProps {
  objectives: Objective[];
  users: User[];
  teams: Team[];
  onUpdateReflection: (objectiveId: string, reflection: string) => void;
}

const RetrospectiveScreen: React.FC<RetrospectiveScreenProps> = ({ objectives, users, teams, onUpdateReflection }) => {
  // For this example, we'll just show all objectives from a single cycle.
  // A real app would have cycle selectors.
  const currentCycleObjectives = objectives.filter(o => o.cycle === 'Q3 2024');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cycle Retrospective: Q3 2024</h1>
        <p className="mt-1 text-slate-600">Review outcomes, celebrate wins, and capture learnings to improve next cycle.</p>
      </div>

      <section className="space-y-6">
        {currentCycleObjectives.length > 0 ? (
          currentCycleObjectives.map(obj => (
            <OkrReviewCard 
              key={obj.id} 
              objective={obj} 
              users={users} 
              teams={teams} 
              onUpdateReflection={onUpdateReflection} 
            />
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">No objectives found for this cycle.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default RetrospectiveScreen;