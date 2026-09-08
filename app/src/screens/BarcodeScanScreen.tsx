import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { lookupBarcode, describeHealthScore } from '../lib/openFoodFacts';
import { PackagedFoodScanResult } from '../types';

export default function BarcodeScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<PackagedFoodScanResult | null>(null);

  async function handleScan({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    const product = await lookupBarcode(data);
    setResult(product);
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
          <Button title="Scan Another" onPress={() => { setScanned(false); setResult(null); }} />
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
});
