import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

import { lookupBarcode, describeHealthScore } from '../lib/openFoodFacts';
import { logPackagedScan } from '../lib/scanService';
import { PackagedFoodScanResult } from '../types';

export default function BarcodeScanScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<PackagedFoodScanResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleScan({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    const product = await lookupBarcode(data);
    setResult(product);
  }

  async function handleAddToLog() {
    if (!result) return;
    setSaving(true);
    try {
      await logPackagedScan(result);
      Alert.alert('Added', `${result.productName} added to today's log.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Could not save', e.message ?? 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  if (!permission) return <Text>Loading camera permissions...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need camera access to scan barcodes.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'qr'] }}
          onBarcodeScanned={handleScan}
        />
      )}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.title}>{result.productName}</Text>
          <Text>
            {result.caloriesPer100g
              ? `${result.caloriesPer100g} kcal / 100g`
              : 'Calorie data unavailable'}
          </Text>
          <Text>{describeHealthScore(result)}</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Scan Another"
              onPress={() => {
                setScanned(false);
                setResult(null);
              }}
            />
            <Button title={saving ? 'Saving...' : 'Add to Today\'s Log'} onPress={handleAddToLog} disabled={saving} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
});
