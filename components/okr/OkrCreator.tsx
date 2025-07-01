import React, { useState, useCallback, useEffect } from 'react';
import { Objective, KeyResult, User, Team } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AddIcon, SparkleIcon, CloseIcon } from '../ui/Icons';
import { Spinner } from '../ui/Spinner';
import { validateKeyResultWithAI } from '../../services/geminiService';

interface OkrCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (objective: Objective) => void;
  onUpdate?: (objective: Objective) => void;
  objectiveToEdit?: Objective | null;
  users: User[];
  teams: Team[];
  currentUser: User;
  objectives: Objective[];
}

interface KrValidationState {
  isValid: boolean;
  feedback: string;
  isLoading: boolean;
}

const OkrCreator: React.FC<OkrCreatorProps> = ({ isOpen, onClose, onCreate, onUpdate, objectiveToEdit, users, teams, currentUser, objectives }) => {
  const [title, setTitle] = useState('');
  const [ownerId, setOwnerId] = useState(currentUser.id);
  const [ownerType, setOwnerType] = useState<'User' | 'Team'>('User');
  const [level, setLevel] = useState<'Committed' | 'Aspirational'>('Committed');
  const [parentId, setParentId] = useState<string | null>(null);
  const [keyResults, setKeyResults] = useState<Array<Partial<KeyResult> & { id?: string }>>([
    { description: '', currentValue: 0, targetValue: 100, unit: '%' }
  ]);
  const [krValidations, setKrValidations] = useState<Record<number, KrValidationState>>({});

  const isEditMode = !!objectiveToEdit;

  const resetForm = useCallback(() => {
      setTitle('');
      setOwnerId(currentUser.id);
      setOwnerType('User');
      setLevel('Committed');
      setParentId(null);
      setKeyResults([{ description: '', currentValue: 0, targetValue: 100, unit: '%' }]);
      setKrValidations({});
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && objectiveToEdit) {
        setTitle(objectiveToEdit.title);
        setOwnerId(objectiveToEdit.ownerId);
        setOwnerType(objectiveToEdit.ownerType);
        setLevel(objectiveToEdit.level);
        setParentId(objectiveToEdit.parentId);
        setKeyResults(objectiveToEdit.keyResults);
        setKrValidations({});
      } else {
        resetForm();
      }
    }
  }, [isOpen, isEditMode, objectiveToEdit, resetForm]);


  const handleAddKr = () => {
    setKeyResults([...keyResults, { description: '', currentValue: 0, targetValue: 100, unit: '%' }]);
  };

  const handleRemoveKr = (index: number) => {
    setKeyResults(keyResults.filter((_, i) => i !== index));
    const newValidations = {...krValidations};
    delete newValidations[index];
    setKrValidations(newValidations);
  };

  const handleKrChange = <K extends keyof KeyResult, >(index: number, field: K, value: KeyResult[K]) => {
    const newKrs = [...keyResults];
    newKrs[index] = { ...newKrs[index], [field]: value };
    setKeyResults(newKrs);
  };
  
  const handleValidateKr = useCallback(async (index: number) => {
      const krDescription = keyResults[index]?.description;
      if (!krDescription) return;

      setKrValidations(prev => ({ ...prev, [index]: { isValid: false, feedback: '', isLoading: true } }));
      
      try {
        const result = await validateKeyResultWithAI(krDescription);
        setKrValidations(prev => ({ ...prev, [index]: { ...result, isLoading: false } }));
      } catch (error) {
        console.error("AI validation failed", error);
        setKrValidations(prev => ({
          ...prev,
          [index]: { isValid: false, feedback: 'Error validating with AI. Please check manually.', isLoading: false },
        }));
      }
  }, [keyResults]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || keyResults.some(kr => !kr.description)) {
      alert('Please fill in the objective title and all key result descriptions.');
      return;
    }
    
    const objectiveData: Omit<Objective, 'id'> = {
      title,
      ownerId,
      ownerType,
      level,
      parentId,
      cycle: 'Q3 2024', // Simplified logic
      type: ownerType === 'Team' ? 'Team' : 'Individual',
      keyResults: keyResults.map((kr, i) => ({
          id: kr.id || `kr${Date.now()}-${i}`,
          description: kr.description || '',
          currentValue: Number(kr.currentValue) || 0,
          targetValue: Number(kr.targetValue) || 1,
          unit: kr.unit || '',
      })),
    };

    if(isEditMode && objectiveToEdit && onUpdate) {
        onUpdate({ ...objectiveData, id: objectiveToEdit.id });
    } else if (!isEditMode && onCreate) {
        onCreate({ ...objectiveData, id: `o${Date.now()}` });
    }
    
    onClose();
  };
  

  return (
    <Modal id="okr-creator-modal" isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Objective' : 'Create a New Objective'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Objective Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label htmlFor="owner" className="block text-sm font-medium text-slate-700">Owner</label>
            <select id="owner" value={`${ownerType}-${ownerId}`} onChange={e => {
                const [type, id] = e.target.value.split('-');
                setOwnerType(type as 'User' | 'Team');
                setOwnerId(id);
            }} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
              <optgroup label="Me">
                <option value={`User-${currentUser.id}`}>{currentUser.name}</option>
              </optgroup>
              <optgroup label="My Team">
                  {teams.filter(t => t.id === currentUser.teamId).map(team => (
                    <option key={team.id} value={`Team-${team.id}`}>{team.name}</option>
                  ))}
              </optgroup>
              <optgroup label="Other Users">
                {users.filter(u => u.id !== currentUser.id).map(user => (
                  <option key={user.id} value={`User-${user.id}`}>{user.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700">Ambition Level</label>
            <select id="level" value={level} onChange={e => setLevel(e.target.value as 'Committed' | 'Aspirational')} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
              <option value="Committed">Committed (Expected to achieve 100%)</option>
              <option value="Aspirational">Aspirational (Success at 70%)</option>
            </select>
          </div>
        </div>
        
        <div>
           <label htmlFor="parent" className="block text-sm font-medium text-slate-700">Aligns to (Parent Objective)</label>
            <select id="parent" value={parentId || ''} onChange={e => setParentId(e.target.value || null)} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                <option value="">None</option>
                {objectives.filter(o => o.type !== 'Individual' && o.id !== objectiveToEdit?.id).map(obj => (
                     <option key={obj.id} value={obj.id}>{obj.title}</option>
                ))}
            </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium text-slate-800">Key Results</h3>
          {keyResults.map((kr, index) => (
            <div key={kr.id || index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
               <button type="button" onClick={() => handleRemoveKr(index)} className="absolute -top-2 -right-2 bg-slate-200 rounded-full p-0.5 text-slate-500 hover:bg-red-200 hover:text-red-700">
                    <CloseIcon className="w-4 h-4"/>
                </button>
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1">
                  <label htmlFor={`kr-desc-${index}`} className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea id={`kr-desc-${index}`} value={kr.description} onChange={e => handleKrChange(index, 'description', e.target.value)} rows={2} required className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                  
                  {krValidations[index] && !krValidations[index].isLoading && (
                    <div className={`mt-2 text-sm p-2 rounded-md ${krValidations[index].isValid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {krValidations[index].feedback}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label htmlFor={`kr-current-${index}`} className="block text-xs font-medium text-slate-600">Start</label>
                        <input type="number" id={`kr-current-${index}`} value={kr.currentValue} onChange={e => handleKrChange(index, 'currentValue', parseFloat(e.target.value))} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor={`kr-target-${index}`} className="block text-xs font-medium text-slate-600">Target</label>
                        <input type="number" id={`kr-target-${index}`} value={kr.targetValue} onChange={e => handleKrChange(index, 'targetValue', parseFloat(e.target.value))} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor={`kr-unit-${index}`} className="block text-xs font-medium text-slate-600">Unit</label>
                        <input type="text" id={`kr-unit-${index}`} value={kr.unit} onChange={e => handleKrChange(index, 'unit', e.target.value)} placeholder="e.g. $, %, users" className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button type="button" variant="ghost" onClick={() => handleValidateKr(index)} disabled={!kr.description || krValidations[index]?.isLoading} isLoading={krValidations[index]?.isLoading} leftIcon={<SparkleIcon />}>
                       AI Check
                    </Button>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={handleAddKr} leftIcon={<AddIcon />}>Add Key Result</Button>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Create Objective'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OkrCreator;