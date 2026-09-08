import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { classifyFood, ClassificationCandidate } from '../lib/foodClassifier';
import { FoodItem } from '../types';

/**
 * Lets the user take/upload one or more photos of a meal (e.g. main plate,
 * side dish, dessert), runs the on-device classifier on each, and hands off
 * to a confirm/edit step before saving. See ARCHITECTURE.md hard part #1 —
 * portion size here is always a user-confirmed estimate, never treated as
 * an exact measurement.
 */
export default function CameraScreen() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<ClassificationCandidate[]>([]);

  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotos((prev) => [...prev, uri]);
      const detected = await classifyFood(uri);
      setCandidates((prev) => [...prev, ...detected]);
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotos((prev) => [...prev, uri]);
      const detected = await classifyFood(uri);
      setCandidates((prev) => [...prev, ...detected]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        Add a photo for each plate (main dish, side, dessert...).
      </Text>

      <View style={styles.buttonRow}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Upload Photo" onPress={pickFromLibrary} />
      </View>

      <FlatList
        data={photos}
        horizontal
        keyExtractor={(uri) => uri}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumb} />
        )}
      />

      {candidates.length > 0 && (
        <View style={styles.candidates}>
          <Text style={styles.sectionTitle}>Detected — confirm below:</Text>
          {candidates.map((c, i) => (
            <Text key={i}>
              {c.label} ({Math.round(c.confidence * 100)}% confidence)
            </Text>
          ))}
          {/*
            TODO (Phase 3, see ROADMAP.md): render an editable portion-size
            slider per candidate, let the user delete wrong detections and
            add missed ones, then compute calories via nutrition.ts and
            save the Meal to Supabase.
          */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hint: { marginBottom: 12, color: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  thumb: { width: 80, height: 80, marginRight: 8, borderRadius: 8 },
  candidates: { marginTop: 20 },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
});
