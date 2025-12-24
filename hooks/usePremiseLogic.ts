import { useState, useEffect } from 'react';
import { DebateSettings, TokenUsage, PremiseData } from '../core/types';
import { generatePremiseProposal } from '../services/gemini/index';

export const usePremiseLogic = (
  settings: DebateSettings,
  onConfirm: (finalPremises: PremiseData, usage?: TokenUsage) => void,
  onTokenUpdate: (usage: TokenUsage) => void
) => {
  const [loading, setLoading] = useState(true);
  const [premises, setPremises] = useState<PremiseData>({ definitions: '', goal: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPremises = async () => {
      try {
        const result = await generatePremiseProposal(settings.topic);
        if (mounted) {
          setPremises(result.data);
          onTokenUpdate(result.usage);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setLoading(false);
      }
    };
    fetchPremises();
    return () => {
      mounted = false;
    };
  }, [settings.topic]); // Re-run if topic changes (though unlikely in this flow)

  const handleStart = () => {
    onConfirm(premises);
  };

  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const isStartDisabled = isEditing && (!premises.definitions.trim() || !premises.goal.trim());

  return {
    loading,
    premises,
    setPremises,
    isEditing,
    toggleEdit,
    handleStart,
    isStartDisabled,
  };
};
