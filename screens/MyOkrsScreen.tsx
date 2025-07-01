import React from 'react';
import { Objective, User, Team } from '../types';
import OkrCard from '../components/okr/OkrCard';

interface MyOkrsScreenProps {
  objectives: Objective[];
  users: User[];
  teams: Team[];
  currentUser: User;
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void;
}

const MyOkrsScreen: React.FC<MyOkrsScreenProps> = ({ objectives, users, teams, currentUser, onDeleteObjective, onEditObjective }) => {
  const myDirectObjectives = objectives.filter(o => o.ownerId === currentUser.id && o.ownerType === 'User');
  const myTeamObjectives = objectives.filter(o => currentUser.teamId && o.ownerId === currentUser.teamId && o.ownerType === 'Team');

  const allMyOkrs = [...myDirectObjectives, ...myTeamObjectives];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My OKRs</h1>
        <p className="mt-1 text-slate-600">All objectives you are directly responsible for.</p>
      </div>

      <section>
        {allMyOkrs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMyOkrs.map(obj => (
              <OkrCard key={obj.id} objective={obj} users={users} teams={teams} onDelete={onDeleteObjective} onEdit={onEditObjective} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">You are not the owner of any OKRs for this cycle.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyOkrsScreen;