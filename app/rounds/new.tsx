import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function NewRoundScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [playerNames, setPlayerNames] = useState(['']); // Start with one empty player
  const [isCreating, setIsCreating] = useState(false);

  // If a courseId was passed in params, use that as the initial selected course
  useEffect(() => {
    if (params.courseId) {
      setSelectedCourse(params.courseId);
    }
  }, [params.courseId]);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses');
        setCourses(response.data);
        
        // If no course is selected yet and we have courses, select the first one
        if (!selectedCourse && response.data.length > 0) {
          setSelectedCourse(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        Alert.alert('Error', 'Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const updatePlayerName = (text, index) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = text;
    setPlayerNames(newPlayerNames);
  };

  const removePlayer = (index) => {
    if (playerNames.length > 1) {
      const newPlayerNames = [...playerNames];
      newPlayerNames.splice(index, 1);
      setPlayerNames(newPlayerNames);
    }
  };

  const createRound = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    // Filter out empty player names
    const filteredPlayerNames = playerNames.filter(name => name.trim() !== '');
    
    if (filteredPlayerNames.length === 0) {
      Alert.alert('Error', 'Please add at least one player');
      return;
    }

    try {
      setIsCreating(true);
      
      const response = await api.post('/rounds', {
        courseId: selectedCourse,
        date: new Date().toISOString(),
        playerNames: filteredPlayerNames.slice(1), // Remove the first player (which is the current user)
      });
      
      // Navigate to the round detail page to start scoring
      router.replace(`/rounds/${response.data.id}`);
    } catch (error) {
      console.error('Error creating round:', error);
      Alert.alert('Error', 'Failed to create round. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Course</Text>
          <View style={styles.pickerContainer}>
            {courses.length > 0 ? (
              <Picker
                selectedValue={selectedCourse}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCourse(itemValue)}
              >
                {courses.map((course) => (
                  <Picker.Item
                    key={course.id}
                    label={`${course.name} (${course.holes} holes)`}
                    value={course.id}
                  />
                ))}
              </Picker>
            ) : (
              <Text style={styles.noCourses}>No courses available. Please create a course first.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Players</Text>
          <Text style={styles.sectionSubtitle}>You will be added automatically</Text>
          
          {playerNames.map((name, index) => (
            <View key={index} style={styles.playerRow}>
              <TextInput
                style={styles.playerInput}
                value={name}
                onChangeText={(text) => updatePlayerName(text, index)}
                placeholder={index === 0 ? "Your name (automatically added)" : `Player ${index + 1}`}
                placeholderTextColor="#7f8c8d"
                editable={index !== 0} // First player is the current user
              />
              {index > 0 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePlayer(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
            <Ionicons name="add-circle" size={20} color="#3498db" />
            <Text style={styles.addPlayerText}>Add another player</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.createButton, (!selectedCourse || isCreating) && styles.createButtonDisabled]}
          onPress={createRound}
          disabled={!selectedCourse || isCreating}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Start Round</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
  },
  noCourses: {
    padding: 15,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
  },
  addPlayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addPlayerText: {
    color: '#3498db',
    fontSize: 16,
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});