import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, userToken, isGuest } = useContext(AuthContext);
  const isAuthenticated = !!userToken;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {isAuthenticated ? (
          <Text style={styles.welcomeText}>
            Welcome{user?.firstName ? `, ${user.firstName}` : ''}!
          </Text>
        ) : (
          <Text style={styles.welcomeText}>Welcome to FreeDISC!</Text>
        )}
        
        <Text style={styles.subtitleText}>
          {isAuthenticated 
            ? 'What would you like to do today?' 
            : 'You are browsing as a guest. Sign in to track your rounds!'}
        </Text>
        
        {isGuest && !isAuthenticated && (
          <View style={styles.guestBanner}>
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authButton, styles.registerButton]}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.authButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionCard, 
            !isAuthenticated && styles.disabledCard
          ]}
          onPress={() => {
            if (isAuthenticated) {
              router.push('/rounds/new');
            } else {
              router.push('/login?returnTo=rounds/new');
            }
          }}
        >
          <Ionicons 
            name="add-circle" 
            size={36} 
            color={isAuthenticated ? "#3498db" : "#bdc3c7"} 
          />
          <Text style={[
            styles.actionTitle,
            !isAuthenticated && styles.disabledText
          ]}>New Round</Text>
          <Text style={[
            styles.actionSubtitle,
            !isAuthenticated && styles.disabledSubtext
          ]}>
            {isAuthenticated ? "Start keeping score" : "Sign in to start"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/courses')}
        >
          <Ionicons name="map" size={36} color="#2ecc71" />
          <Text style={styles.actionTitle}>Find Courses</Text>
          <Text style={styles.actionSubtitle}>Browse courses</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.actionCard, 
            !isAuthenticated && styles.disabledCard
          ]}
          onPress={() => {
            if (isAuthenticated) {
              router.push('/(tabs)/stats');
            } else {
              router.push('/login?returnTo=(tabs)/stats');
            }
          }}
        >
          <Ionicons 
            name="stats-chart" 
            size={36} 
            color={isAuthenticated ? "#9b59b6" : "#bdc3c7"} 
          />
          <Text style={[
            styles.actionTitle,
            !isAuthenticated && styles.disabledText
          ]}>View Stats</Text>
          <Text style={[
            styles.actionSubtitle,
            !isAuthenticated && styles.disabledSubtext
          ]}>
            {isAuthenticated ? "Track performance" : "Sign in to view"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons 
            name="person" 
            size={36} 
            color="#e74c3c" 
          />
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionSubtitle}>
            {isAuthenticated ? "Manage account" : "Sign in/Register"}
          </Text>
        </TouchableOpacity>
      </View>

      {isAuthenticated && (
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No recent activity</Text>
            <Text style={styles.emptyStateSubtext}>
              Start a round to see your activity here
            </Text>
          </View>
        </View>
      )}

      {!isAuthenticated && (
        <View style={styles.featurePromoContainer}>
          <Text style={styles.sectionTitle}>Why Create an Account?</Text>
          
          <View style={styles.featurePromo}>
            <Ionicons name="golf-outline" size={24} color="#3498db" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Track Your Games</Text>
              <Text style={styles.featureText}>Save your scores and track progress over time</Text>
            </View>
          </View>
          
          <View style={styles.featurePromo}>
            <Ionicons name="analytics-outline" size={24} color="#3498db" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Personalized Stats</Text>
              <Text style={styles.featureText}>Get insights into your game with detailed analytics</Text>
            </View>
          </View>
          
          <View style={styles.featurePromo}>
            <Ionicons name="people-outline" size={24} color="#3498db" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Play with Friends</Text>
              <Text style={styles.featureText}>Invite friends and compare scores</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  guestBanner: {
    flexDirection: 'row',
    marginTop: 15,
  },
  authButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: '#2ecc71',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '47%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledCard: {
    backgroundColor: '#f8f9fa',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  disabledText: {
    color: '#95a5a6',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  disabledSubtext: {
    color: '#bdc3c7',
  },
  recentActivityContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featurePromoContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  featurePromo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  featureIcon: {
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  featureText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});