import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MealLogScreen from './src/screens/MealLogScreen';
import CameraScreen from './src/screens/CameraScreen';
import BarcodeScanScreen from './src/screens/BarcodeScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { scheduleWaterReminders } from './src/lib/waterReminders';

export type RootStackParamList = {
  MealLog: undefined;
  Camera: { mealId?: string } | undefined;
  BarcodeScan: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Local-only notifications — no backend involved, no cost.
    scheduleWaterReminders();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MealLog">
        <Stack.Screen
          name="MealLog"
          component={MealLogScreen}
          options={{ title: "Today's Meals" }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: 'Log a Meal' }}
        />
        <Stack.Screen
          name="BarcodeScan"
          component={BarcodeScanScreen}
          options={{ title: 'Scan Packaged Food' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
