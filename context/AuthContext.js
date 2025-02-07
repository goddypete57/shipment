import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shipments, setShipments] = useState([]);

  // Shipment Functions
  const saveShipment = async (shipmentData) => {
    try {
      setIsLoading(true);
      const isOnline = await NetInfo.fetch().then(state => state.isConnected);
      
      const newShipment = {
        ...shipmentData,
        id: Date.now().toString(),
        status: isOnline ? 'synced' : 'pending',
        created_at: new Date().toISOString(),
      };

      // Get existing shipments
      const existingShipments = await AsyncStorage.getItem('shipments');
      const parsedShipments = existingShipments ? JSON.parse(existingShipments) : [];
      
      // Add new shipment
      const updatedShipments = [...parsedShipments, newShipment];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('shipments', JSON.stringify(updatedShipments));
      setShipments(updatedShipments);

      setIsLoading(false);
      return newShipment;
    } catch (error) {
      console.log('Save shipment error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const getShipments = async () => {
    try {
      setIsLoading(true);
      const storedShipments = await AsyncStorage.getItem('shipments');
      const parsedShipments = storedShipments ? JSON.parse(storedShipments) : [];
      setShipments(parsedShipments);
      setIsLoading(false);
      return parsedShipments;
    } catch (error) {
      console.log('Get shipments error:', error);
      setIsLoading(false);
      return [];
    }
  };

  const updateShipmentStatus = async (id, status) => {
    try {
      const updatedShipments = shipments.map(shipment =>
        shipment.id === id ? { ...shipment, status } : shipment
      );
      
      await AsyncStorage.setItem('shipments', JSON.stringify(updatedShipments));
      setShipments(updatedShipments);
    } catch (error) {
      console.log('Update status error:', error);
      throw error;
    }
  };

  // Load stored shipments on app start
  useEffect(() => {
    getShipments();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        shipments,
        saveShipment,
        getShipments,
        updateShipmentStatus,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
