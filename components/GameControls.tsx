import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration
} from 'react-native';
import { useGame } from '@/context/GameContext';
import DiceRoll from './DiceRoll';
import { Mic, Send, Timer } from 'lucide-react-native';
import { useGameSettings } from '@/hooks/useGameSettings';

const CONTROLS_HEIGHT = 160; // Fixed height for controls panel

export default function GameControls() {
  const { state, rollDice, submitAnswer } = useGame();
  const { settings } = useGameSettings();
  const [answer, setAnswer] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  
  const getInitialTime = () => {
    switch(settings.difficulty) {
      case 'easy': return 45;
      case 'medium': return 30;
      case 'hard': return 20;
      default: return 30;
    }
  };
  
  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  
  const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
  const targetPosition = Math.min((currentPlayer?.position || 0) + state.currentRoll, state.positions.length);
  const targetLetter = state.positions[targetPosition - 1]?.letter || 'Z';
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (state.gameStage === 'rolling' || state.gameStage === 'answering') {
      setTimeLeft(getInitialTime());
      
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            timeoutId = setTimeout(() => {
              submitAnswer('');
            }, 0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state.gameStage, state.currentPlayerId, settings.difficulty]);

  useEffect(() => {
    if (state.invalidAnswer) {
      if (Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }
      
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        inputRef.current?.focus();
      });
    }
  }, [state.invalidAnswer]);
  
  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    
    const cleanAnswer = answer.trim();
    if (cleanAnswer.length < 3) {
      setAnswer('');
      return;
    }
    
    submitAnswer(cleanAnswer);
    if (!state.invalidAnswer) {
      setAnswer('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getWarningThreshold = () => {
    switch(settings.difficulty) {
      case 'easy': return 15;
      case 'medium': return 10;
      case 'hard': return 8;
      default: return 10;
    }
  };
  
  const warningThreshold = getWarningThreshold();
  
  const getErrorMessage = () => {
    const cleanAnswer = answer.trim();
    if (cleanAnswer.length < 3) {
      return 'Answer must be at least 3 letters long';
    }
    if (cleanAnswer.charAt(0).toUpperCase() !== targetLetter) {
      return `Answer must start with "${targetLetter}"`;
    }
    return 'Invalid answer, try again!';
  };
  
  const renderGameStageControls = () => {
    switch (state.gameStage) {
      case 'rolling':
        return (
          <View style={styles.controlsContainer}>
            <View style={styles.timerContainer}>
              <Timer size={20} color={timeLeft <= warningThreshold ? '#EF4444' : '#818CF8'} />
              <Text style={[
                styles.timerText,
                timeLeft <= warningThreshold && styles.timerWarning
              ]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.rollButton}
              onPress={rollDice}
            >
              <Text style={styles.rollButtonText}>Roll Dice</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'answering':
        return (
          <View style={styles.controlsContainer}>
            <View style={styles.timerContainer}>
              <Timer size={20} color={timeLeft <= warningThreshold ? '#EF4444' : '#818CF8'} />
              <Text style={[
                styles.timerText,
                timeLeft <= warningThreshold && styles.timerWarning
              ]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
            <DiceRoll
              numberRoll={state.currentRoll}
              category={state.currentCategory}
            />
            <Text style={styles.prompt}>
              Name a <Text style={styles.highlight}>{state.currentCategoryText}</Text>
              {' '}that starts with letter{' '}
              <Text style={styles.letterHighlight}>{targetLetter}</Text>
            </Text>
            
            <Animated.View style={[
              styles.inputContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  state.invalidAnswer && styles.invalidInput
                ]}
                value={answer}
                onChangeText={setAnswer}
                placeholder={`Enter a ${state.currentCategoryText.toLowerCase()}...`}
                placeholderTextColor="#9CA3AF"
                autoFocus
                onSubmitEditing={handleSubmitAnswer}
                autoCapitalize="words"
              />
              
              {settings.voiceInputEnabled && Platform.OS !== 'web' && (
                <TouchableOpacity style={styles.micButton}>
                  <Mic size={20} color="#818CF8" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  !answer.trim() && styles.disabledButton
                ]}
                disabled={!answer.trim()}
                onPress={handleSubmitAnswer}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
            
            {state.invalidAnswer && (
              <Text style={styles.errorText}>
                {getErrorMessage()}
              </Text>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { height: CONTROLS_HEIGHT }]}
    >
      {renderGameStageControls()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    padding: 16,
    justifyContent: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: -8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#818CF8',
    marginLeft: 6,
  },
  timerWarning: {
    color: '#EF4444',
  },
  prompt: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  highlight: {
    fontFamily: 'Nunito-Bold',
    color: '#818CF8',
  },
  letterHighlight: {
    fontFamily: 'Nunito-ExtraBold',
    color: '#10B981',
    fontSize: 18,
  },
  rollButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rollButtonText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4B5563',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  invalidInput: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  },
  micButton: {
    padding: 8,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#818CF8',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});