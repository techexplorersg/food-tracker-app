import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../../App';
import { Meal, PackagedFoodScanResult, UserSettings } from '../types';
import { calculateDailyTotal } from '../lib/nutrition';
import { fetchTodaysMeals } from '../lib/mealService';
import { fetchTodaysScans } from '../lib/scanService';
import { fetchSettings } from '../lib/settingsService';

type Props = NativeStackScreenProps<RootStackParamList, 'MealLog'>;

type LogRow = { key: string; label: string; calories: number };

export default function MealLogScreen({ navigation }: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [scans, setScans] = useState<PackagedFoodScanResult[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    dailyCalorieLimit: 2000,
    waterReminderIntervalMinutes: 120,
  });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, s, cfg] = await Promise.all([fetchTodaysMeals(), fetchTodaysScans(), fetchSettings()]);
      setMeals(m);
      setScans(s);
      setSettings(cfg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh every time this screen comes back into focus (e.g. after saving a meal)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const mealCalories = calculateDailyTotal(meals);
  const scanCalories = scans.reduce((sum, s) => sum + (s.caloriesPer100g ?? 0), 0);
  const total = mealCalories + scanCalories;
  const remaining = settings.dailyCalorieLimit - total;

  const rows: LogRow[] = [
    ...meals.map((m) => ({
      key: m.id,
      label: m.items.map((i) => i.name).join(', ') || 'Meal',
      calories: m.totalCalories,
    })),
    ...scans.map((s, i) => ({
      key: `scan-${i}`,
      label: s.productName,
      calories: Math.round(s.caloriesPer100g ?? 0),
    })),
  ];

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
        data={rows}
        keyExtractor={(row) => row.key}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.mealRow}>
            <Text style={{ flex: 1 }} numberOfLines={1}>
              {item.label}
            </Text>
            <Text>{item.calories} kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No meals logged yet today. Pull down to refresh.</Text>}
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
