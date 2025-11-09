import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from '@/context/GameContext';
import GameScreen from '@/components/GameScreen';

export default function GameIndex() {
  return (
    <GameProvider>
      <View style={styles.container}>
        <GameScreen />
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
});