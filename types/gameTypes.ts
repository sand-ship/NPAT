export type Position = {
  letter: string;
  color: string;
};

export type Player = {
  id: string;
  name: string;
  color: string;
  avatar: number;
  position: number;
};

export type PlayerAnswer = {
  playerId: string;
  answer: string;
  category: string;
  position: number;
};

export type Vote = {
  playerId: string;
  approved: boolean;
};

export type GameStage = 
  | 'setup' 
  | 'rolling' 
  | 'answering' 
  | 'moving'
  | 'gameOver';

export type GameState = {
  gameStage: GameStage;
  players: Player[];
  currentPlayerId: string;
  currentPlayerIndex: number;
  currentRoll: number;
  currentCategory: string;
  currentCategoryText: string;
  submittedAnswer: PlayerAnswer | null;
  previousAnswers: PlayerAnswer[];
  votes: Vote[];
  winnerId: string | null;
  positions: Position[];
  attemptCount: number;
  invalidAnswer: boolean;
};

export type GameAction =
  | { type: 'START_GAME'; payload: { players: Player[] } }
  | { type: 'ROLL_DICE'; payload: { numberRoll: number; categoryRoll: string; categoryText: string } }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: PlayerAnswer } }
  | { type: 'NEXT_TURN' }
  | { type: 'GAME_OVER'; payload: { winnerId: string } }
  | { type: 'RESET_GAME' };