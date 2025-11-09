import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useGame } from '@/context/GameContext';

export default function PlayerInfo() {
  const { state } = useGame();
  const { players, currentPlayerId } = state;
  
  const getAvatarUri = (avatarIndex: number) => {
    const AVATARS = [
      'https://images.pexels.com/photos/7516509/pexels-photo-7516509.jpeg?auto=compress&cs=tinysrgb&w=200', // Colorful books
      'https://images.pexels.com/photos/3661927/pexels-photo-3661927.jpeg?auto=compress&cs=tinysrgb&w=200', // Pencils
      'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=200', // Globe
      'https://images.pexels.com/photos/1019471/pexels-photo-1019471.jpeg?auto=compress&cs=tinysrgb&w=200', // Paint brushes
      'https://images.pexels.com/photos/1249929/pexels-photo-1249929.jpeg?auto=compress&cs=tinysrgb&w=200', // Colorful blocks
      'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&w=200', // Puzzle pieces
    ];
    return AVATARS[avatarIndex % AVATARS.length];
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const currentPosition = player.position;
          let currentLetter = '—';
          
          if (currentPosition > 0 && currentPosition <= 26) {
            currentLetter = String.fromCharCode(64 + currentPosition);
          }
          
          return (
            <View 
              key={player.id}
              style={[
                styles.playerCard,
                isCurrentPlayer && styles.currentPlayerCard,
                { borderColor: player.color }
              ]}
            >
              <View style={styles.playerInfo}>
                <Image 
                  source={{ uri: getAvatarUri(player.avatar) }} 
                  style={[styles.avatar, { borderColor: player.color }]} 
                />
                <View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.positionContainer}>
                    <Text style={styles.positionLabel}>Current:</Text>
                    <Text style={[styles.positionLetter, { color: player.color }]}>
                      {currentLetter}
                    </Text>
                  </View>
                </View>
              </View>
              
              {isCurrentPlayer && (
                <View style={[styles.turnIndicator, { backgroundColor: player.color }]}>
                  <Text style={styles.turnText}>Current Turn</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scrollContent: {
    padding: 12,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    minWidth: 160,
    borderLeftWidth: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  currentPlayerCard: {
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    backgroundColor: '#F3F4F6',
  },
  playerName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#4B5563',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  positionLetter: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 14,
  },
  turnIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
  },
  turnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});