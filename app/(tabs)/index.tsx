import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{user?.username ? `, ${user.username}` : ''}!
        </Text>
        <Text style={styles.subtitleText}>
          What would you like to do today?
        </Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/rounds/new')}
        >
          <Ionicons name="add-circle" size={36} color="#3498db" />
          <Text style={styles.actionTitle}>New Round</Text>
          <Text style={styles.actionSubtitle}>Start keeping score</Text>
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
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/stats')}
        >
          <Ionicons name="stats-chart" size={36} color="#9b59b6" />
          <Text style={styles.actionTitle}>View Stats</Text>
          <Text style={styles.actionSubtitle}>Track performance</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={36} color="#e74c3c" />
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionSubtitle}>Manage account</Text>
        </TouchableOpacity>
      </View>

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
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
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
});