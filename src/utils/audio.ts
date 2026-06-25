/**
 * Synthesizes a beautiful "Ding Dong" school bell chime using Web Audio API
 */
export function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // First tone (Ding) - higher pitch
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.4);
    
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Second tone (Dong) - lower pitch, slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440.00, ctx.currentTime + 0.35); // A4
    osc2.frequency.exponentialRampToValueAtTime(440.00, ctx.currentTime + 0.85);

    gain2.gain.setValueAtTime(0.0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.25);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    // Start and stop
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    osc2.start(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 1.3);
  } catch (error) {
    console.warn("Failed to play synthesized chime:", error);
  }
}

/**
 * Reads call request aloud using Web Speech Synthesis API
 */
export function speakCallRequest(grade: number, className: number, studentName: string, purpose: string, teacherName: string) {
  try {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech to avoid overlap issues
    window.speechSynthesis.cancel();

    const text = `${grade}학년 ${className}반 ${studentName} 학생이 ${purpose} 용무로 ${teacherName} 선생님을 호출했습니다.`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(voice => voice.lang.includes('ko') || voice.lang.includes('KO'));
    if (koVoice) {
      utterance.voice = koVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn("Failed to execute text-to-speech:", error);
  }
}
