// app/index.tsx
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from './context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  const { userToken, isGuest, continueAsGuest } = useContext(AuthContext);
  
  // If user is already logged in or browsing as guest, redirect to tabs
  useEffect(() => {
    if (userToken || isGuest) {
      router.replace('/(tabs)');
    }
  }, [userToken, isGuest]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>FreeDISC</Text>
        <Text style={styles.subtitle}>Your Disc Golf Companion</Text>
      </View>
      
      <View style={styles.featureContainer}>
        <View style={styles.feature}>
          <Ionicons name="map-outline" size={24} color="#3498db" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Find Courses</Text>
            <Text style={styles.featureText}>Browse and discover disc golf courses near you</Text>
          </View>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="golf-outline" size={24} color="#3498db" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Track Scores</Text>
            <Text style={styles.featureText}>Keep score on your rounds with detailed statistics</Text>
          </View>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="trending-up-outline" size={24} color="#3498db" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Improve Your Game</Text>
            <Text style={styles.featureText}>Analyze your performance and track progress</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => {
            continueAsGuest();
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.mainButtonText}>Browse as Guest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.outlineButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.outlineButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  featureContainer: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  featureIcon: {
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
  mainButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 18,
  },
});