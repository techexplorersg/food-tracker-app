import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import { classifyFood } from '../lib/foodClassifier';
import { createMealWithItems } from '../lib/mealService';
import { FoodItem } from '../types';

// Rough starting-point calories/100g for common detected labels, used only
// until the user picks a real USDA match. See lib/usda.ts for real lookups
// — wiring per-item USDA search into this screen is a good next iteration.
const FALLBACK_CALORIES_PER_100G: Record<string, number> = {
  'grilled chicken breast': 165,
  'steamed rice': 130,
  broccoli: 34,
};

export default function CameraScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [saving, setSaving] = useState(false);

  async function addPhotoAndClassify(pickFn: () => Promise<ImagePicker.ImagePickerResult>) {
    const result = await pickFn();
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setPhotos((prev) => [...prev, uri]);

    const detected = await classifyFood(uri);
    const newItems: FoodItem[] = detected.map((d) => ({
      name: d.label,
      estimatedGrams: 100,
      caloriesPer100g: FALLBACK_CALORIES_PER_100G[d.label] ?? 100,
      source: 'manual',
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  const takePhoto = () =>
    addPhotoAndClassify(() => ImagePicker.launchCameraAsync({ quality: 0.6 }));
  const pickFromLibrary = () =>
    addPhotoAndClassify(() => ImagePicker.launchImageLibraryAsync({ quality: 0.6 }));

  function updateGrams(index: number, grams: string) {
    const value = parseInt(grams, 10);
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, estimatedGrams: isNaN(value) ? 0 : value } : item))
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addMissedItem() {
    setItems((prev) => [
      ...prev,
      { name: 'New item — tap to rename in a future update', estimatedGrams: 100, caloriesPer100g: 100, source: 'manual' },
    ]);
  }

  async function handleConfirm() {
    if (items.length === 0) {
      Alert.alert('No items', 'Add at least one food item before saving.');
      return;
    }
    setSaving(true);
    try {
      await createMealWithItems(items);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Could not save meal', e.message ?? 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  const totalCalories = Math.round(
    items.reduce((sum, item) => sum + (item.caloriesPer100g / 100) * item.estimatedGrams, 0)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        Add a photo for each plate (main dish, side, dessert...).
      </Text>

      <View style={styles.buttonRow}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Upload Photo" onPress={pickFromLibrary} />
      </View>

      {photos.length > 0 && (
        <FlatList
          data={photos}
          horizontal
          keyExtractor={(uri) => uri}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.thumb} />}
          style={{ marginBottom: 12 }}
        />
      )}

      {items.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Confirm what's in this meal:</Text>
          <FlatList
            data={items}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item, index }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <TextInput
                  style={styles.gramsInput}
                  keyboardType="number-pad"
                  value={String(item.estimatedGrams)}
                  onChangeText={(v) => updateGrams(index, v)}
                />
                <Text style={styles.gramsLabel}>g</Text>
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Button title="+ Add missed item" onPress={addMissedItem} />

          <Text style={styles.total}>~{totalCalories} kcal total</Text>

          {saving ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : (
            <Button title="Save Meal" onPress={handleConfirm} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hint: { marginBottom: 12, color: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  thumb: { width: 80, height: 80, marginRight: 8, borderRadius: 8 },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { flex: 1 },
  gramsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: 60,
    padding: 6,
    textAlign: 'center',
  },
  gramsLabel: { marginLeft: 4, marginRight: 12, color: '#666' },
  removeButton: { color: '#c00', fontSize: 18, paddingHorizontal: 6 },
  total: { fontSize: 18, fontWeight: '700', marginVertical: 12, textAlign: 'center' },
});
