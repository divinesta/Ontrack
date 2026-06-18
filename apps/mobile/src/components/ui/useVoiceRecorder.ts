import { useCallback, useMemo, useState } from "react";
import {
  AudioModule,
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

export type VoiceRecordingResult = {
  durationMillis: number;
  uri: string;
};

type VoiceRecorderStatus = "idle" | "recording";

const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
} as const;

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 120);
  const [status, setStatus] = useState<VoiceRecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const ensurePermission = useCallback(async () => {
    const current = await getRecordingPermissionsAsync();
    if (current.granted) return true;

    const requested = await requestRecordingPermissionsAsync();
    if (requested.granted) return true;

    setError("Microphone access is needed to record a voice note.");
    return false;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    const hasPermission = await ensurePermission();
    if (!hasPermission) return false;

    await AudioModule.setIsAudioActiveAsync(true);
    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setStatus("recording");
    return true;
  }, [ensurePermission, recorder]);

  const cancel = useCallback(async () => {
    if (recorderState.isRecording) {
      await recorder.stop();
    }
    setStatus("idle");
    setError(null);
  }, [recorder, recorderState.isRecording]);

  const stop = useCallback(async (): Promise<VoiceRecordingResult | null> => {
    if (!recorderState.isRecording && status !== "recording") return null;

    await recorder.stop();
    setStatus("idle");

    const uri = recorder.uri ?? recorderState.url;
    if (!uri) {
      setError("Could not save that recording. Please try again.");
      return null;
    }

    return {
      durationMillis: recorderState.durationMillis,
      uri,
    };
  }, [recorder, recorderState.durationMillis, recorderState.isRecording, recorderState.url, status]);

  return useMemo(
    () => ({
      cancel,
      durationMillis: recorderState.durationMillis,
      error,
      isRecording: status === "recording" || recorderState.isRecording,
      metering: recorderState.metering,
      start,
      stop,
    }),
    [cancel, error, recorderState.durationMillis, recorderState.isRecording, recorderState.metering, start, status, stop],
  );
}
