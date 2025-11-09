import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

type GameSettings = {
  soundEnabled: boolean;
  voiceInputEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  voiceInputEnabled: Platform.OS !== 'web', // Voice input default off for web
  difficulty: 'medium',
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Load settings from storage on mount (could be expanded to use AsyncStorage)
  useEffect(() => {
    // For now, just use default settings
    setSettings(defaultSettings);
  }, []);
  
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Save settings to storage here (could be expanded to use AsyncStorage)
      return updated;
    });
  };
  
  return { settings, updateSettings };
}