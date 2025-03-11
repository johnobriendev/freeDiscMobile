//app/courses/create.tsx

import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';

export default function CreateCourseScreen() {
  const { userToken } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfHoles, setNumberOfHoles] = useState('18');
  const [prevNumberOfHoles, setPrevNumberOfHoles] = useState('18'); // Track previous value

  
  // Array to hold hole details
  const [holes, setHoles] = useState(Array(18).fill(null).map((_, index) => ({
    holeNumber: index + 1,
    par: 3,
    lengthFeet: ''
  })));

  // Check if user is logged in
  if (!userToken) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Ionicons name="lock-closed" size={50} color="#bdc3c7" />
          <Text style={styles.authPromptTitle}>Sign In Required</Text>
          <Text style={styles.authPromptText}>
            You need to sign in to create a course
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/login?returnTo=courses/create')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const updateHole = (index, field, value) => {
    const newHoles = [...holes];
    
    if (field === 'par') {
      // For par field, handle empty value gracefully
      const parsedValue = value === '' ? '' : Number(value);
      newHoles[index] = {
        ...newHoles[index],
        [field]: parsedValue
      };
    } else if (field === 'lengthFeet') {
      // For lengthFeet field
      const parsedValue = value === '' ? '' : Number(value);
      newHoles[index] = {
        ...newHoles[index],
        [field]: parsedValue
      };
    } else {
      // For other fields
      newHoles[index] = {
        ...newHoles[index],
        [field]: value
      };
    }
    
    setHoles(newHoles);
  };
  

  const updateNumberOfHoles = (value) => {
    // Always update the input value
    setNumberOfHoles(value);
    
    // Only process valid numbers for hole array adjustment
    if (value === '') {
      // Don't adjust holes for empty input
      return;
    }
    
    const num = parseInt(value) || 0;
    // Limit to reasonable range
    if (num > 0 && num <= 36) {
      setPrevNumberOfHoles(value); // Store valid value
      
      // Adjust holes array
      if (num > holes.length) {
        // Add more holes
        const additionalHoles = Array(num - holes.length).fill(null).map((_, i) => ({
          holeNumber: holes.length + i + 1,
          par: 3,
          lengthFeet: ''
        }));
        setHoles([...holes, ...additionalHoles]);
      }
    }
  };

  const validateCourse = () => {
    if (!courseName.trim()) {
      Alert.alert('Error', 'Please enter a course name');
      return false;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }
    
    const numHoles = parseInt(numberOfHoles);
    if (isNaN(numHoles) || numHoles <= 0) {
      Alert.alert('Error', 'Please enter a valid number of holes');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCourse()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the actual number of holes (default to 18 if empty)
      const numHoles = numberOfHoles ? parseInt(numberOfHoles) : 18;
      
      console.log("Submitting course with", numHoles, "holes");
      console.log("Hole data before submission:", holes.slice(0, numHoles));
      
      // Format the data for the API
      const courseData = {
        name: courseName,
        location: location,
        description: description,
        holes: holes.slice(0, numHoles).map(hole => {
          console.log(`Processing hole ${hole.holeNumber}, par=${hole.par}`);
          return {
            holeNumber: hole.holeNumber,
            par: typeof hole.par === 'number' ? hole.par : 3, // Ensure par is a number
            lengthFeet: hole.lengthFeet === '' ? null : hole.lengthFeet
          };
        })
      };
      
      // Send to API
      const response = await api.post('/courses', courseData);
      
      Alert.alert(
        'Success',
        'Course created successfully',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace(`/courses/${response.data.id}`) 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating course:', error);
      Alert.alert(
        'Error',
        'Failed to create course. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Course Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Course Name*</Text>
            <TextInput
              style={styles.input}
              value={courseName}
              onChangeText={setCourseName}
              placeholder="Enter course name"
              placeholderTextColor="#a0a0a0"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location*</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, State"
              placeholderTextColor="#a0a0a0"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Course description (optional)"
              placeholderTextColor="#a0a0a0"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Holes*</Text>
            <TextInput
              style={styles.input}
              value={numberOfHoles}
              onChangeText={updateNumberOfHoles}
              placeholder="18"
              placeholderTextColor="#a0a0a0"
              keyboardType="number-pad"
            />
          </View>
        </View>
        
        {/* Hole Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hole Details</Text>
          <Text style={styles.sectionSubtitle}>
            Set par and length for each hole (length is optional)
          </Text>
          
          {holes.slice(0, parseInt(numberOfHoles) || holes.length).map((hole, index) => (
            <View key={index} style={styles.holeRow}>
              <View style={styles.holeNumber}>
                <Text style={styles.holeNumberText}>{hole.holeNumber}</Text>
              </View>
              
              <View style={styles.holeInputs}>
                <View style={styles.holeInputGroup}>
                  <Text style={styles.holeInputLabel}>Par</Text>
                  <TextInput
                    style={styles.holeInput}
                    value={hole.par.toString()}
                    onChangeText={(value) => updateHole(index, 'par', value)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                </View>
                
                <View style={styles.holeInputGroup}>
                  <Text style={styles.holeInputLabel}>Length (ft)</Text>
                  <TextInput
                    style={styles.holeInput}
                    value={hole.lengthFeet ? hole.lengthFeet.toString() : ''}
                    onChangeText={(value) => updateHole(index, 'lengthFeet', value)}
                    keyboardType="number-pad"
                    placeholder="Optional"
                    placeholderTextColor="#a0a0a0"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Course</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContent: {
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
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 100,
  },
  holeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  holeInputs: {
    flex: 1,
    flexDirection: 'row',
  },
  holeInputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  holeInputLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  holeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  authPromptText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  authButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
