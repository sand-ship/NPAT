import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useGame } from '@/context/GameContext';
import PlayerSetup from './PlayerSetup';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameOverScreen from './GameOverScreen';

export default function GameScreen() {
  const { state } = useGame();
  
  if (state.gameStage === 'gameOver') {
    return <GameOverScreen />;
  }
  
  return (
    <View style={styles.container}>
      {state.gameStage === 'setup' ? (
        <PlayerSetup />
      ) : (
        <View style={styles.gameContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <GameBoard />
          </ScrollView>
          <GameControls />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  gameContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180, // Ensure enough space for controls
  },
});