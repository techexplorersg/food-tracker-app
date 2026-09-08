import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { lookupBarcode, describeHealthScore } from '../lib/openFoodFacts';
import { PackagedFoodScanResult } from '../types';

export default function BarcodeScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<PackagedFoodScanResult | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function handleScan({ data }: { data: string }) {
    setScanned(true);
    const product = await lookupBarcode(data);
    setResult(product);
  }

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera.</Text>;

  return (
    <View style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleScan}
          style={StyleSheet.absoluteFillObject}
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
          {/* TODO: "Add to today's log" button -> writes into meals table */}
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
