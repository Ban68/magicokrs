import React, { useState, useCallback } from 'react';
import { User, Team } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface UserCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
  teams: Team[];
}

const UserCreator: React.FC<UserCreatorProps> = ({ isOpen, onClose, onCreate, teams }) => {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState<string | undefined>(teams[0]?.id);
  const [avatarUrl, setAvatarUrl] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setTeamId(teams[0]?.id);
    setAvatarUrl('');
  }, [teams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teamId) {
      alert('Please provide a name and select a team for the new user.');
      return;
    }
    
    // Generate a random avatar if not provided
    const finalAvatarUrl = avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`;
    
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      teamId,
      avatarUrl: finalAvatarUrl
    };
    
    onCreate(newUser);
    resetForm();
    onClose();
  };

  return (
    <Modal id="user-creator-modal" isOpen={isOpen} onClose={onClose} title="Add a New User">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input 
            type="text" 
            id="userName" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
            placeholder="e.g., Alex Ray"
          />
        </div>

        <div>
          <label htmlFor="team" className="block text-sm font-medium text-slate-700">Team</label>
          <select 
            id="team" 
            value={teamId} 
            onChange={e => setTeamId(e.target.value)} 
            required
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700">Avatar URL (Optional)</label>
          <input 
            type="text" 
            id="avatarUrl" 
            value={avatarUrl} 
            onChange={e => setAvatarUrl(e.target.value)} 
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="https://..."
          />
           <p className="mt-1 text-xs text-slate-500">If left blank, a random avatar will be generated.</p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Add User</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserCreator;