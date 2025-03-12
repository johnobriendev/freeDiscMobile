//app/rounds/[id].tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../context/AuthContext';

export default function RoundDetailScreen() {
  const { id } = useLocalSearchParams();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentHole, setCurrentHole] = useState(1);

  const fetchRound = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rounds/${id}`);
      setRound(response.data);
      
      // If round is in progress, set current hole based on scores
      if (response.data.status === 'IN_PROGRESS' && response.data.players.length > 0) {
        const firstPlayer = response.data.players[0];
        const completedHoles = firstPlayer.scores.filter(
          score => score.strokes > 0
        );
        
        if (completedHoles.length < response.data.course.holes.length) {
          // Find the next hole that needs to be scored
          const nextHoleNumber = completedHoles.length + 1;
          setCurrentHole(nextHoleNumber);
        }
      }
    } catch (error) {
      console.error('Error fetching round:', error);
      Alert.alert('Error', 'Failed to load round details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRound();
    setRefreshing(false);
  }, [fetchRound]);

  useEffect(() => {
    fetchRound();
  }, [fetchRound]);

  const updateScore = async (playerId, holeId, currentStrokes, delta) => {
    const newStrokes = Math.max(0, currentStrokes + delta);

    const endpoint = `/rounds/${id}/players/${playerId}/holes/${holeId}/score`;
    
    
    try {
      const response = await api.patch(endpoint, {
        strokes: newStrokes
      });
      
      // Log successful response
      console.log('Score update response:', response.data);
      
      // Update local state to avoid needing to refetch the entire round
      setRound(prevRound => {
        const updatedPlayers = prevRound.players.map(player => {
          if (player.id === playerId) {
            const updatedScores = player.scores.map(score => {
              if (score.hole.id === holeId) {
                return { ...score, strokes: newStrokes };
              }
              return score;
            });
            return { ...player, scores: updatedScores };
          }
          return player;
        });
        
        return { ...prevRound, players: updatedPlayers };
      });
    } catch (error) {
      console.error('Error updating score:', error);
      // Added more detailed error logging
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update score. Please try again.');
    }
  };

  const finishRound = async () => {
    try {
      await api.put(`/rounds/${id}`, {
        status: 'COMPLETED'
      });
      
      // Update local state
      setRound(prevRound => ({
        ...prevRound,
        status: 'COMPLETED'
      }));
      
      Alert.alert(
        'Round Completed',
        'This round has been marked as completed.',
        [{ text: 'OK', onPress: () => router.replace('/rounds') }]
      );
    } catch (error) {
      console.error('Error finishing round:', error);
      Alert.alert('Error', 'Failed to complete round. Please try again.');
    }
  };

  

  const nextHole = () => {
    if (round?.course?.holes && currentHole < round.course.holes.length) {
      setCurrentHole(currentHole + 1);
    }
  };

  const previousHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
    }
  };

  const getPlayerTotalScore = (player) => {
    if (!player.scores || player.scores.length === 0) return 0;
    
    const totalStrokes = player.scores.reduce((sum, score) => sum + score.strokes, 0);
    const totalPar = player.scores.reduce((sum, score) => sum + (score.hole.par || 0), 0);
    
    return totalStrokes - totalPar;
  };

  const getPlayerScoreForHole = (player, holeNumber) => {
    if (!player.scores) return null;
    
    const holeScore = player.scores.find(
      score => score.hole.holeNumber === holeNumber
    );
    
    return holeScore;
  };

  const getCurrentHole = () => {
    if (!round?.course?.holes) return null;
    
    return round.course.holes.find(
      hole => hole.holeNumber === currentHole
    );
  };

  const calculateCoursePar = () => {
    if (!round?.course?.holes || round.course.holes.length === 0) return 0;
    
    return round.course.holes.reduce((sum, hole) => sum + (hole.par || 0), 0);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!round) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Round not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/rounds')}
        >
          <Text style={styles.backButtonText}>Back to Rounds</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentHoleObj = getCurrentHole();
  const isInProgress = round.status === 'IN_PROGRESS';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Round Header */}
        <View style={styles.roundHeader}>
          <Text style={styles.courseName}>{round.course.name}</Text>
          <Text style={styles.roundDate}>{formatDate(round.date)}</Text>
          <View style={styles.roundInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Holes</Text>
              <Text style={styles.infoValue}>{round.course.holes.length}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Par</Text>
              <Text style={styles.infoValue}>{calculateCoursePar()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[
                styles.infoValue, 
                { color: isInProgress ? '#3498db' : '#27ae60' }
              ]}>
                {isInProgress ? 'In Progress' : 'Completed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Current Hole Section (only if in progress) */}
        {isInProgress && currentHoleObj && (
          <View style={styles.currentHoleCard}>
            <View style={styles.holeNavigation}>
              <TouchableOpacity 
                style={[styles.navButton, currentHole === 1 && styles.navButtonDisabled]} 
                onPress={previousHole}
                disabled={currentHole === 1}
              >
                <Ionicons name="chevron-back" size={24} color={currentHole === 1 ? '#bdc3c7' : '#3498db'} />
                <Text style={[styles.navText, currentHole === 1 && styles.navTextDisabled]}>Previous</Text>
              </TouchableOpacity>
              
              <View style={styles.holeIndicator}>
                <Text style={styles.holeNumber}>Hole {currentHole}</Text>
                <Text style={styles.holePar}>Par {currentHoleObj.par}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.navButton, currentHole === round.course.holes.length && styles.navButtonDisabled]} 
                onPress={nextHole}
                disabled={currentHole === round.course.holes.length}
              >
                <Text style={[styles.navText, currentHole === round.course.holes.length && styles.navTextDisabled]}>Next</Text>
                <Ionicons name="chevron-forward" size={24} color={currentHole === round.course.holes.length ? '#bdc3c7' : '#3498db'} />
              </TouchableOpacity>
            </View>
            
            {/* Scoring Section */}
            {round.players.map(player => {
              const holeScore = getPlayerScoreForHole(player, currentHole);
              return (
                <View key={player.id} style={styles.playerScoreRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  
                  <View style={styles.scoreControls}>
                    <TouchableOpacity 
                      style={[styles.scoreButton, styles.decrementButton]}
                      onPress={() => {
                        if (holeScore && currentHoleObj) {
                          console.log('Decrementing score for:', {
                            player: player.name,
                            hole: currentHole,
                            currentStrokes: holeScore ? holeScore.strokes : 0
                          });
                          updateScore(player.id, currentHoleObj.id, holeScore ? holeScore.strokes : 0, -1);
                        }
                      }}
                      disabled={!holeScore || !currentHoleObj || holeScore.strokes === 0}
                    >
                      <Ionicons name="remove" size={20} color="white" />
                    </TouchableOpacity>
                    
                    <View style={styles.scoreDisplay}>
                      <Text style={styles.scoreText}>{holeScore ? holeScore.strokes : 0}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.scoreButton, styles.incrementButton]}
                      onPress={() => {
                        if (holeScore && currentHoleObj) {
                          console.log('Incrementing score for:', {
                            player: player.name,
                            hole: currentHole,
                            currentStrokes: holeScore ? holeScore.strokes : 0
                          });
                          updateScore(player.id, currentHoleObj.id, holeScore ? holeScore.strokes : 0, 1);
                        }
                      }}
                      disabled={!holeScore || !currentHoleObj}
                    >
                      <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Scorecard */}
        <View style={styles.scorecardContainer}>
          <Text style={styles.scorecardTitle}>Scorecard</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.scorecard}>
              {/* Header Row */}
              <View style={styles.scorecardRow}>
                <View style={[styles.scorecardCell, styles.playerCell]}>
                  <Text style={styles.scorecardHeaderText}>Player</Text>
                </View>
                
                {round.course.holes.map(hole => (
                  <View key={hole.id} style={[
                    styles.scorecardCell, 
                    currentHole === hole.holeNumber && styles.currentHoleCell
                  ]}>
                    <Text style={styles.scorecardHeaderText}>{hole.holeNumber}</Text>
                    <Text style={styles.parText}>Par {hole.par}</Text>
                  </View>
                ))}
                
                <View style={[styles.scorecardCell, styles.totalCell]}>
                  <Text style={styles.scorecardHeaderText}>Total</Text>
                </View>
              </View>
              
              {/* Player Rows */}
              {round.players.map(player => (
                <View key={player.id} style={styles.scorecardRow}>
                  <View style={[styles.scorecardCell, styles.playerCell]}>
                    <Text style={styles.playerNameText}>{player.name}</Text>
                  </View>
                  
                  {round.course.holes.map(hole => {
                    const score = player.scores.find(s => s.hole.id === hole.id);
                    const strokes = score ? score.strokes : 0;
                    const relativeToPar = strokes - hole.par;
                    
                    let scoreStyle = styles.parScore;
                    if (strokes === 0) scoreStyle = styles.noScore;
                    else if (relativeToPar < 0) scoreStyle = styles.underParScore;
                    else if (relativeToPar > 0) scoreStyle = styles.overParScore;
                    
                    return (
                      <View key={hole.id} style={[
                        styles.scorecardCell,
                        currentHole === hole.holeNumber && styles.currentHoleCell
                      ]}>
                        <Text style={[styles.scoreValue, scoreStyle]}>
                          {strokes === 0 ? '-' : strokes}
                        </Text>
                      </View>
                    );
                  })}
                  
                  <View style={[styles.scorecardCell, styles.totalCell]}>
                    <Text style={[
                      styles.totalScore,
                      getPlayerTotalScore(player) < 0 ? styles.underParTotal : 
                      getPlayerTotalScore(player) > 0 ? styles.overParTotal : 
                      styles.parTotal
                    ]}>
                      {getPlayerTotalScore(player) > 0 ? `+${getPlayerTotalScore(player)}` : getPlayerTotalScore(player)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action Button */}
      {isInProgress && (
        <View style={styles.actionButtonContainer}>
          {currentHole === round.course.holes.length ? (
            // Only show "Finish Round" on the last hole
            <TouchableOpacity 
              style={styles.finishButton}
              onPress={() => {
                // Add confirmation dialog to prevent accidental completion
                Alert.alert(
                  'Finish Round',
                  'Are you sure you want to complete this round? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Finish Round', onPress: finishRound }
                  ]
                );
              }}
            >
              <Text style={styles.finishButtonText}>Finish Round</Text>
            </TouchableOpacity>
          ) : (
            // Show "Next Hole" button for all other holes
            <TouchableOpacity 
              style={styles.nextHoleButton}
              onPress={nextHole}
            >
              <Text style={styles.nextHoleButtonText}>Next Hole</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
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
    color: '#e74c3c',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  roundHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  roundDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  roundInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  infoItem: {
    marginRight: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  currentHoleCard: {
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
  holeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },
  navTextDisabled: {
    color: '#bdc3c7',
  },
  holeIndicator: {
    alignItems: 'center',
  },
  holeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  holePar: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  playerScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#e74c3c',
  },
  incrementButton: {
    backgroundColor: '#3498db',
  },
  scoreDisplay: {
    width: 50,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scorecardContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scorecardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  scorecard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  scorecardRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scorecardCell: {
    width: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  playerCell: {
    width: 100,
    alignItems: 'flex-start',
  },
  totalCell: {
    width: 60,
    backgroundColor: '#f5f6fa',
  },
  currentHoleCell: {
    backgroundColor: '#ecf0f1',
  },
  scorecardHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50',
  },
  parText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  playerNameText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noScore: {
    color: '#7f8c8d',
  },
  parScore: {
    color: '#2c3e50',
  },
  underParScore: {
    color: '#27ae60',
  },
  overParScore: {
    color: '#e74c3c',
  },
  totalScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  parTotal: {
    color: '#2c3e50',
  },
  underParTotal: {
    color: '#27ae60',
  },
  overParTotal: {
    color: '#e74c3c',
  },
  actionButtonContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  finishButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextHoleButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextHoleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});