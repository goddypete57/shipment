import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveShipment } from '../services/StorageService';
import NetInfo from '@react-native-community/netinfo';

export const CreateShipmentScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState({
    origin: '',
    destination: '',
    weight: '',
    description: '',
  });

  const handleSubmit = async () => {
    if (!shipmentData.origin || !shipmentData.destination || !shipmentData.weight) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const isOnline = await NetInfo.fetch().then(state => state.isConnected);
      
      await saveShipment({
        ...shipmentData,
        weight: parseFloat(shipmentData.weight),
      });

      Alert.alert(
        'Success',
        isOnline 
          ? 'Shipment created and synced!'
          : 'Shipment saved offline. Will sync when online',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create shipment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Origin *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={shipmentData.origin}
          placeholderTextColor={'#000'}
          onChangeText={(text) => setShipmentData({ ...shipmentData, origin: text })}
        />

        <Text style={styles.label}>Destination *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter delivery location"
          value={shipmentData.destination}
          placeholderTextColor={'#000'}
          onChangeText={(text) => setShipmentData({ ...shipmentData, destination: text })}
        />

        <Text style={styles.label}>Weight (kg) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter package weight"
          keyboardType="numeric"
          placeholderTextColor={'#000'}
          value={shipmentData.weight}
          onChangeText={(text) => setShipmentData({ ...shipmentData, weight: text })}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter package description"
          multiline
          numberOfLines={4}
          placeholderTextColor={'#000'}
          value={shipmentData.description}
          onChangeText={(text) => setShipmentData({ ...shipmentData, description: text })}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create Shipment'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 