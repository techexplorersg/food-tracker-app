/**
 * On-device food classification.
 *
 * This is a STUB. It defines the interface the rest of the app depends on,
 * so screens can be built and tested before the real model is wired in.
 *
 * To make this real (see ROADMAP.md, Phase 2):
 *   1. Get a pretrained food-classification model (e.g. a TFLite model
 *      fine-tuned on Food-101, or export one via Teachable Machine / a
 *      Colab notebook using a MobileNetV2 base — all free).
 *   2. Drop the .tflite file into app/assets/models/ and the .mlmodel
 *      (Core ML) equivalent for iOS.
 *   3. Use `react-native-fast-tflite` (Android) and a Core ML bridge
 *      (iOS) to run inference on the photo URI.
 *   4. Replace the body of classifyFood() below with real inference,
 *      keeping the same return shape so nothing else has to change.
 *
 * This is the single riskiest piece of the whole app (see
 * ARCHITECTURE.md) — expect this file to need the most iteration.
 */

export interface ClassificationCandidate {
  label: string;
  confidence: number; // 0-1
}

export async function classifyFood(
  photoUri: string
): Promise<ClassificationCandidate[]> {
  // TODO: replace with real on-device inference.
  // Returning a fake result for now so the UI flow can be built/tested.
  return [
    { label: 'grilled chicken breast', confidence: 0.62 },
    { label: 'steamed rice', confidence: 0.55 },
    { label: 'broccoli', confidence: 0.41 },
  ];
}
