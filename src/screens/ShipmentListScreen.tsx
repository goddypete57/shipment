import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getShipments, Shipment, syncPendingShipments } from '../services/StorageService';
import NetInfo from '@react-native-community/netinfo';

export const ShipmentListScreen = () => {
  const navigation = useNavigation();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadShipments = async () => {
    const data = await getShipments();
    setShipments(data.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShipments();
    const isOnline = await NetInfo.fetch().then(state => state.isConnected);
    if (isOnline) {
      await syncPendingShipments();
      await loadShipments(); // Reload after sync
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadShipments();

    // Set up network listener for auto-sync
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPendingShipments().then(() => loadShipments());
      }
    });

    // Add focus listener to reload shipments when returning to this screen
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadShipments();
    });

    return () => {
      unsubscribe();
      unsubscribeFocus();
    };
  }, [navigation]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Shipments Yet</Text>
      <Text style={styles.emptyText}>
        Tap the + button below to create your first shipment
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.shipmentCard}>
      <View style={styles.shipmentHeader}>
        <Text style={styles.shipmentId}>#{item.id}</Text>
        <Text style={[
          styles.status,
          { color: item.status === 'pending' ? '#FFA500' : '#4CAF50' }
        ]}>
          {item.status === 'pending' ? 'Pending' : 'Completed'}
        </Text>
      </View>
      <View style={styles.shipmentDetails}>
        <View style={styles.locationContainer}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.location}>{item.origin}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.location}>{item.destination}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shipments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateShipment')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  shipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  shipmentDetails: {
    gap: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 50,
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 