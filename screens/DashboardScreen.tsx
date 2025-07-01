import React from 'react';
import { Objective, User, Team } from '../types';
import OkrCard from '../components/okr/OkrCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SparkleIcon } from '../components/ui/Icons';

interface DashboardScreenProps {
  objectives: Objective[];
  users: User[];
  teams: Team[];
  currentUser: User;
  onDeleteObjective: (objectiveId: string) => void;
  onEditObjective: (objective: Objective) => void;
  onStartJourney: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ objectives, users, teams, currentUser, onDeleteObjective, onEditObjective, onStartJourney }) => {
  const myObjectives = objectives.filter(o => o.ownerType === 'User' && o.ownerId === currentUser.id);
  const myTeam = teams.find(t => t.id === currentUser.teamId);
  const myTeamObjectives = myTeam ? objectives.filter(o => o.ownerType === 'Team' && o.ownerId === myTeam.id) : [];

  const hasNoOkrs = myObjectives.length === 0 && myTeamObjectives.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-slate-600">Here's your OKR snapshot for the current cycle.</p>
      </div>

      {hasNoOkrs && (
         <Card className="text-center py-10 px-6 bg-gradient-to-br from-brand-50 to-sky-50">
          <div className="flex justify-center items-center">
            <SparkleIcon className="h-12 w-12 text-brand-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-800">¿Listo para Fijar tus Metas?</h3>
          <p className="mt-2 max-w-lg mx-auto text-slate-600">Parece que aún no tienes OKRs. <br/>Permítenos guiarte paso a paso para crear tus primeros objetivos.</p>
          <Button onClick={onStartJourney} className="mt-6" variant="primary">
            Comenzar Tour Guiado
          </Button>
        </Card>
      )}

      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">My Individual OKRs</h2>
        {myObjectives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myObjectives.map(obj => (
              <OkrCard key={obj.id} objective={obj} users={users} teams={teams} onDelete={onDeleteObjective} onEdit={onEditObjective} />
            ))}
          </div>
        ) : (
          !hasNoOkrs && (
            <div className="text-center py-10 px-6 bg-white rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">You don't have any individual OKRs for this cycle yet.</p>
              <p className="mt-1 text-sm text-slate-400">Time to set some ambitious goals!</p>
            </div>
          )
        )}
      </section>

      {myTeam && (
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">{myTeam.name} Team OKRs</h2>
          {myTeamObjectives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeamObjectives.map(obj => (
                <OkrCard key={obj.id} objective={obj} users={users} teams={teams} onDelete={onDeleteObjective} onEdit={onEditObjective} />
              ))}
            </div>
          ) : (
             !hasNoOkrs && (
               <div className="text-center py-10 px-6 bg-white rounded-lg border border-dashed border-slate-300">
                  <p className="text-slate-500">Your team doesn't have any OKRs for this cycle yet.</p>
               </div>
            )
          )}
        </section>
      )}
    </div>
  );
};

export default DashboardScreen;