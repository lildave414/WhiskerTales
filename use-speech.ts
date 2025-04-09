import { useState, useEffect, useCallback } from 'react';

interface UseSpeechProps {
  text: string;
}

export function useSpeech({ text }: UseSpeechProps) {
  const [isReading, setIsReading] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is supported
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const testUtterance = new window.SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(testUtterance);
        window.speechSynthesis.cancel();
        setIsSupported(true);
        console.log("Speech synthesis is supported");
      } else {
        console.log("Speech synthesis is not supported in this browser");
        setIsSupported(false);
      }
    } catch (error) {
      console.error("Error checking speech synthesis support:", error);
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    // Wait for voices to be loaded
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setIsSupported(true);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      // Try to get voices immediately (for Firefox)
      handleVoicesChanged();
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!text || !isSupported) return;

    try {
      const newUtterance = new window.SpeechSynthesisUtterance(text);

      // Configure voice settings for better storytelling
      newUtterance.rate = 0.9; // Slightly slower for children's stories
      newUtterance.pitch = 1.1; // Slightly higher pitch for a friendly tone
      newUtterance.volume = 1.0; // Full volume

      // Try to select a friendly voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice =>
        voice.lang.startsWith('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

      if (englishVoice) {
        newUtterance.voice = englishVoice;
      }

      newUtterance.onend = () => setIsReading(false);
      newUtterance.onerror = () => {
        setIsReading(false);
        setIsSupported(false);
      };

      setUtterance(newUtterance);

      return () => {
        if (window.speechSynthesis?.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
      setIsSupported(false);
    }
  }, [text, isSupported]);

  const toggleReading = useCallback(() => {
    if (!utterance || !isSupported) return;

    try {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        // Ensure we're starting from a clean state
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    } catch (error) {
      console.error('Error toggling speech synthesis:', error);
      setIsReading(false);
      setIsSupported(false);
    }
  }, [utterance, isReading, isSupported]);

  useEffect(() => {
    if (!isSupported) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'q') {
        toggleReading();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleReading, isSupported]);

  return {
    isReading,
    toggleReading,
    isSupported
  };
}