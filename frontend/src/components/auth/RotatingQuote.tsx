"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  "Thought is a private country, until you speak it aloud.",
  "A memory, once written down, becomes a place you can revisit.",
  "Speak to me, and I will keep what is worth keeping.",
  "In every conversation, the next sentence is being authored.",
  "What is forgotten, after all, was once entirely known.",
];

export function RotatingQuote() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      key={idx}
      className="font-serif italic text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.4] text-ink fade-quote caret"
    >
      &ldquo;{QUOTES[idx]}&rdquo;
    </p>
  );
}

export default RotatingQuote;
