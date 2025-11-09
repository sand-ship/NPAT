import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Dimensions 
} from 'react-native';
import { useGame } from '@/context/GameContext';
import { RotateCcw, Crown, Medal, PartyPopper as Party } from 'lucide-react-native';
import { useRef, useEffect } from 'react';

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF'];
const NUM_CONFETTI = 50;

export default function GameOverScreen() {
  const { state, resetGame } = useGame();
  const winnerPlayer = state.players.find(p => p.id === state.winnerId);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(Array(NUM_CONFETTI).fill(0).map(() => ({
    top: new Animated.Value(-50),
    left: new Animated.Value(Math.random() * Dimensions.get('window').width),
    rotate: new Animated.Value(0),
    scale: new Animated.Value(0.5),
  }))).current;
  
  useEffect(() => {
    // Start animations in sequence
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        // Confetti animation
        ...confettiAnims.map((anim, i) =>
          Animated.sequence([
            Animated.delay(i * 50),
            Animated.parallel([
              Animated.timing(anim.top, {
                toValue: Dimensions.get('window').height,
                duration: 2500,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
              Animated.timing(anim.rotate, {
                toValue: 360 + Math.random() * 720,
                duration: 2500,
                easing: Easing.linear,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 2500,
                useNativeDriver: true,
              }),
            ]),
          ])
        ),
      ]),
    ]).start();
  }, []);
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });
  
  // Get winner avatar
  const getAvatarUri = (avatarIndex: number) => {
    const AVATARS = [
      'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/33196/still-life-teddy-white-read.jpg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/1019764/pexels-photo-1019764.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/4429292/pexels-photo-4429292.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/3661243/pexels-photo-3661243.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/127723/pexels-photo-127723.jpeg?auto=compress&cs=tinysrgb&w=200',
    ];
    return AVATARS[avatarIndex % AVATARS.length];
  };
  
  // Render confetti pieces
  const renderConfetti = () => {
    return confettiAnims.map((anim, index) => (
      <Animated.View
        key={index}
        style={[
          styles.confetti,
          {
            backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
            transform: [
              { translateY: anim.top },
              { translateX: anim.left },
              { rotate: anim.rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              })},
              { scale: anim.scale },
            ],
          },
        ]}
      />
    ));
  };
  
  if (!winnerPlayer) return null;
  
  return (
    <View style={styles.container}>
      {renderConfetti()}
      
      <Animated.View 
        style={[
          styles.winnerContainer, 
          { 
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Party size={40} color="#F59E0B" style={styles.partyIcon} />
        <Text style={styles.congratsText}>Congratulations!</Text>
        
        <View style={styles.avatarContainer}>
          <Animated.View style={{
            transform: [{ rotate: rotation }],
            position: 'absolute',
            top: -30,
            right: -20,
          }}>
            <Crown size={50} color="#F59E0B" />
          </Animated.View>
          
          <Image 
            source={{ uri: getAvatarUri(winnerPlayer.avatar) }}
            style={[styles.winnerAvatar, { borderColor: winnerPlayer.color }]}
          />
        </View>
        
        <Text style={styles.winnerName}>{winnerPlayer.name}</Text>
        <Text style={styles.winText}>is the Alphabet Wars champion!</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Medal size={24} color="#F59E0B" />
            <Text style={styles.statValue}>1st</Text>
            <Text style={styles.statLabel}>Place</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.letterZ}>A-Z</Text>
            <Text style={styles.statValue}>{state.alphabet?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Letters</Text>
          </View>
        </View>
      </Animated.View>
      
      <TouchableOpacity 
        style={styles.playAgainButton}
        onPress={resetGame}
      >
        <RotateCcw size={20} color="#FFFFFF" />
        <Text style={styles.playAgainText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FF',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  partyIcon: {
    position: 'absolute',
    top: -20,
    left: -20,
  },
  congratsText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 28,
    color: '#818CF8',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  winnerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
  },
  winnerName: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#4B5563',
  },
  winText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#4B5563',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  letterZ: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#818CF8',
  },
  playAgainButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playAgainText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});