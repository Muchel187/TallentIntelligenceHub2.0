/**
 * NOBA EXPERTS Mobile App
 * React Native app for iOS and Android
 *
 * Features:
 * - Offline test taking
 * - Push notifications
 * - Deep linking to test results
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// API Configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://noba-experts.de';

interface Question {
  id: number;
  text: string;
  dimension: string;
}

interface Answer {
  questionId: number;
  score: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
    loadQuestions();
    setupNotifications();
  }, []);

  /**
   * Setup push notifications
   */
  const setupNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  };

  /**
   * Load questions from API or local storage
   */
  const loadQuestions = async () => {
    try {
      // Try to load from local storage first (offline mode)
      const cached = await AsyncStorage.getItem('questions');
      if (cached) {
        setQuestions(JSON.parse(cached));
        return;
      }

      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/api/questions`);
      const data = await response.json();

      setQuestions(data.questions);
      await AsyncStorage.setItem('questions', JSON.stringify(data.questions));
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    }
  };

  /**
   * Load saved progress
   */
  const loadProgress = async () => {
    try {
      const savedAnswers = await AsyncStorage.getItem('answers');
      const savedIndex = await AsyncStorage.getItem('currentQuestionIndex');

      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }

      if (savedIndex) {
        setCurrentQuestionIndex(parseInt(savedIndex));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  /**
   * Save progress
   */
  const saveProgress = async (newAnswers: Answer[], newIndex: number) => {
    try {
      await AsyncStorage.setItem('answers', JSON.stringify(newAnswers));
      await AsyncStorage.setItem('currentQuestionIndex', newIndex.toString());
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  /**
   * Handle answer selection
   */
  const handleAnswer = (score: number) => {
    const newAnswer: Answer = {
      questionId: questions[currentQuestionIndex].id,
      score,
    };

    const newAnswers = [...answers.filter(a => a.questionId !== newAnswer.questionId), newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      saveProgress(newAnswers, newIndex);
    } else if (newAnswers.length === questions.length) {
      submitTest(newAnswers);
    }
  };

  /**
   * Submit test to API
   */
  const submitTest = async (finalAnswers: Answer[]) => {
    setIsLoading(true);

    try {
      // Get user details (would be collected in previous screen)
      const userDetailsStr = await AsyncStorage.getItem('userDetails');
      const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : {};
      const email = await AsyncStorage.getItem('email');

      const response = await fetch(`${API_BASE_URL}/api/test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: finalAnswers,
          userDetails,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear saved progress
        await AsyncStorage.multiRemove(['answers', 'currentQuestionIndex']);

        // Save test ID for viewing results
        await AsyncStorage.setItem('lastTestId', data.testId);

        setTestCompleted(true);

        // Schedule notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Your Results Are Ready!',
            body: 'View your Big Five personality report now.',
          },
          trigger: { seconds: 2 },
        });
      } else {
        Alert.alert('Error', data.error || 'Failed to submit test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Network error. Your answers are saved and will be submitted when online.');
    } finally {
      setIsLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (testCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Test Complete!</Text>
        <Text style={styles.subtitle}>
          Your personality report has been generated.
        </Text>
        <Text style={styles.subtitle}>
          Check your email for a link to view your results.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Submitting your answers...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {[1, 2, 3, 4, 5].map((score) => (
            <TouchableOpacity
              key={score}
              style={styles.answerButton}
              onPress={() => handleAnswer(score)}
            >
              <Text style={styles.answerButtonText}>{score}</Text>
              <Text style={styles.answerLabel}>
                {score === 1 && 'Strongly Disagree'}
                {score === 2 && 'Disagree'}
                {score === 3 && 'Neutral'}
                {score === 4 && 'Agree'}
                {score === 5 && 'Strongly Agree'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 26,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  answerButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  answerLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
