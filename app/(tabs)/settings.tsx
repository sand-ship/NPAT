import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { useGameSettings } from '@/hooks/useGameSettings';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react-native';

export default function SettingsScreen() {
  const { settings, updateSettings } = useGameSettings();
  
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            {settings.soundEnabled ? 
              <Volume2 size={24} color="#818CF8" /> : 
              <VolumeX size={24} color="#9CA3AF" />
            }
            <Text style={styles.settingText}>Sound Effects</Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => updateSettings({ soundEnabled: value })}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            {settings.voiceInputEnabled ? 
              <Mic size={24} color="#818CF8" /> : 
              <MicOff size={24} color="#9CA3AF" />
            }
            <Text style={styles.settingText}>Voice Input</Text>
          </View>
          <Switch
            value={settings.voiceInputEnabled}
            onValueChange={(value) => updateSettings({ voiceInputEnabled: value })}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Difficulty</Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                settings.difficulty === 'easy' && styles.activeButton
              ]}
              onPress={() => updateSettings({ difficulty: 'easy' })}
            >
              <Text style={[
                styles.buttonText,
                settings.difficulty === 'easy' && styles.activeButtonText
              ]}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                settings.difficulty === 'medium' && styles.activeButton
              ]}
              onPress={() => updateSettings({ difficulty: 'medium' })}
            >
              <Text style={[
                styles.buttonText,
                settings.difficulty === 'medium' && styles.activeButtonText
              ]}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                settings.difficulty === 'hard' && styles.activeButton
              ]}
              onPress={() => updateSettings({ difficulty: 'hard' })}
            >
              <Text style={[
                styles.buttonText,
                settings.difficulty === 'hard' && styles.activeButtonText
              ]}>Hard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Alphabet Wars v1.0.0
        </Text>
        <Text style={styles.aboutSubtext}>
          A fun educational game for children to learn vocabulary while having fun! Brought to you by Naina and Reyansh.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: '#4B5563',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  activeButton: {
    backgroundColor: '#818CF8',
  },
  buttonText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#4B5563',
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  aboutText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#4B5563',
    marginVertical: 8,
  },
  aboutSubtext: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});