import { GameState, GameAction, Player } from '@/types/gameTypes';

// Create an array of positions with random letters A-Z
const generateGamePositions = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const positions = [];
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD93D', // Yellow
    '#6C5CE7', // Purple
    '#A8E6CF', // Mint
    '#FF8B94', // Coral
    '#B8F2E6', // Aqua
    '#FFA69E', // Salmon
    '#AED9E0', // Sky
    '#FAF3DD', // Cream
  ];

  // Shuffle the alphabet using Fisher-Yates algorithm
  for (let i = alphabet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
  }

  // Create positions with shuffled letters
  alphabet.forEach((letter, index) => {
    positions.push({
      letter,
      color: colors[index % colors.length]
    });
  });
  
  return positions;
};

// Function to validate answer based on category and target letter
const validateAnswer = (
  answer: string, 
  category: string, 
  targetLetter: string, 
  previousAnswers: PlayerAnswer[]
): boolean => {
  // Basic validation
  if (!answer || answer.length < 2) return false;
  
  // Get first letter of answer (case insensitive)
  const firstLetter = answer.charAt(0).toUpperCase();
  const targetLetterUpper = targetLetter.toUpperCase();
  
  // Check if answer starts with target letter (case insensitive)
  if (firstLetter !== targetLetterUpper) {
    return false;
  }
  
  // Check for duplicate answers (case insensitive)
  const isDuplicate = previousAnswers.some(
    prev => prev.answer.toLowerCase() === answer.toLowerCase()
  );
  if (isDuplicate) return false;
  
  // Remove special characters and numbers
  const cleanAnswer = answer.replace(/[^a-zA-Z\s]/g, '').trim();
  if (cleanAnswer.length < 2) return false;
  
  return true;
};

export const initialGameState: GameState = {
  gameStage: 'setup',
  players: [],
  currentPlayerId: '',
  currentPlayerIndex: 0,
  currentRoll: 0,
  currentCategory: '',
  currentCategoryText: '',
  submittedAnswer: null,
  previousAnswers: [],
  votes: [],
  winnerId: null,
  positions: generateGamePositions(),
  attemptCount: 0,
  invalidAnswer: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const players = action.payload.players.map(player => ({
        ...player,
        position: 1,
      }));
      
      return {
        ...state,
        gameStage: 'rolling',
        players,
        currentPlayerId: players[0].id,
        currentPlayerIndex: 0,
        previousAnswers: [],
        votes: [],
        winnerId: null,
        positions: generateGamePositions(),
        attemptCount: 0,
        invalidAnswer: false,
      };
      
    case 'ROLL_DICE':
      return {
        ...state,
        gameStage: 'answering',
        currentRoll: action.payload.numberRoll,
        currentCategory: action.payload.categoryRoll,
        currentCategoryText: action.payload.categoryText,
        attemptCount: 0,
        invalidAnswer: false,
      };
      
    case 'SUBMIT_ANSWER': {
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
      if (!currentPlayer) return state;
      
      const targetPosition = Math.min(currentPlayer.position + state.currentRoll, state.positions.length);
      const targetLetter = state.positions[targetPosition - 1]?.letter || 'Z';
      
      // Skip validation if empty answer (time ran out)
      if (!action.payload.answer.answer.trim()) {
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        const nextPlayerId = state.players[nextPlayerIndex].id;
        
        return {
          ...state,
          gameStage: 'rolling',
          currentPlayerIndex: nextPlayerIndex,
          currentPlayerId: nextPlayerId,
          currentRoll: 0,
          currentCategory: '',
          currentCategoryText: '',
          submittedAnswer: null,
          votes: [],
          attemptCount: 0,
          invalidAnswer: false,
        };
      }
      
      // Validate the answer
      const isValid = validateAnswer(
        action.payload.answer.answer,
        state.currentCategory,
        targetLetter,
        state.previousAnswers
      );
      
      // If answer is invalid, increment attempt count and set invalidAnswer flag
      if (!isValid) {
        return {
          ...state,
          attemptCount: state.attemptCount + 1,
          invalidAnswer: true,
        };
      }
      
      // Reset invalid answer flag
      state.invalidAnswer = false;
      
      const newPosition = Math.min(currentPlayer.position + state.currentRoll, 26);
      const updatedPlayers = state.players.map(player =>
        player.id === state.currentPlayerId
          ? { ...player, position: newPosition }
          : player
      );

      // Check for win condition
      if (newPosition >= 26) {
        return {
          ...state,
          gameStage: 'gameOver',
          players: updatedPlayers,
          winnerId: state.currentPlayerId,
          submittedAnswer: action.payload.answer,
          previousAnswers: [...state.previousAnswers, action.payload.answer],
        };
      }

      // Move to next player
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextPlayerId = state.players[nextPlayerIndex].id;

      return {
        ...state,
        gameStage: 'rolling',
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentPlayerId: nextPlayerId,
        currentRoll: 0,
        currentCategory: '',
        currentCategoryText: '',
        submittedAnswer: action.payload.answer,
        previousAnswers: [...state.previousAnswers, action.payload.answer],
        votes: [],
        attemptCount: 0,
      };
    }
      
    case 'NEXT_TURN': {
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextPlayerId = state.players[nextPlayerIndex].id;
      
      return {
        ...state,
        gameStage: 'rolling',
        currentPlayerIndex: nextPlayerIndex,
        currentPlayerId: nextPlayerId,
        currentRoll: 0,
        currentCategory: '',
        currentCategoryText: '',
        submittedAnswer: null,
        votes: [],
        attemptCount: 0,
        invalidAnswer: false,
      };
    }
      
    case 'GAME_OVER':
      return {
        ...state,
        gameStage: 'gameOver',
        winnerId: action.payload.winnerId,
      };
      
    case 'RESET_GAME':
      return {
        ...initialGameState,
        positions: generateGamePositions(),
      };
      
    default:
      return state;
  }
}