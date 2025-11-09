import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';

type VotingScreenProps = {
  answer: string;
  category: string;
  onVote: (approved: boolean) => void;
  currentPlayer: string;
};

export default function VotingScreen({ answer, category, onVote, currentPlayer }: VotingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentPlayer}'s Answer:</Text>
      
      <View style={styles.answerContainer}>
        <Text style={styles.categoryLabel}>Category: {category}</Text>
        <Text style={styles.answer}>{answer}</Text>
      </View>
      
      <Text style={styles.question}>Is this answer valid?</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]}
          onPress={() => onVote(false)}
        >
          <ThumbsDown size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.approveButton]}
          onPress={() => onVote(true)}
        >
          <ThumbsUp size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: '#4B5563',
    marginBottom: 16,
  },
  answerContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  categoryLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  answer: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  question: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});