import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions 
} from 'react-native';
import { useGame } from '@/context/GameContext';
import { Player } from '@/types/gameTypes';
import { 
  Plus, 
  Minus, 
  Rocket, 
  Star, 
  BookOpen, 
  Pencil, 
  Brain,
  Palette,
  Shapes,
  Puzzle
} from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = SCREEN_WIDTH > 768 ? 2 : 1;

const AVATARS = [
  'https://images.pexels.com/photos/7516509/pexels-photo-7516509.jpeg?auto=compress&cs=tinysrgb&w=200', // Colorful books
  'https://images.pexels.com/photos/3661927/pexels-photo-3661927.jpeg?auto=compress&cs=tinysrgb&w=200', // Pencils
  'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=200', // Globe
  'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=200', // Colorful paint splashes
  'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=200', // Colorful abstract art
  'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&w=200', // Puzzle pieces
];

const COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#FFD93D', // Bright Yellow
  '#95D44A', // Lime Green
  '#FF8B94', // Pink
  '#2AB7CA'  // Sky Blue
];

const DECORATIVE_ICONS = [
  { icon: BookOpen, color: '#FF6B6B' },
  { icon: Pencil, color: '#4ECDC4' },
  { icon: Brain, color: '#FFD93D' },
  { icon: Palette, color: '#95D44A' },
  { icon: Shapes, color: '#FF8B94' },
  { icon: Puzzle, color: '#2AB7CA' },
];

export default function PlayerSetup() {
  const { startGame } = useGame();
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', color: COLORS[0], avatar: 0, position: 0 },
    { id: '2', name: 'Player 2', color: COLORS[1], avatar: 1, position: 0 },
  ]);
  
  const addPlayer = () => {
    if (players.length >= 4) return;
    
    const newId = (players.length + 1).toString();
    const avatarIndex = players.length % AVATARS.length;
    const newPlayer = {
      id: newId,
      name: `Player ${newId}`,
      color: COLORS[players.length % COLORS.length],
      avatar: avatarIndex,
      position: 0,
    };
    
    setPlayers([...players, newPlayer]);
  };
  
  const removePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(player => player.id !== id));
  };
  
  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, name } : player
    ));
  };
  
  const updatePlayerAvatar = (id: string, avatarIndex: number) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, avatar: avatarIndex } : player
    ));
  };
  
  const updatePlayerColor = (id: string, color: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, color } : player
    ));
  };
  
  const handleStartGame = () => {
    startGame(players);
  };

  const renderPlayerCards = () => {
    const rows = [];
    for (let i = 0; i < players.length; i += COLUMNS) {
      const rowPlayers = players.slice(i, i + COLUMNS);
      rows.push(
        <View key={i} style={styles.row}>
          {rowPlayers.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <TextInput
                  style={styles.nameInput}
                  value={player.name}
                  onChangeText={(text) => updatePlayerName(player.id, text)}
                  maxLength={20}
                  placeholder={`Player ${player.id}`}
                  placeholderTextColor="#9CA3AF"
                />
                {players.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => removePlayer(player.id)}
                    style={styles.removeButton}
                  >
                    <Minus size={16} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.avatarSelector}>
                <Text style={styles.selectorLabel}>Choose your avatar:</Text>
                <View style={styles.avatarGrid}>
                  {AVATARS.map((avatar, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => updatePlayerAvatar(player.id, index)}
                      style={[
                        styles.avatarOption,
                        player.avatar === index && { borderColor: player.color, borderWidth: 3 }
                      ]}
                    >
                      <Image 
                        source={{ uri: AVATARS[index] }} 
                        style={styles.avatarOptionImage} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.colorSelector}>
                <Text style={styles.selectorLabel}>Color:</Text>
                <View style={styles.colorOptions}>
                  {COLORS.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => updatePlayerColor(player.id, color)}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        player.color === color && styles.selectedColorOption
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }
    return rows;
  };

  const renderDecorativeIcon = (index: number) => {
    const iconInfo = DECORATIVE_ICONS[index % DECORATIVE_ICONS.length];
    const IconComponent = iconInfo.icon;
    return (
      <View 
        key={index}
        style={[
          styles.decorativeIcon,
          {
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            transform: [{ rotate: `${index * 45}deg` }]
          }
        ]}
      >
        <IconComponent size={24} color={iconInfo.color} style={{ opacity: 0.2 }} />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.decorativeContainer}>
        {DECORATIVE_ICONS.map((_, index) => renderDecorativeIcon(index))}
      </View>
      
      <View style={styles.header}>
        <Star size={28} color="#FFD93D" style={styles.headerIcon} />
        <Text style={styles.title}>Alphabet Wars</Text>
        <Star size={28} color="#FFD93D" style={styles.headerIcon} />
      </View>
      <Text style={styles.creators}>Created by Naina and Reyansh</Text>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderPlayerCards()}
      </ScrollView>
      
      <View style={styles.controls}>
        {players.length < 4 && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addPlayer}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Player</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartGame}
        >
          <Rocket size={20} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Adventure!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  headerIcon: {
    marginHorizontal: 8,
  },
  title: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 32,
    color: '#2AB7CA',
    textAlign: 'center',
  },
  creators: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FF8B94',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#4B5563',
    paddingVertical: 4,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  avatarSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 4,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  colorSelector: {
    marginTop: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'center',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 4,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9AA2', // Pastel red
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  addButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2', // Vibrant blue
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});