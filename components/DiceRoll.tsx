import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

type DiceRollProps = {
  numberRoll: number;
  category: string;
};

export default function DiceRoll({ numberRoll, category }: DiceRollProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  
  useEffect(() => {
    // Reset animations
    rotateAnim.setValue(0);
    scaleAnim.setValue(0.5);
    
    // Animate dice roll
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [numberRoll, category]);
  
  // Rotate the dice during animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const getCategoryColor = () => {
    switch(category) {
      case 'Name': return '#F97316'; // Name - Orange
      case 'Place': return '#06B6D4'; // Place - Cyan
      case 'Animal': return '#10B981'; // Animal - Green
      case 'Thing': return '#8B5CF6'; // Thing - Purple
      default: return '#818CF8';
    }
  };
  
  // Get the first letter of the category for the dice
  const categoryLetter = category.charAt(0);
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dice,
          styles.numberDice,
          {
            transform: [
              { rotate: spin },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.diceNumber}>{numberRoll}</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.dice,
          styles.categoryDice,
          { backgroundColor: getCategoryColor() },
          {
            transform: [
              { rotate: spin },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.diceCategory}>{categoryLetter}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dice: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  numberDice: {
    backgroundColor: '#F59E0B',
  },
  categoryDice: {
    backgroundColor: '#818CF8',
  },
  diceNumber: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 30,
    color: '#FFFFFF',
  },
  diceCategory: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 30,
    color: '#FFFFFF',
  },
});