import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { gameReducer, initialGameState } from '@/utils/gameReducer';
import { GameState, GameAction, PlayerAnswer, Player, Vote } from '@/types/gameTypes';

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (players: Player[]) => void;
  rollDice: () => void;
  submitAnswer: (answer: string) => void;
  submitVote: (playerId: string, approved: boolean) => void;
  nextTurn: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  const startGame = (players: Player[]) => {
    dispatch({ type: 'START_GAME', payload: { players } });
  };
  
  const rollDice = () => {
    // Random number between 1-6
    const numberRoll = Math.floor(Math.random() * 6) + 1;
    
    // Categories with full names, no duplicates
    const categories = ['Name', 'Place', 'Animal', 'Thing'];
    const categoryRoll = categories[Math.floor(Math.random() * categories.length)];
    
    dispatch({ 
      type: 'ROLL_DICE', 
      payload: { 
        numberRoll, 
        categoryRoll,
        categoryText: categoryRoll 
      } 
    });
  };
  
  const submitAnswer = (answer: string) => {
    const playerAnswer: PlayerAnswer = {
      playerId: state.currentPlayerId,
      answer,
      category: state.currentCategory,
      position: state.players.find(p => p.id === state.currentPlayerId)?.position || 0
    };
    
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer: playerAnswer } });
  };
  
  const submitVote = (playerId: string, approved: boolean) => {
    const vote: Vote = {
      playerId,
      approved
    };
    
    dispatch({ type: 'SUBMIT_VOTE', payload: { vote } });
  };
  
  const nextTurn = () => {
    dispatch({ type: 'NEXT_TURN' });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      rollDice,
      submitAnswer,
      submitVote,
      nextTurn,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}