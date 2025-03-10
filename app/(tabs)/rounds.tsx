//app/(tabs)/rounds.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { api } from '../context/AuthContext';

export default function RoundsScreen() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rounds');
      setRounds(response.data);
    } catch (error) {
      console.error('Error fetching rounds:', error);
      Alert.alert('Error', 'Failed to load rounds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRounds();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const renderRoundItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roundItem}
      onPress={() => router.push(`/rounds/${item.id}`)}
    >
      <View style={styles.roundInfo}>
        <Text style={styles.courseName}>{item.course.name}</Text>
        <Text style={styles.roundDate}>{formatDate(item.date)}</Text>
        
        <View style={styles.scoreContainer}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>
              {item.total_score > 0 ? `+${item.total_score}` : item.total_score}
            </Text>
          </View>
          
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Par</Text>
            <Text style={styles.parValue}>{item.course.par}</Text>
          </View>
          
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Holes</Text>
            <Text style={styles.parValue}>{item.course.holes}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#bdc3c7" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={rounds}
            renderItem={renderRoundItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="golf" size={60} color="#bdc3c7" />
                <Text style={styles.emptyText}>No rounds found</Text>
                <Text style={styles.emptySubtext}>
                  Your played rounds will appear here
                </Text>
              </View>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/rounds/new')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loader: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  roundItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  roundInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  roundDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingRight: 20,
  },
  scoreInfo: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  parValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});