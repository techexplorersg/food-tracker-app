import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { scheduleWaterReminders } from '../lib/waterReminders';
import { fetchSettings, saveSettings } from '../lib/settingsService';

export default function SettingsScreen() {
  const [dailyLimit, setDailyLimit] = useState('2000');
  const [waterInterval, setWaterInterval] = useState('120');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        setDailyLimit(String(s.dailyCalorieLimit));
        setWaterInterval(String(s.waterReminderIntervalMinutes));
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const limit = parseInt(dailyLimit, 10) || 2000;
      const interval = parseInt(waterInterval, 10) || 120;
      await saveSettings({ dailyCalorieLimit: limit, waterReminderIntervalMinutes: interval });
      await scheduleWaterReminders(interval);
      Alert.alert('Saved', 'Your settings were updated.');
    } catch (e: any) {
      Alert.alert('Could not save', e.message ?? 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Daily calorie limit</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={dailyLimit}
        onChangeText={setDailyLimit}
      />

      <Text style={styles.label}>Water reminder interval (minutes)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={waterInterval}
        onChangeText={setWaterInterval}
      />

      <View style={{ marginTop: 20 }}>
        {saving ? <ActivityIndicator /> : <Button title="Save" onPress={save} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});
