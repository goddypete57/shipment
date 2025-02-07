import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShipmentListScreen } from './src/screens/ShipmentListScreen';
import { CreateShipmentScreen } from './src/screens/CreateShipmentScreen';
import { SplashScreen } from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Splash"
       screenOptions={{
         headerShown: false,
       }}
      >

      <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ShipmentList" 
          component={ShipmentListScreen}
          options={{
            title: 'My Shipments',
            headerTitleStyle: {
              color: '#000',
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="CreateShipment" 
          component={CreateShipmentScreen}
          options={{
            title: 'Create Shipment',
            headerTitleStyle: {
              color: '#000',
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}