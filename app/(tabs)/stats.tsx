import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../context/AuthContext';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      Alert.alert('Error', 'Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!stats || !stats.totalRounds) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart" size={60} color="#bdc3c7" />
          <Text style={styles.emptyText}>No stats available</Text>
          <Text style={styles.emptySubtext}>
            Play some rounds to see your statistics
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.summaryContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsHeaderText}>Your Statistics</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalRounds}</Text>
            <Text style={styles.statLabel}>Total Rounds</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCourses}</Text>
            <Text style={styles.statLabel}>Courses Played</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalHolesPlayed}</Text>
            <Text style={styles.statLabel}>Holes Played</Text>
          </View>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.sectionTitle}>Scoring</Text>
        
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreColumn}>
              <Text style={styles.scoreLabel}>Average Score</Text>
              <Text style={styles.scoreValue}>
                {stats.averageScore > 0 ? `+${stats.averageScore.toFixed(1)}` : stats.averageScore.toFixed(1)}
              </Text>
            </View>
            
            <View style={styles.scoreColumn}>
              <Text style={styles.scoreLabel}>Best Round</Text>
              <Text style={styles.scoreValue}>
                {stats.bestScore > 0 ? `+${stats.bestScore}` : stats.bestScore}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreBreakdown}>
          <Text style={styles.breakdownTitle}>Score Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#9b59b6' }]} />
              <Text style={styles.breakdownLabel}>Ace</Text>
              <Text style={styles.breakdownValue}>{stats.scoreBreakdown?.ace || 0}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#3498db' }]} />
              <Text style={styles.breakdownLabel}>Birdie</Text>
              <Text style={styles.breakdownValue}>{stats.scoreBreakdown?.birdie || 0}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#2ecc71' }]} />
              <Text style={styles.breakdownLabel}>Par</Text>
              <Text style={styles.breakdownValue}>{stats.scoreBreakdown?.par || 0}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#e67e22' }]} />
              <Text style={styles.breakdownLabel}>Bogey</Text>
              <Text style={styles.breakdownValue}>{stats.scoreBreakdown?.bogey || 0}</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.breakdownLabel}>Double+</Text>
              <Text style={styles.breakdownValue}>{stats.scoreBreakdown?.double_plus || 0}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.frequentContainer}>
        <Text style={styles.sectionTitle}>Most Played Courses</Text>
        
        {stats.mostPlayedCourses?.length > 0 ? (
          stats.mostPlayedCourses.map((course, index) => (
            <View key={index} style={styles.courseItem}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseCount}>{course.count} rounds</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No course data available</Text>
        )}
      </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsHeader: {
    backgroundColor: '#3498db',
    padding: 15,
  },
  statsHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  scoreContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
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
  scoreCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: 'row',
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scoreBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 15,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  frequentContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 30,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  courseName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  courseCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    padding: 20,
  },
});