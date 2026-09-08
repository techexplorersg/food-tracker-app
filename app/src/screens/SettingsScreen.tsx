import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { scheduleWaterReminders } from '../lib/waterReminders';

export default function SettingsScreen() {
  const [dailyLimit, setDailyLimit] = useState('2000');
  const [waterInterval, setWaterInterval] = useState('120');

  async function save() {
    // TODO: persist to Supabase `user_settings` table (see backend/schema.sql)
    await scheduleWaterReminders(parseInt(waterInterval, 10));
  }

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

      <Button title="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});
