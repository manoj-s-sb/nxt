import { RotatingQuote } from "./RotatingQuote";
import { Wordmark } from "./Wordmark";

export function AmbientStage() {
  return (
    <aside className="relative hidden md:flex flex-col justify-between p-12 lg:p-16 overflow-hidden border-r border-edge bg-canvas">
      <div className="ambient-bloom" aria-hidden />
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />

      {/* Top: wordmark + status */}
      <div className="relative z-10 flex items-start justify-between reveal-0">
        <Wordmark />
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          <span className="inline-block w-1 h-1 rounded-full bg-accent breathe" />
          <span>online · gemini 2.0</span>
        </div>
      </div>

      {/* Center: quote */}
      <div className="relative z-10 max-w-xl reveal-2">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-accent mb-6">
          fragment ※ 04
        </span>
        <RotatingQuote />
        <p className="mt-8 font-mono text-[11px] tracking-wide text-inkFaint">
          — overheard at 03:14, archived to memory
        </p>
      </div>

      {/* Bottom: meta + decorative line */}
      <div className="relative z-10 reveal-4">
        <div className="flex items-end justify-between">
          <dl className="space-y-2 font-mono text-[10px] uppercase tracking-widest text-inkFaint">
            <div className="flex gap-6">
              <dt>memory</dt>
              <dd className="text-inkDim">long &amp; short term</dd>
            </div>
            <div className="flex gap-6">
              <dt>locale</dt>
              <dd className="text-inkDim">en — utc</dd>
            </div>
            <div className="flex gap-6">
              <dt>build</dt>
              <dd className="text-inkDim">0.1.0 · atelier</dd>
            </div>
          </dl>

          <div className="flex flex-col items-end gap-2">
            <span className="block w-px h-16 bg-gradient-to-b from-transparent via-accent to-transparent pulse-line" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-inkFaint">
              listening
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AmbientStage;
