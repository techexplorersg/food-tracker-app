import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import { Meal, UserSettings } from '../types';
import { calculateDailyTotal, remainingCalories } from '../lib/nutrition';

type Props = NativeStackScreenProps<RootStackParamList, 'MealLog'>;

// TODO: replace with real data fetched from Supabase (meals for today).
const mockMeals: Meal[] = [];
const mockSettings: UserSettings = {
  dailyCalorieLimit: 2000,
  waterReminderIntervalMinutes: 120,
};

export default function MealLogScreen({ navigation }: Props) {
  const [meals] = useState<Meal[]>(mockMeals);

  const total = calculateDailyTotal(meals);
  const remaining = remainingCalories(mockSettings.dailyCalorieLimit, meals);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{total} kcal logged today</Text>
        <Text style={styles.summarySub}>
          {remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over limit`}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Log a Meal" onPress={() => navigation.navigate('Camera')} />
        <Button title="Scan Barcode" onPress={() => navigation.navigate('BarcodeScan')} />
      </View>

      <FlatList
        data={meals}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={styles.mealRow}>
            <Text>{item.items.map((i) => i.name).join(', ')}</Text>
            <Text>{item.totalCalories} kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No meals logged yet today.</Text>}
      />

      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  summary: { marginBottom: 20, alignItems: 'center' },
  summaryText: { fontSize: 24, fontWeight: '700' },
  summarySub: { color: '#666', marginTop: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  empty: { color: '#999', textAlign: 'center', marginTop: 40 },
});
