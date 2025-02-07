import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  description: string;
  status: 'pending' | 'synced';
  created_at: string;
}

const SHIPMENTS_KEY = '@shipments';
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API endpoint

export const saveShipment = async (shipmentData: Omit<Shipment, 'id' | 'status' | 'created_at'>) => {
  try {
    const isOnline = await NetInfo.fetch().then(state => state.isConnected);
    
    const newShipment: Shipment = {
      ...shipmentData,
      id: Date.now().toString(),
      status: isOnline ? 'synced' : 'pending',
      created_at: new Date().toISOString(),
    };

    const existingShipments = await getShipments();
    const updatedShipments = [...existingShipments, newShipment];
    
    await AsyncStorage.setItem(SHIPMENTS_KEY, JSON.stringify(updatedShipments));
    
    return newShipment;
  } catch (error) {
    console.error('Error saving shipment:', error);
    throw error;
  }
};

export const getShipments = async (): Promise<Shipment[]> => {
  try {
    const shipments = await AsyncStorage.getItem(SHIPMENTS_KEY);
    return shipments ? JSON.parse(shipments) : [];
  } catch (error) {
    console.error('Error getting shipments:', error);
    return [];
  }
};

export const getPendingShipments = async (): Promise<Shipment[]> => {
  const shipments = await getShipments();
  return shipments.filter(shipment => shipment.status === 'pending');
};

export const updateShipmentStatus = async (id: string, status: 'pending' | 'synced') => {
  try {
    const shipments = await getShipments();
    const updatedShipments = shipments.map(shipment => 
      shipment.id === id ? { ...shipment, status } : shipment
    );
    
    await AsyncStorage.setItem(SHIPMENTS_KEY, JSON.stringify(updatedShipments));
  } catch (error) {
    console.error('Error updating shipment:', error);
    throw error;
  }
};

export const syncPendingShipments = async () => {
  try {
    const shipments = await getShipments();
    const pendingShipments = shipments.filter(s => s.status === 'pending');
    
    for (const shipment of pendingShipments) {
      try {
        // Using JSONPlaceholder to simulate API calls
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Shipment from ${shipment.origin} to ${shipment.destination}`,
            body: shipment.description,
            userId: 1, // Required by JSONPlaceholder
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Sync success:', result);
          await updateShipmentStatus(shipment.id, 'synced');
        }
      } catch (error) {
        console.error('Failed to sync shipment:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}; 