import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Info } from 'lucide-react-native';

export default function RulesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Info size={32} color="#818CF8" />
          <Text style={styles.headerText}>Alphabet Wars Rules</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Overview</Text>
          <Text style={styles.paragraph}>
            Alphabet Wars is a fun race where players compete to complete the alphabet board. 
            Each player takes turns rolling dice and answering prompts to advance through 
            the alphabet board.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          <Text style={styles.listItem}>• 2-4 players take turns rolling dice</Text>
          <Text style={styles.listItem}>• Roll gives you a number and a category</Text>
          <Text style={styles.listItem}>• Answer a prompt in that category</Text>
          <Text style={styles.listItem}>• Move forward the number of spaces rolled</Text>
          <Text style={styles.listItem}>• First player to complete the board wins!</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Name</Text> - Person or character</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Place</Text> - Country, city, or location</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Animal</Text> - Any animal</Text>
          <Text style={styles.listItem}>• <Text style={styles.bold}>Thing</Text> - Any object</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.listItem}>• No repeating answers during the game</Text>
          <Text style={styles.listItem}>• Answers must start with the target letter</Text>
          <Text style={styles.listItem}>• Spelling isn't crucial, but answers should make sense</Text>
          <Text style={styles.listItem}>• Players move the exact number of spaces rolled</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Winning</Text>
          <Text style={styles.paragraph}>
            The player who reaches the last letter on the game board wins! Keep advancing 
            through the alphabet by giving correct answers and making strategic moves to 
            be the champion of Alphabet Wars!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#4B5563',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: '#4B5563',
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  listItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 24,
    paddingLeft: 8,
  },
  bold: {
    fontFamily: 'Nunito-Bold',
    color: '#818CF8',
  },
});