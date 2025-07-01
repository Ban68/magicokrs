import React, { useState, useCallback } from 'react';
import { Team } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface TeamCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (team: Team) => void;
}

const TeamCreator: React.FC<TeamCreatorProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  const resetForm = useCallback(() => {
    setName('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please provide a name for the new team.');
      return;
    }
    
    const newTeam: Team = {
      id: `t${Date.now()}`,
      name,
    };
    
    onCreate(newTeam);
    resetForm();
    onClose();
  };

  return (
    <Modal id="team-creator-modal" isOpen={isOpen} onClose={onClose} title="Create a New Team">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-slate-700">Team Name</label>
          <input 
            type="text" 
            id="teamName" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
            placeholder="e.g., Customer Success"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Create Team</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamCreator;