import React, { useState, useCallback, useEffect } from 'react';
import { Objective, User, Team, AppScreen } from './types';
import { mockObjectives, mockUsers, mockTeams } from './data/mockData';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardScreen from './screens/DashboardScreen';
import CompanyOkrsScreen from './screens/CompanyOkrsScreen';
import MyOkrsScreen from './screens/MyOkrsScreen';
import RetrospectiveScreen from './screens/RetrospectiveScreen';
import SettingsScreen from './screens/SettingsScreen';
import OkrCreator from './components/okr/OkrCreator';
import UserCreator from './components/users/UserCreator';
import TeamCreator from './components/teams/TeamCreator';
import ConfirmationModal from './components/ui/ConfirmationModal';
import { AddIcon } from './components/ui/Icons';
import JourneyGuide from './components/journey/JourneyGuide';
import { journeySteps } from './components/journey/journeyConfig';

const getAllDescendantIds = (objectiveId: string, allObjectives: Objective[]): string[] => {
  const children = allObjectives.filter(o => o.parentId === objectiveId);
  if (children.length === 0) {
      return [];
  }
  const descendantIds: string[] = children.map(c => c.id);
  children.forEach(c => {
      descendantIds.push(...getAllDescendantIds(c.id, allObjectives));
  });
  return descendantIds;
};

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreatorOpen, setCreatorOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [isUserCreatorOpen, setUserCreatorOpen] = useState(false);
  const [isTeamCreatorOpen, setTeamCreatorOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('u1'); // Start as Jane Doe
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [journeyState, setJourneyState] = useState({ active: false, step: 0 });

  const currentUser = users.find(u => u.id === currentUserId);

  useEffect(() => {
    // Simulate fetching initial data
    setObjectives(mockObjectives);
    setUsers(mockUsers);
    setTeams(mockTeams);
  }, []);

  const handleStartJourney = () => {
    setJourneyState({ active: true, step: 0 });
  };

  const handleEndJourney = () => {
    setJourneyState({ active: false, step: 0 });
  };

  const handleNextJourneyStep = useCallback(() => {
    setJourneyState(prevState => {
      const nextStepIndex = prevState.step + 1;
      if (nextStepIndex >= journeySteps.length) {
        handleEndJourney();
        return { active: false, step: 0 };
      }

      const nextStep = journeySteps[nextStepIndex];
      
      // Prepare UI for the next step
      if (nextStep.screen && nextStep.screen !== currentScreen) {
        setCurrentScreen(nextStep.screen);
      }
      if (nextStep.action) {
        switch (nextStep.action) {
          case 'open_team_creator': setTeamCreatorOpen(true); break;
          case 'open_user_creator': setUserCreatorOpen(true); break;
          case 'open_okr_creator': setCreatorOpen(true); setEditingObjective(null); break;
        }
      }
      
      return { ...prevState, step: nextStepIndex };
    });
  }, [currentScreen]);

  const handleChangeCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const handleCreateNewObjective = (newObjective: Objective) => {
    setObjectives(prev => [newObjective, ...prev]);
  };
  
  const handleUpdateObjective = (updatedObjective: Objective) => {
    setObjectives(prev => prev.map(obj => obj.id === updatedObjective.id ? updatedObjective : obj));
    setEditingObjective(null);
  };
  
  const handleStartEditing = (objective: Objective) => {
    setEditingObjective(objective);
    setCreatorOpen(true);
  };

  const handleCloseCreator = () => {
    setCreatorOpen(false);
    setEditingObjective(null);
    if (journeyState.active && journeySteps[journeyState.step].awaitsClose === 'okr_creator') {
      handleNextJourneyStep();
    }
  };
  
  const handleUpdateObjectiveReflection = (objectiveId: string, reflection: string) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === objectiveId ? { ...obj, reflection } : obj
      )
    );
  };

  const handleCreateNewUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    // setUserCreatorOpen(false) will be called by the component's close handler
  };

  const handleCloseUserCreator = () => {
    setUserCreatorOpen(false);
    if (journeyState.active && journeySteps[journeyState.step].awaitsClose === 'user_creator') {
      handleNextJourneyStep();
    }
  };

  const handleCreateNewTeam = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);
    // setTeamCreatorOpen(false) will be called by the component's close handler
  };
  
  const handleCloseTeamCreator = () => {
    setTeamCreatorOpen(false);
    if (journeyState.active && journeySteps[journeyState.step].awaitsClose === 'team_creator') {
      handleNextJourneyStep();
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleDeleteObjective = (objectiveId: string) => {
    const doDelete = () => {
        const descendantIds = getAllDescendantIds(objectiveId, objectives);
        const allIdsToDelete = [objectiveId, ...descendantIds];
        setObjectives(prev => prev.filter(obj => !allIdsToDelete.includes(obj.id)));
    };

    setConfirmationState({
        isOpen: true,
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar este OKR y todos sus objetivos secundarios alineados? Esta acción no se puede deshacer.',
        onConfirm: doDelete,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentUser || userId === currentUser.id) {
       const doNothing = () => {};
       setConfirmationState({
        isOpen: true,
        title: 'Acción no permitida',
        message: 'No puedes eliminar tu propia cuenta de usuario.',
        onConfirm: doNothing,
      });
      return;
    }

    const userHasOkrs = objectives.some(o => o.ownerId === userId && o.ownerType === 'User');
    if (userHasOkrs) {
       const doNothing = () => {};
       setConfirmationState({
        isOpen: true,
        title: 'No se puede eliminar el usuario',
        message: 'Este usuario es propietario de uno o más OKRs. Reasigna sus OKRs antes de eliminar al usuario.',
        onConfirm: doNothing,
      });
      return;
    }
    
    const doDelete = () => {
      // If the deleted user was the current user, switch to another user
      if (userId === currentUserId) {
        const firstOtherUser = users.find(u => u.id !== userId);
        setCurrentUserId(firstOtherUser ? firstOtherUser.id : '');
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
    };

    setConfirmationState({
      isOpen: true,
      title: 'Confirmar Eliminación de Usuario',
      message: '¿Estás seguro de que quieres eliminar a este usuario? Esta acción es permanente y no se puede deshacer.',
      onConfirm: doDelete,
    });

  };

  const handleDeleteTeam = (teamId: string) => {
    const teamHasUsers = users.some(u => u.teamId === teamId);
    if (teamHasUsers) {
      const doNothing = () => {};
      setConfirmationState({
        isOpen: true,
        title: 'No se puede eliminar el equipo',
        message: 'Este equipo todavía tiene usuarios asignados. Reasigna los usuarios a otros equipos antes de eliminar este.',
        onConfirm: doNothing,
      });
      return;
    }

    const teamHasOkrs = objectives.some(o => o.ownerType === 'Team' && o.ownerId === teamId);
    if (teamHasOkrs) {
      const doNothing = () => {};
      setConfirmationState({
        isOpen: true,
        title: 'No se puede eliminar el equipo',
        message: 'Este equipo es propietario de uno o más OKRs. Reasigna sus OKRs antes de eliminar el equipo.',
        onConfirm: doNothing,
      });
      return;
    }

    const doDelete = () => {
      setTeams(prev => prev.filter(t => t.id !== teamId));
    };

    setConfirmationState({
      isOpen: true,
      title: 'Confirmar Eliminación de Equipo',
      message: '¿Estás seguro de que quieres eliminar este equipo? Esta acción es permanente.',
      onConfirm: doDelete,
    });
  };

  const renderScreen = () => {
    if (!currentUser) return <div className="p-8">Loading user...</div>;
    
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen objectives={objectives} users={users} teams={teams} currentUser={currentUser} onDeleteObjective={handleDeleteObjective} onEditObjective={handleStartEditing} onStartJourney={handleStartJourney} />;
      case 'company':
        return <CompanyOkrsScreen objectives={objectives} users={users} teams={teams} onDeleteObjective={handleDeleteObjective} onEditObjective={handleStartEditing} />;
      case 'my-okrs':
        return <MyOkrsScreen objectives={objectives} users={users} teams={teams} currentUser={currentUser} onDeleteObjective={handleDeleteObjective} onEditObjective={handleStartEditing} />;
      case 'retrospective':
        return <RetrospectiveScreen objectives={objectives} users={users} teams={teams} onUpdateReflection={handleUpdateObjectiveReflection} />;
      case 'settings':
        return <SettingsScreen 
                  users={users} 
                  teams={teams} 
                  onAddUser={() => setUserCreatorOpen(true)}
                  onDeleteUser={handleDeleteUser}
                  currentUser={currentUser}
                  onAddTeam={() => setTeamCreatorOpen(true)}
                  onDeleteTeam={handleDeleteTeam}
               />;
      default:
        return <DashboardScreen objectives={objectives} users={users} teams={teams} currentUser={currentUser} onDeleteObjective={handleDeleteObjective} onEditObjective={handleStartEditing} onStartJourney={handleStartJourney} />;
    }
  };

  if (!currentUser) {
    return (
       <div className="flex items-center justify-center h-screen bg-slate-100">
          <div className="text-xl font-semibold text-slate-700">Loading Application...</div>
       </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={currentUser} 
          allUsers={users}
          onChangeUser={handleChangeCurrentUser}
          onNewOkrClick={() => { setCreatorOpen(true); setEditingObjective(null); }} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
          {renderScreen()}
        </main>
      </div>
       <JourneyGuide
        journeyState={journeyState}
        onNext={handleNextJourneyStep}
        onEnd={handleEndJourney}
      />
      <OkrCreator
        isOpen={isCreatorOpen}
        onClose={handleCloseCreator}
        onCreate={handleCreateNewObjective}
        onUpdate={handleUpdateObjective}
        objectiveToEdit={editingObjective}
        users={users}
        teams={teams}
        currentUser={currentUser}
        objectives={objectives}
      />
      <UserCreator
        isOpen={isUserCreatorOpen}
        onClose={handleCloseUserCreator}
        onCreate={handleCreateNewUser}
        teams={teams}
      />
      <TeamCreator
        isOpen={isTeamCreatorOpen}
        onClose={handleCloseTeamCreator}
        onCreate={handleCreateNewTeam}
      />
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
      >
        {confirmationState.message}
      </ConfirmationModal>
      <button 
        id="fab-new-okr"
        onClick={() => { setCreatorOpen(true); setEditingObjective(null); }}
        className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 z-30"
        aria-label="Create new OKR"
      >
        <AddIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default App;