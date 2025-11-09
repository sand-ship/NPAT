import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  Image
} from 'react-native';
import { useGame } from '@/context/GameContext';
import PlayerInfo from './PlayerInfo';
import { 
  ChevronDown, 
  Star as Stars, 
  Sparkles, 
  Crown,
  Shield,
  Flag,
  Medal,
  Sword,
  Trophy,
  Target
} from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = SCREEN_WIDTH > 500 ? 48 : 40;
const BOARD_PADDING = 16;
const BOARD_WIDTH = Math.min(SCREEN_WIDTH - (BOARD_PADDING * 2), 400);
const TILES_PER_ROW = 4;

// Array of decorative icons for tiles
const TILE_ICONS = [
  { icon: Shield, color: '#4ECDC4' },
  { icon: Flag, color: '#FF6B6B' },
  { icon: Medal, color: '#FFD93D' },
  { icon: Sword, color: '#95D44A' },
  { icon: Trophy, color: '#FF8B94' },
  { icon: Target, color: '#2AB7CA' }
];

export default function GameBoard() {
  const { state } = useGame();
  const { players, positions } = state;
  
  const rows = [];
  for (let i = 0; i < positions.length; i += TILES_PER_ROW) {
    rows.push(positions.slice(i, i + TILES_PER_ROW));
  }
  
  const renderPlayerTokens = (position: number) => {
    const playersAtPosition = players.filter(p => p.position === position);
    if (playersAtPosition.length === 0) return null;
    
    return (
      <View style={styles.tokenContainer}>
        {playersAtPosition.map((player, index) => (
          <View 
            key={player.id}
            style={[
              styles.playerToken,
              { backgroundColor: player.color },
              { top: index * 4, left: index * 4 }
            ]}
          >
            <Image 
              source={{ uri: getAvatarUri(player.avatar) }}
              style={styles.tokenAvatar}
            />
          </View>
        ))}
      </View>
    );
  };
  
  const getAvatarUri = (avatarIndex: number) => {
    const AVATARS = [
      'https://images.pexels.com/photos/7516509/pexels-photo-7516509.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/3661927/pexels-photo-3661927.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&w=200',
    ];
    return AVATARS[avatarIndex % AVATARS.length];
  };

  const renderPath = (rowIndex: number, isLast: boolean) => {
    const isEvenRow = rowIndex % 2 === 0;
    if (isLast) return null;
    
    return (
      <View style={styles.pathContainer}>
        <View style={[
          styles.path,
          isEvenRow ? styles.pathRight : styles.pathLeft,
          styles.pathCurve
        ]}>
          <View style={[
            styles.verticalPath,
            isEvenRow ? styles.verticalPathRight : styles.verticalPathLeft
          ]} />
        </View>
        {isEvenRow ? (
          <ChevronDown size={24} color="#818CF8" style={[styles.pathArrow, styles.pathArrowRight]} />
        ) : (
          <ChevronDown size={24} color="#818CF8" style={[styles.pathArrow, styles.pathArrowLeft]} />
        )}
      </View>
    );
  };

  const renderTileIcon = (index: number) => {
    const IconInfo = TILE_ICONS[index % TILE_ICONS.length];
    const IconComponent = IconInfo.icon;
    return <IconComponent size={16} color="#FFFFFF" style={styles.tileIcon} />;
  };
  
  return (
    <View style={styles.container}>
      <PlayerInfo />
      <ScrollView contentContainerStyle={styles.boardContainer}>
        <View style={styles.titleContainer}>
          <Stars size={24} color="#FFD93D" />
          <Text style={styles.boardTitle}>Alphabet Wars</Text>
          <Stars size={24} color="#FFD93D" />
        </View>

        <View style={styles.board}>
          {rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`}>
              <View style={[
                styles.row,
                rowIndex % 2 === 1 && styles.reversedRow
              ]}>
                {row.map((position, colIndex) => {
                  const tileIndex = rowIndex * TILES_PER_ROW + colIndex;
                  const isStart = tileIndex === 0;
                  const isEnd = tileIndex === positions.length - 1;
                  
                  return (
                    <View 
                      key={`tile-${tileIndex}`}
                      style={[
                        styles.tileWrapper,
                        isStart && styles.startTile,
                        isEnd && styles.endTile,
                        rowIndex % 2 === 1 && { transform: [{ translateX: TILE_SIZE / 2 }] }
                      ]}
                    >
                      <View style={[
                        styles.tile,
                        { backgroundColor: position.color }
                      ]}>
                        {isStart && <Sparkles size={16} color="#FFFFFF" style={styles.tileIcon} />}
                        {isEnd && <Crown size={16} color="#FFFFFF" style={styles.tileIcon} />}
                        {!isStart && !isEnd && renderTileIcon(tileIndex)}
                        <Text style={styles.letter}>{position.letter}</Text>
                        {renderPlayerTokens(tileIndex + 1)}
                      </View>
                    </View>
                  );
                })}
              </View>
              {renderPath(rowIndex, rowIndex === rows.length - 1)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardContainer: {
    padding: BOARD_PADDING,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  boardTitle: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#4B5563',
    marginHorizontal: 12,
  },
  board: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: BOARD_WIDTH,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: TILE_SIZE / 2,
  },
  reversedRow: {
    flexDirection: 'row-reverse',
  },
  pathContainer: {
    height: 48,
    position: 'relative',
    marginVertical: 4,
  },
  path: {
    position: 'absolute',
    width: '80%',
    height: 3,
    backgroundColor: '#818CF8',
    opacity: 0.4,
    top: '50%',
    transform: [{ translateY: -1.5 }],
  },
  pathCurve: {
    borderRadius: 20,
  },
  verticalPath: {
    position: 'absolute',
    width: 3,
    height: 48,
    backgroundColor: '#818CF8',
    opacity: 0.4,
  },
  verticalPathRight: {
    right: 0,
    top: 0,
  },
  verticalPathLeft: {
    left: 0,
    top: 0,
  },
  pathRight: {
    right: 0,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  pathLeft: {
    left: 0,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  pathArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
    opacity: 0.8,
  },
  pathArrowRight: {
    right: '10%',
  },
  pathArrowLeft: {
    left: '10%',
  },
  tileWrapper: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tile: {
    width: '100%',
    height: '100%',
    borderRadius: TILE_SIZE / 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startTile: {
    transform: [{ scale: 1.1 }],
  },
  endTile: {
    transform: [{ scale: 1.1 }],
  },
  letter: {
    fontFamily: 'Nunito-Bold',
    fontSize: TILE_SIZE / 2,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tokenContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    zIndex: 10,
  },
  playerToken: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tokenAvatar: {
    width: '100%',
    height: '100%',
  },
  tileIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  }
});