/**
 * Rich blocks authored as plain HTML inside markdown posts.
 *
 * Posts write semantic markup only (`<div class="info-box">`, `<div
 * class="custom-timeline">`); all styling lives here so blocks stay theme-aware
 * and inline <style> tags in content are never needed.
 */

export function InfoBox({ children }) {
  return (
    <div className="my-6 rounded-md border border-rule bg-lacquer-raised px-5 py-4 not-prose">
      {children}
    </div>
  );
}

export function InfoBoxTitle({ children }) {
  return (
    <div className="font-display text-lg font-bold leading-[1.15] tracking-tight text-ink-accent mb-3">
      {children}
    </div>
  );
}

export function InfoBoxContent({ children }) {
  return (
    <div className="text-sm leading-relaxed text-champagne">{children}</div>
  );
}

/**
 * A side note: an aside that qualifies the surrounding prose without competing
 * with it. Muted and a step smaller, on a faint tinted surface — no accent
 * stripe, per the border-left rule in DESIGN.md.
 */
export function SideNote({ children }) {
  return (
    <div className="my-4 rounded-md border border-rule bg-lacquer-deep/40 px-4 py-3 text-sm leading-relaxed text-text-muted not-prose">
      {children}
    </div>
  );
}

export function Timeline({ children }) {
  return (
    <div className="my-6 ml-4 border-l border-kinpaku-deep/30 dark:border-rule pl-6 not-prose">
      {children}
    </div>
  );
}

export function TimelineItem({ children }) {
  return (
    <div className="relative mb-8 last:mb-0">
      {/*
        Node marker sits on the rail; -1px nudge centers it on the hairline.
        Light: filled kinpaku-deep dot -- a light-gold ring on paper only gets
        1.6:1 and vanishes. Dark: the hollow gold ring reads fine, so keep it.
      */}
      <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-kinpaku-deep bg-kinpaku-deep dark:border-kinpaku dark:bg-lacquer" />
      {children}
    </div>
  );
}

export function TimelineTitle({ children }) {
  return (
    <div className="font-display text-lg font-bold leading-[1.15] tracking-tight text-champagne">
      {children}
    </div>
  );
}

export function TimelineDate({ children }) {
  return (
    <div className="mt-1 mb-3 text-[10px] font-black uppercase tracking-widest text-ink-accent">
      {children}
    </div>
  );
}

export function TimelineContent({ children }) {
  return (
    <div className="text-sm leading-relaxed text-text-muted">{children}</div>
  );
}
