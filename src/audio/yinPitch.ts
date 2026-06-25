const MIN_FREQUENCY = 80;
const MAX_FREQUENCY = 1000;
const YIN_THRESHOLD = 0.15;

export type PitchResult = {
  frequency: number;
  confidence: number;
  rms: number;
};

function computeRms(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

/**
 * YIN pitch detection — suitable for monophonic singing voice.
 */
export function detectPitch(samples: Float32Array, sampleRate: number): PitchResult | null {
  if (samples.length < 512 || sampleRate <= 0) {
    return null;
  }

  const rms = computeRms(samples);
  if (rms < 0.01) {
    return null;
  }

  const minTau = Math.floor(sampleRate / MAX_FREQUENCY);
  const maxTau = Math.min(Math.floor(sampleRate / MIN_FREQUENCY), samples.length - 1);
  if (maxTau <= minTau) {
    return null;
  }

  const yinBuffer = new Float32Array(maxTau + 1);
  yinBuffer[0] = 1;

  for (let tau = 1; tau <= maxTau; tau++) {
    let sum = 0;
    for (let i = 0; i < samples.length - tau; i++) {
      const delta = samples[i] - samples[i + tau];
      sum += delta * delta;
    }
    yinBuffer[tau] = sum;
  }

  let runningSum = 0;
  for (let tau = 1; tau <= maxTau; tau++) {
    runningSum += yinBuffer[tau];
    yinBuffer[tau] = runningSum > 0 ? (yinBuffer[tau] * tau) / runningSum : 1;
  }

  let bestTau = -1;
  for (let tau = minTau; tau <= maxTau; tau++) {
    if (yinBuffer[tau] < YIN_THRESHOLD) {
      while (tau + 1 <= maxTau && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      bestTau = tau;
      break;
    }
  }

  if (bestTau === -1) {
    let minVal = Infinity;
    for (let tau = minTau; tau <= maxTau; tau++) {
      if (yinBuffer[tau] < minVal) {
        minVal = yinBuffer[tau];
        bestTau = tau;
      }
    }
    if (minVal > 0.4) {
      return null;
    }
  }

  const prev = yinBuffer[Math.max(bestTau - 1, 0)];
  const next = yinBuffer[Math.min(bestTau + 1, maxTau)];
  const current = yinBuffer[bestTau];
  const refinedTau =
    bestTau + (next - prev) / (2 * (2 * current - next - prev) || 1);

  const frequency = sampleRate / refinedTau;
  const confidence = Math.max(0, Math.min(1, 1 - current));

  if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
    return null;
  }

  return { frequency, confidence, rms };
}

export function bufferToMonoSamples(data: ArrayBuffer, channels: number): Float32Array {
  const samples = new Float32Array(data);
  if (channels <= 1) {
    return samples;
  }

  const frameCount = Math.floor(samples.length / channels);
  const mono = new Float32Array(frameCount);
  for (let i = 0; i < frameCount; i++) {
    let sum = 0;
    for (let ch = 0; ch < channels; ch++) {
      sum += samples[i * channels + ch];
    }
    mono[i] = sum / channels;
  }
  return mono;
}
