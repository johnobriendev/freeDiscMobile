import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const startNewRound = () => {
    if (!userToken) {
      Alert.alert(
        'Sign In Required',
        'You need to sign in to start a round',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    router.push({
      pathname: '/rounds/new',
      params: { courseId: id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate total par
  const totalPar = course.holes.reduce((sum, hole) => sum + hole.par, 0);
  
  // Calculate total length if available
  let totalLength = 0;
  const holesWithLength = course.holes.filter(hole => hole.lengthFeet !== null);
  if (holesWithLength.length > 0) {
    totalLength = holesWithLength.reduce((sum, hole) => sum + (hole.lengthFeet || 0), 0);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseLocation}>{course.location}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="flag-outline" size={20} color="#3498db" />
            <Text style={styles.infoLabel}>Holes</Text>
            <Text style={styles.infoValue}>{course.holes.length}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="golf-outline" size={20} color="#3498db" />
            <Text style={styles.infoLabel}>Par</Text>
            <Text style={styles.infoValue}>{totalPar}</Text>
          </View>
          {totalLength > 0 && (
            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={20} color="#3498db" />
              <Text style={styles.infoLabel}>Length</Text>
              <Text style={styles.infoValue}>{totalLength}ft</Text>
            </View>
          )}
        </View>
      </View>

      {course.description && (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About this course</Text>
          <Text style={styles.descriptionText}>{course.description}</Text>
        </View>
      )}

      <View style={styles.holeListContainer}>
        <Text style={styles.sectionTitle}>Hole Details</Text>
        {course.holes.map((hole) => (
          <View key={hole.id} style={styles.holeItem}>
            <View style={styles.holeNumber}>
              <Text style={styles.holeNumberText}>{hole.holeNumber}</Text>
            </View>
            <View style={styles.holeDetails}>
              <Text style={styles.holePar}>Par {hole.par}</Text>
              {hole.lengthFeet && (
                <Text style={styles.holeDistance}>{hole.lengthFeet}ft</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startNewRound}>
        <Text style={styles.startButtonText}>Start New Round</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#e74c3c',
  },
  backLink: {
    color: '#3498db',
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  courseLocation: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  holeListContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  holeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  holeNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  holeNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  holeDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holePar: {
    fontSize: 16,
    color: '#2c3e50',
  },
  holeDistance: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  startButton: {
    backgroundColor: '#3498db',
    margin: 15,
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
});