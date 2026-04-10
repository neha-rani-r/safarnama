import { useState, useRef, useCallback } from 'react';

interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;
  showToast: (msg: string) => void;
}

export function useVoiceInput({ onTranscript, showToast }: UseVoiceInputOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const accumulatedRef = useRef(''); // holds all finalized text across pause/resume sessions

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice not supported. Use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // only fire when a sentence is final
    recognition.lang = 'en-US';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let newFinal = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          newFinal += e.results[i][0].transcript.trim() + ' ';
        }
      }
      if (newFinal) {
        accumulatedRef.current = (accumulatedRef.current + newFinal).trim();
        onTranscript(accumulatedRef.current);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== 'aborted') showToast(`Voice error: ${e.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [onTranscript, showToast]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  // Call this when entry is saved to fully reset
  const resetTranscript = useCallback(() => {
    accumulatedRef.current = '';
  }, []);

  return { isRecording, startRecording, stopRecording, resetTranscript };
}
