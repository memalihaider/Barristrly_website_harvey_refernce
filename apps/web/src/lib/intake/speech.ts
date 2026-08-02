/** Browser Speech Synthesis helpers — voice off by default at call sites. */

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(
      (v) =>
        /en(-|_)(US|GB|AE|IN)/i.test(v.lang) &&
        /female|samantha|google/i.test(v.name)
    ) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

function makeUtterance(text: string): SpeechSynthesisUtterance | null {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const utter = new SpeechSynthesisUtterance(clean);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;
  const preferred = pickVoice();
  if (preferred) utter.voice = preferred;
  return utter;
}

/** Speak a single string immediately (cancels anything in progress). */
export function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utter = makeUtterance(text);
  if (!utter) return;
  stopSpeech();
  window.speechSynthesis.speak(utter);
}

/** Speak lines in order (e.g. clicked question, then bot reply). */
export function speakSequence(parts: string[]) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utters = parts
    .map((p) => makeUtterance(p))
    .filter((u): u is SpeechSynthesisUtterance => Boolean(u));
  if (!utters.length) return;
  stopSpeech();
  for (const u of utters) {
    window.speechSynthesis.speak(u);
  }
}
