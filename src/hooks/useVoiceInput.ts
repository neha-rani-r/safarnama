import { useState, useRef, useCallback } from 'react';

interface UseVoiceInputOptions {
  onTranscript: (finalText: string, interimText: string) => void;
  showToast: (msg: string) => void;
}

export function useVoiceInput({ onTranscript, showToast }: UseVoiceInputOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const accumulatedRef = useRef(''); // finalized text across sessions

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
    recognition.interimResults = true; // show live typing
    recognition.lang = 'en-US';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = '';
      let newFinal = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          newFinal += e.results[i][0].transcript.trim() + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      if (newFinal) {
        accumulatedRef.current = (accumulatedRef.current + newFinal).trim();
      }

      // Pass both: finalized + what user is currently saying (live)
      onTranscript(accumulatedRef.current, interim.trim());
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== 'aborted') showToast(`Voice error: ${e.error}`);
      setIsRecording(false);
      onTranscript(accumulatedRef.current, ''); // clear interim on error
    };

    recognition.onend = () => {
      setIsRecording(false);
      onTranscript(accumulatedRef.current, ''); // clear interim when done
    };

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

  const resetTranscript = useCallback(() => {
    accumulatedRef.current = '';
  }, []);

  return { isRecording, startRecording, stopRecording, resetTranscript };
}
