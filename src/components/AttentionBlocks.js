"use client";

/**
 * Interactive figures for the Transformer / attention post.
 *
 * Posts drop in a bare marker div (`<div class="attention-matrix"></div>`) and
 * the component supplies its own data — markdown carries no props, so anything
 * configurable lives here. Styling follows the kinpaku/lacquer system in
 * DESIGN.md: flat at rest, gold marks meaning, dark ink on every gold fill.
 */

import React, { useState } from "react";

/**
 * Shared frame: hairline-ruled panel with an optional caption below.
 *
 * Figures run one step down from body copy so they read as reference material
 * rather than competing with the prose. The scale is set once here, on the
 * container: every `text-*` utility inside resolves against this font-size, so
 * the whole family of figures moves together instead of 50-odd literal sizes
 * needing to be kept in sync by hand.
 */
function Figure({ children, caption }) {
  return (
    <figure className="my-8 not-prose text-[0.875em]">
      <div className="rounded-md border border-rule bg-lacquer-raised px-4 py-5">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-fig-xs leading-relaxed text-text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Matrix name with a true typographic subscript: W_Q reads as an underscore,
 * which is code notation, not maths. Rendered as W followed by a lowered,
 * smaller letter so the figures match how the formula is written.
 */
function MatrixName({ sub }) {
  return (
    <span className="whitespace-nowrap">
      W<sub className="text-[0.7em] leading-none">{sub}</sub>
    </span>
  );
}

/** Small uppercase kicker used to label a figure's parts. */
function Label({ children }) {
  return (
    <div className="text-fig-3xs font-black uppercase tracking-[0.25em] text-text-muted">
      {children}
    </div>
  );
}

function randAngle(seed) {
  return (seed * 73 + 41) % 360;
}

const TRAINING_FLOWS = [
  {
    input:
      "words of last night, and his promise of last night, and drive away! The Spy withdrew, and Carton seated himself at the table, resting",
    output: "his",
  },
  {
    input: "The capital of France is",
    output: "Paris",
  },
  {
    input: "The opposite of hot is",
    output: "cold",
  },
];

const DIAL_LABELS = [
  "w₁",
  "w₂",
  "w₄",
  "w₅",
  "w₆",
  "w₇",
  "w₈",
  "w₉",
  "w₁₀",
  "w₁₁",
  "w₁₂",
];

function TrainingFlowFigure() {
  const [tick, setTick] = useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTick((v) => v + 1);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const currentFlow = TRAINING_FLOWS[tick % TRAINING_FLOWS.length];
  const baseSeed = tick * 17;

  return (
    <Figure caption="模型會把輸入文字送進一組可調整的參數，參數一直在學習中更新，最後輸出下一個 token。這裡用多組動態 input/output 與隨機旋轉的指針，來表現『輸入經過可訓練參數後產生輸出』的感覺。">
      <div className="mt-5 flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,0.9fr)_auto_minmax(0,0.5fr)] md:items-center md:gap-3">
        <div className="space-y-2">
          <div className="text-center font-display text-fig-base font-bold tracking-tight text-champagne md:text-fig-lg">
            Input
          </div>
          <div className="rounded-md border border-rule bg-lacquer-deep/60 px-4 py-3 text-fig-sm leading-6 text-champagne">
            {currentFlow.input}
          </div>
        </div>

        <div
          className="flex justify-center text-fig-lg font-black text-text-muted"
          aria-hidden="true"
        >
          <span className="md:hidden">↓</span>
          <span className="hidden md:block">→</span>
        </div>

        <div className="space-y-2">
          <div className="text-center font-display text-fig-base font-bold tracking-tight text-champagne md:text-fig-lg">
            Tunable Parameters
          </div>
          <div className="rounded-md border border-rule bg-lacquer-deep px-3 py-3">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {DIAL_LABELS.map((label, i) => {
                const angle = randAngle(baseSeed + i * 11);
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="relative h-7 w-7 rounded-full border border-text-muted/60 bg-lacquer-raised sm:h-8 sm:w-8">
                      <span className="absolute inset-1 rounded-full border border-rule/70" />
                      <span
                        className="absolute left-1/2 top-1/2 h-[1px] w-[10px] origin-left bg-kinpaku transition-transform duration-700 ease-out sm:w-[11px]"
                        style={{
                          transform: `translateY(-50%) rotate(${angle}deg)`,
                        }}
                      />
                      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-kinpaku" />
                    </div>
                    <div className="font-mono text-fig-3xs text-text-muted">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex justify-center text-fig-lg font-black text-text-muted"
          aria-hidden="true"
        >
          <span className="md:hidden">↓</span>
          <span className="hidden md:block">→</span>
        </div>

        <div className="space-y-2">
          <div className="text-center font-display text-fig-base font-bold tracking-tight text-champagne md:text-fig-lg">
            Output
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-md border border-ink-accent/70 bg-kinpaku/10 px-3 py-2 font-display text-fig-lg font-black tracking-tight text-text-muted">
              {currentFlow.output}
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * 1. Tokenization — text is cut into tokens, each with an id
 * ------------------------------------------------------------------ */

// "Tokenizers aren't word-splitters" is the whole point of this figure, so the
// example is chosen to show all three surprises at once: a rare word broken
// into sub-word pieces (tokeni|zation), punctuation as its own token, and the
// leading space folded into the following token (shown as ␣).
const TOKENS = [
  { text: "Token", id: 30642, kind: "sub" },
  { text: "ization", id: 1634, kind: "sub" },
  { text: "␣isn", id: 2125, kind: "sub" },
  { text: "'t", id: 470, kind: "sub" },
  { text: "␣word", id: 1573 },
  { text: "␣splitting", id: 26021 },
  { text: ".", id: 13, kind: "punct" },
];

export function TokenStrip() {
  return (
    <Figure caption="模型不看文字，只看編號 (token id)。">
      <Label>1 — Tokenization</Label>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-fig-3xs text-text-muted">
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-sm border border-ink-accent align-middle" />
          子字串（不是完整單字）
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-sm border border-vec-3 align-middle" />
          標點
        </span>
        <span>␣ = 前面的空格</span>
      </div>

      {/*
        Static, not interactive: the id is always visible, so hovering only
        recolored information the reader could already see. Keeping it as a
        button also implied an action that never existed, and the hover gold
        overrode the border colors that carry the sub-word / punctuation key.
      */}
      {/*
        Scrolls rather than wraps: a token sequence is ordered, and wrapping it
        onto a second line breaks the "one continuous stream" reading. The
        negative margin lets the scroll area bleed to the panel edge so a
        clipped token looks deliberately cut off, not broken.
      */}
      <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-1">
        <div className="flex w-max gap-1.5 sm:gap-2">
          {TOKENS.map((t, i) => (
            <div
              key={i}
              className={[
                "shrink-0 rounded-md border px-2 py-1.5 text-fig-sm sm:px-3 sm:py-2",
                t.kind === "sub"
                  ? "border-ink-accent"
                  : t.kind === "punct"
                    ? "border-vec-3"
                    : "border-rule",
              ].join(" ")}
            >
              <span className="block whitespace-nowrap font-mono text-champagne">
                {t.text}
              </span>
              <span className="mt-1 block font-mono text-fig-3xs text-text-muted">
                {t.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}

export function InputParameterOutputFlow() {
  return <TrainingFlowFigure />;
}

/* ------------------------------------------------------------------ *
 * 2. Embedding lookup — each token maps to a high-dimensional vector
 * ------------------------------------------------------------------ */
// `the` appears twice on purpose: same token, same embedding, different
// position — the clearest way to show that id and position are separate.
// Same sentence as the attention matrix in section 3, so a reader can follow
// `creature` from its embedding all the way through to its context update.
const EMBED_TOKENS = [
  "a",
  "fluffy",
  "blue",
  "creature",
  "roamed",
  "the",
  "verdant",
  "forest",
];

function buildEmbeddingColumn(seed) {
  const values = [];
  for (let i = 0; i < 10; i += 1) {
    // Deterministic pseudo-values: enough to show "long numeric vectors".
    const raw = ((seed * 37 + i * 19) % 99) / 10;
    values.push(raw.toFixed(1));
  }
  return values;
}

// Seeded by the TOKEN, not by its index: embedding lookup is a table lookup,
// so the same token must produce the same vector wherever it appears. Seeding
// by position would make the repeated `the` below show two different vectors,
// which is the opposite of what this figure is meant to teach.
function tokenSeed(token) {
  let h = 0;
  for (let i = 0; i < token.length; i += 1) {
    h = (h * 31 + token.charCodeAt(i)) % 997;
  }
  return h;
}

const EMBED_COLUMNS = EMBED_TOKENS.map((token) => ({
  token,
  values: buildEmbeddingColumn(tokenSeed(token)),
}));

function compressVector(values) {
  if (values.length < 7) return values;
  return [
    values[0],
    values[1],
    values[2],
    "...",
    values[values.length - 3],
    values[values.length - 2],
    values[values.length - 1],
  ];
}

export function EmbeddingLookup() {
  const [hover, setHover] = useState(null);

  return (
    <Figure caption="Embedding lookup 的直觀圖：每個 token 都會往下投影成一個 high-dimensional vector。最上面那排灰色數字是 position（第幾個位置），跟 token 查到的 embedding 無關 —— 同一個字不管出現在哪個位置，查到的向量都一樣。最後一格 ??? 代表要預測的下一個 token。">
      <Label>2 — Embedding Lookup</Label>

      <div className="mt-3 font-mono text-fig-3xs text-text-faint">
        position →
      </div>

      {/*
        Fixed-width columns in a scroller, not fluid: squeezing nine columns
        into a phone width makes the token labels wrap to two or three lines
        and the numbers unreadable. A legible column that scrolls beats an
        illegible one that fits.
      */}
      <div className="-mx-4 mt-4 overflow-x-auto px-4">
        <div className="flex w-max items-start gap-1.5 pb-1 sm:gap-2">
          {EMBED_COLUMNS.map((col, i) => {
            const on = hover === i;
            return (
              <div
                key={col.token + i}
                className="group flex w-[54px] shrink-0 flex-col items-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {/*
                  Position is a property of the COLUMN, not of the token, so it
                  belongs on the figure rather than in prose: the same word at
                  two positions gets the same id but a different index here.
                */}
                <div
                  className={[
                    "mb-1 font-mono text-fig-3xs transition-colors duration-150 ease-lacquer",
                    on ? "text-vec-4" : "text-text-faint",
                  ].join(" ")}
                >
                  {i}
                </div>

                <div
                  className={[
                    "min-h-8 w-full break-all rounded-sm border px-1 py-1 text-center font-mono text-fig-3xs leading-tight transition-colors duration-150 ease-lacquer sm:text-fig-2xs",
                    on
                      ? "border-ink-accent bg-ink-accent/10 text-ink-accent"
                      : "border-rule text-champagne group-hover:border-ink-accent group-hover:text-ink-accent",
                  ].join(" ")}
                >
                  {col.token}
                </div>

                <div className="my-2 text-text-muted">↓</div>

                <div
                  className={[
                    "relative w-full px-2 py-2 font-mono text-fig-2xs leading-5",
                    on
                      ? "text-ink-accent"
                      : "text-text-muted group-hover:text-ink-accent",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute left-0 top-0 h-full w-px",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 top-0 h-px w-2",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 bottom-0 h-px w-2",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute right-0 top-0 h-full w-px",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute right-0 top-0 h-px w-2",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute right-0 bottom-0 h-px w-2",
                      on ? "bg-kinpaku/70" : "bg-rule",
                    ].join(" ")}
                  />

                  {compressVector(col.values).map((v, idx) => (
                    <div key={idx} className="text-center">
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex w-[54px] shrink-0 flex-col items-center">
            <div className="mb-1 font-mono text-fig-3xs text-text-faint">
              {EMBED_COLUMNS.length}
            </div>
            <div className="min-h-8 w-full rounded-sm border border-ink-accent/70 bg-kinpaku/15 px-1 py-1 text-center font-mono text-fig-xs leading-tight text-ink-accent">
              ???
            </div>
            <div className="mt-2 text-center text-fig-3xs leading-tight text-text-muted">
              next token
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Attention matrix — who looks at whom
 * ------------------------------------------------------------------ */

const ATT_TOKENS = [
  "a",
  "fluffy",
  "blue",
  "creature",
  "roamed",
  "the",
  "verdant",
  "forest",
];

// This view intentionally uses: row = key, column = query.
// With this orientation, causal masking appears in the lower-left triangle
// (row index > column index), matching the reference diagram style.
//
// INVARIANT: every COLUMN must sum to 1.0 — a column is one query's softmax
// distribution over the keys it may attend to. Cells with row > col are masked
// and must stay 0. Both are asserted below; edit the numbers and the assertion
// tells you immediately if the column no longer normalises.
const ATT_WEIGHTS = [
  [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 1.0, 0.0, 0.42, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 1.0, 0.58, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 1.0, 0.01, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.99, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.38],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.62],
];

// The column the worked example follows: `creature`.
const FOCUS_COL = ATT_TOKENS.indexOf("creature");

// V vectors, on the same scale as the W_V × E result shown in section 3a.
const VALUE_VECTORS = {
  fluffy: [-27.3, 154.8, 71.2],
  blue: [18.6, -42.1, 96.5],
};

// Derived from the matrix rather than restated: the weights in the V
// calculation ARE the focus column, so they cannot drift out of sync.
const FOCUS_ROWS = ATT_TOKENS.map((token, r) => ({
  token,
  weight: ATT_WEIGHTS[r][FOCUS_COL],
  valueVec: VALUE_VECTORS[token],
})).filter((row) => row.weight > 0);

if (process.env.NODE_ENV !== "production") {
  ATT_TOKENS.forEach((_, c) => {
    const sum = ATT_WEIGHTS.reduce((acc, row) => acc + row[c], 0);
    if (Math.abs(sum - 1) > 1e-9) {
      console.warn(
        `ATT_WEIGHTS column ${c} (${ATT_TOKENS[c]}) sums to ${sum.toFixed(2)}, expected 1.0`,
      );
    }
    ATT_WEIGHTS.forEach((row, r) => {
      if (r > c && row[c] !== 0) {
        console.warn(
          `ATT_WEIGHTS (${r},${c}) is in the masked region but is ${row[c]}`,
        );
      }
    });
  });
}

/*
 * The attention equation, set as styled HTML rather than LaTeX: the project
 * has no math renderer, and this is the only formula in the post. Q and K are
 * tinted so the same colors can key the matrix axes below it.
 */
export function AttentionFormula() {
  return (
    <Figure caption="attention 的完整定義。Q·K 決定「誰該看誰」，softmax 把 attention score 變成總和為 1 的權重，最後乘上 V 取出內容。除以 √dₖ 是為了避免維度一大、dot product 數值就爆掉，讓 softmax 落進梯度平緩的區域。">
      <Label>3 — The Whole Thing, In One Line</Label>

      {/*
        The formula must stay on one line to read as an equation, so it wraps
        in a scroller rather than breaking. gap-1 on phones buys back enough
        width that it usually fits without scrolling at all.
      */}
      <div className="-mx-1 mt-5 overflow-x-auto px-1">
        <div className="flex min-w-max items-center justify-center gap-1 font-mono text-fig-sm sm:gap-2 sm:text-fig-lg">
          <span className="text-champagne">Attention(</span>
          <span className="font-bold text-ink-accent">Q</span>
          <span className="text-champagne">,</span>
          <span className="font-bold text-vec-4">K</span>
          <span className="text-champagne">,</span>
          <span className="font-bold text-vec-1">V</span>
          <span className="text-champagne">) = softmax</span>
          <span className="text-text-muted">(</span>

          {/* Fraction: Q·K over sqrt(d_k), drawn with a hairline rule. */}
          <span className="inline-flex flex-col items-center px-1">
            <span className="px-2 pb-0.5">
              <span className="font-bold text-ink-accent">Q</span>
              <span className="text-champagne">·</span>
              <span className="font-bold text-vec-4">K</span>
              <span className="text-champagne">ᵀ</span>
            </span>
            <span className="h-px w-full bg-rule" />
            <span className="px-2 pt-0.5 text-champagne">
              √d<sub className="text-[0.7em] leading-none">k</sub>
            </span>
          </span>

          <span className="text-text-muted">)</span>
          <span className="font-bold text-vec-1">V</span>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="rounded-sm border border-rule px-3 py-2">
          <div className="font-mono text-fig-xs font-bold text-ink-accent">
            Q · Kᵀ
          </div>
          <div className="mt-1 text-fig-xs leading-relaxed text-text-muted">
            每個 Query 對所有 Key 做 dot product，得到 attention score
          </div>
        </div>
        <div className="rounded-sm border border-rule px-3 py-2">
          <div className="font-mono text-fig-xs font-bold text-champagne">
            softmax( … )
          </div>
          <div className="mt-1 text-fig-xs leading-relaxed text-text-muted">
            把 attention score 正規化成總和為 1 的權重
          </div>
        </div>
        <div className="rounded-sm border border-rule px-3 py-2">
          <div className="font-mono text-fig-xs font-bold text-vec-1">× V</div>
          <div className="mt-1 text-fig-xs leading-relaxed text-text-muted">
            用權重加權平均 Value，得到這個位置的更新量 Δ
          </div>
        </div>
      </div>
    </Figure>
  );
}

export function AttentionMatrix() {
  const [hover, setHover] = useState(null); // [row, col]

  const hoveredWeight =
    hover && ATT_WEIGHTS[hover[0]][hover[1]] > 0
      ? ATT_WEIGHTS[hover[0]][hover[1]]
      : null;

  const focusDelta = [0, 1, 2].map((dim) =>
    FOCUS_ROWS.reduce((acc, row) => acc + row.weight * row.valueVec[dim], 0),
  );

  // Measure the real column height rather than recomputing it from the cell
  // and spacing utilities: hardcoded arithmetic would silently drift if `h-9`
  // or `border-spacing-1` ever changed.
  const bodyRef = React.useRef(null);
  const [focusFrameHeight, setFocusFrameHeight] = useState(0);

  React.useLayoutEffect(() => {
    const measure = () => {
      if (bodyRef.current) {
        setFocusFrameHeight(bodyRef.current.getBoundingClientRect().height + 8);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Figure caption="Q·Kᵀ：每一格是一個 Query 和一個 Key 的 dot product。欄是 Query、列是 Key，所以 causal mask 落在左下角。">
      <Label>3b — The Q·Kᵀ Matrix</Label>

      {/*
        Fixed-width and scrollable rather than fluid: squeezed to a phone
        width, `creature` and `verdant` wrapped onto three lines each and the
        header became unreadable. Cells keep a legible size and the grid
        scrolls instead.
      */}
      <div className="-mx-4 mt-4 overflow-x-auto px-4">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-16 pb-1 text-right font-mono text-fig-2xs font-bold text-vec-4">
                K ↓
              </th>
              {ATT_TOKENS.map((t, c) => (
                <th
                  key={c}
                  className={[
                    "w-14 pb-1 text-center font-mono text-fig-2xs transition-colors",
                    c === FOCUS_COL
                      ? "font-bold text-ink-accent"
                      : hover && hover[1] === c
                        ? "font-bold text-ink-accent"
                        : "font-normal text-text-muted",
                  ].join(" ")}
                >
                  <span className="block text-ink-accent">Q{c + 1}</span>
                  {/* Long tokens must be breakable or they set a minimum
                      column width and push the table back into overflow. */}
                  <span className="block whitespace-nowrap leading-tight">
                    {t}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {ATT_TOKENS.map((rowTok, r) => (
              <tr key={r}>
                <th
                  className={[
                    "whitespace-nowrap pr-2 text-right font-mono text-fig-2xs transition-colors",
                    hover && hover[0] === r
                      ? "font-bold text-ink-accent"
                      : "font-normal text-text-muted",
                  ].join(" ")}
                >
                  <span className="text-vec-4">K{r + 1}</span> {rowTok}
                </th>
                {ATT_TOKENS.map((_, c) => {
                  const w = ATT_WEIGHTS[r][c];
                  const masked = r > c;
                  // The worked-example column is framed as one continuous box
                  // rather than per-cell borders: `border-spacing-1` would
                  // otherwise break it into separate rectangles with gaps.
                  const inFocusCol = c === FOCUS_COL;
                  const isFirstRow = r === 0;
                  return (
                    <td key={c} className="p-0">
                      <div
                        onMouseEnter={() => !masked && setHover([r, c])}
                        onMouseLeave={() => setHover(null)}
                        className={[
                          "relative h-7 w-14 rounded-sm border transition-all duration-150 ease-lacquer",
                          masked
                            ? "border-rule/40 bg-transparent"
                            : "cursor-pointer border-transparent",
                          hover && hover[0] === r && hover[1] === c
                            ? "ring-1 ring-kinpaku"
                            : "",
                        ].join(" ")}
                        style={
                          masked
                            ? undefined
                            : {
                                // Gold at opacity = weight. Flat at rest, and
                                // the eye reads brightness as strength.
                                backgroundColor: `oklch(var(--kinpaku) / ${Math.max(w, 0.04)})`,
                              }
                        }
                      >
                        {/*
                          The column frame is drawn ONCE, from the first cell,
                          spanning the full column height. Drawing it per-cell
                          made the left and right rules land on different
                          device-pixel boundaries and render at visibly
                          different weights.
                        */}
                        {inFocusCol && isFirstRow ? (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-1 -right-1 -top-1 rounded-sm border border-kinpaku"
                            style={{ height: focusFrameHeight }}
                          />
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 h-5 text-fig-xs text-text-muted">
        {hoveredWeight !== null ? (
          <span>
            <span className="font-mono text-ink-accent">Q{hover[1] + 1}</span>
            <span className="font-mono"> · </span>
            <span className="font-mono text-vec-4">K{hover[0] + 1}</span>
            {" ："}
            <span className="font-mono text-champagne">
              {ATT_TOKENS[hover[1]]}
            </span>
            {" 看向 "}
            <span className="font-mono text-champagne">
              {ATT_TOKENS[hover[0]]}
            </span>
            {"，權重 "}
            <span className="font-mono text-ink-accent">
              {hoveredWeight.toFixed(2)}
            </span>
          </span>
        ) : (
          <span>滑過任一格子查看 Q·K 的權重。</span>
        )}
      </div>

      {/*
        The arithmetic stays in the figure rather than the prose: these weights
        are read straight out of ATT_WEIGHTS, so the grid above and the numbers
        below can never disagree. Moving them to markdown would freeze them as
        literals that silently drift when the matrix changes.
      */}
      <div className="mt-4 rounded-md border border-ink-accent/70 bg-kinpaku/10 px-3 py-3">
        <div className="space-y-1.5">
          <div className="text-fig-3xs font-black uppercase tracking-[0.25em] text-text-muted">
            creature 這一欄的權重乘上 V
          </div>
          {FOCUS_ROWS.map((row, i) => (
            <React.Fragment key={row.token}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-fig-xs">
                <span className="text-ink-accent">{row.weight.toFixed(2)}</span>
                <span className="text-text-muted">×</span>
                <span className="min-w-[3.5rem] text-champagne">
                  v<sub className="text-[0.7em] leading-none">{row.token}</sub>
                </span>
                <span className="break-all text-text-muted">
                  [{row.valueVec.map((v) => v.toFixed(1)).join(", ")}, …]
                </span>
              </div>
              {/* The terms are summed, so mark the join between them. */}
              {i < FOCUS_ROWS.length - 1 ? (
                <div
                  className="font-mono text-fig-xs text-ink-accent"
                  aria-hidden="true"
                >
                  +
                </div>
              ) : null}
            </React.Fragment>
          ))}
          {/*
            The sum rule is text-muted, not kinpaku: this panel is a gold tint,
            so a gold line is light-on-light — it measures 1.16:1 in light mode
            and is effectively invisible. A neutral that inverts with the theme
            clears 4:1 on both.
          */}
          <div className="mt-1 border-t border-text-muted/80 pt-2 font-mono text-fig-xs text-champagne">
            <span className="text-text-muted">Δ = </span>[
            {focusDelta.map((v) => v.toFixed(1)).join(", ")}, …]
          </div>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * 4. Context updates meaning — the "mole" problem
 * ------------------------------------------------------------------ */

const SENTENCES = [
  {
    key: "animal",
    label: "動物",
    sentence: ["American", "shrew", "mole"],
    target: 2,
    pulls: [0, 1],
    note: "「American」和「shrew」把它推向小型哺乳動物。",
  },
  {
    key: "unit",
    label: "莫耳",
    sentence: ["One", "mole", "of", "carbon", "dioxide"],
    target: 1,
    pulls: [3, 4],
    note: "「carbon」和「dioxide」把它推向化學計量單位。",
  },
  {
    key: "skin",
    label: "痣",
    sentence: ["Take", "a", "biopsy", "of", "the", "mole"],
    target: 5,
    // `the` carries no semantic pull -- only `biopsy` does the disambiguating.
    pulls: [2],
    note: "「biopsy」把它推向醫學語境中的皮膚病灶。",
  },
];

export function ContextShift() {
  const [pick, setPick] = useState(0);
  const s = SENTENCES[pick];

  return (
    <Figure caption="同一個 mole，被不同的鄰居拉往完全不同的意思。attention 做的就是把上下文的資訊加回這個詞的向量上 —— 詞義不是查字典查來的，是被算出來的。">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label>4 — Context</Label>
        <div className="flex gap-1">
          {SENTENCES.map((opt, i) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setPick(i)}
              className={[
                "rounded-md border px-3 py-1.5 text-fig-xs font-bold transition-colors duration-150 ease-lacquer",
                pick === i
                  ? "border-kinpaku bg-kinpaku text-gold-ink"
                  : "border-rule text-text-muted hover:border-ink-accent hover:text-ink-accent",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {s.sentence.map((tok, i) => {
          const isTarget = i === s.target;
          const isPull = s.pulls.includes(i);
          return (
            <span
              key={i}
              className={[
                // Colors still transition when the sentence is switched; only
                // the hover response was removed.
                "rounded-md border px-3 py-2 font-mono text-fig-sm transition-colors duration-200 ease-lacquer",
                isTarget
                  ? "border-kinpaku bg-kinpaku font-bold text-gold-ink"
                  : isPull
                    ? // Matches the text color rather than using gold: a gold
                      // hairline on the light canvas is only 1.4:1.
                      "border-ink-accent/70 text-ink-accent"
                    : "border-rule text-text-muted",
              ].join(" ")}
            >
              {tok}
            </span>
          );
        })}
      </div>

      <p className="mt-4 text-fig-sm leading-relaxed text-champagne">
        <span className="font-mono font-bold text-ink-accent">mole</span>
        {" → "}
        {s.note}
      </p>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * 4.5 QKV projections + the residual add
 * ------------------------------------------------------------------ */

/*
 * The three projections of a single embedding. The point of this figure is
 * that Q, K and V are not three separate things the token carries around —
 * they are the SAME vector E_i seen through three different learned matrices.
 * Selecting a path expands the matrix-vector multiply behind it.
 */
const PROJECTIONS = [
  {
    key: "q",
    sub: "Q",
    out: "Q",
    role: "creature: Any adjectives in front of me?",
    detail: "把 E 投影到 query 空間：這個位置想要什麼樣的資訊。",
    // Small illustrative rows; the ellipsis carries "and 12k more dimensions".
    rows: [
      ["+7.4", "-3.2", "+9.1", "-5.3"],
      ["-9.5", "-7.0", "+0.5", "-0.3"],
      ["-5.4", "-7.8", "+7.2", "+9.3"],
    ],
    result: ["+310.6", "-95.2", "-9.1", "⋮"],
  },
  {
    key: "k",
    sub: "K",
    out: "K",
    role: "fluffy/blue: I'm an adjective! I'm there!",
    detail: "把 E 投影到 key 空間：這個位置能提供什麼樣的資訊。",
    rows: [
      ["+2.1", "+8.4", "-3.7", "+1.2"],
      ["+6.3", "-2.9", "+5.1", "-8.0"],
      ["-1.8", "+4.6", "-6.2", "+3.5"],
    ],
    result: ["+188.4", "+42.7", "-63.9", "⋮"],
  },
  {
    key: "v",
    sub: "V",
    out: "V",
    role: "What do I transmit?",
    detail: "把 E 投影到 value 空間：真的被取用時，實際傳出去的內容。",
    rows: [
      ["-4.2", "+1.7", "+2.8", "+6.9"],
      ["+3.6", "+9.2", "-1.4", "-2.3"],
      ["+8.1", "-5.5", "+4.0", "+1.6"],
    ],
    result: ["-27.3", "+154.8", "+71.2", "⋮"],
  },
];

// Ends in an ellipsis for the same reason the matrix rows do: the real vector
// is ~12k-dimensional. Without it the column reads as a literal 4-vector and
// visibly fails to line up with the matrix it is multiplied by.
const EMBED_COL = ["2.9", "3.4", "1.0", "⋮"];

/** Bracketed numeric column, the shared visual for E / Q / K / V vectors. */
function VectorColumn({ values, tone = "muted", label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative px-2 py-1.5">
        {/* Square brackets drawn as rules: cheaper than glyphs and they scale. */}
        <span className="absolute left-0 top-0 h-full w-px bg-rule" />
        <span className="absolute left-0 top-0 h-px w-1.5 bg-rule" />
        <span className="absolute bottom-0 left-0 h-px w-1.5 bg-rule" />
        <span className="absolute right-0 top-0 h-full w-px bg-rule" />
        <span className="absolute right-0 top-0 h-px w-1.5 bg-rule" />
        <span className="absolute bottom-0 right-0 h-px w-1.5 bg-rule" />
        <div
          className={[
            "font-mono text-fig-2xs leading-5",
            tone === "accent" ? "text-ink-accent" : "text-text-muted",
          ].join(" ")}
        >
          {values.map((v, i) => (
            <div key={i} className="text-center">
              {v}
            </div>
          ))}
        </div>
      </div>
      {label ? (
        <div className="break-all text-center font-mono text-fig-3xs leading-tight text-champagne sm:text-fig-2xs">
          {label}
        </div>
      ) : null}
    </div>
  );
}

/** One `× W → out` row. Shared by both lanes so they stay visually identical. */
function ProjectionPath({ projection, on, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={on}
      className={[
        // The role text is a full sentence, so it wraps to its own line on
        // narrow screens rather than competing with the formula for space.
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border px-3 py-2 text-left transition-colors duration-150 ease-lacquer sm:gap-x-3",
        on
          ? "border-kinpaku bg-kinpaku/10"
          : "border-rule hover:border-ink-accent",
      ].join(" ")}
    >
      <span
        className="font-mono text-fig-xs text-text-muted"
        aria-hidden="true"
      >
        ×
      </span>
      <span
        className={[
          "font-mono text-fig-sm font-bold",
          on ? "text-ink-accent" : "text-champagne",
        ].join(" ")}
      >
        <MatrixName sub={projection.sub} />
      </span>
      <span className="text-text-muted" aria-hidden="true">
        →
      </span>
      <span
        className={[
          "font-mono text-fig-sm font-bold",
          on ? "text-ink-accent" : "text-champagne",
        ].join(" ")}
      >
        {projection.out}
      </span>
      <span className="w-full text-fig-3xs leading-snug text-text-muted lg:ml-auto lg:w-auto lg:text-right lg:text-fig-xs">
        {projection.role}
      </span>
    </button>
  );
}

/*
 * The three projections. This comes BEFORE the Q·K matrix in the post:
 * the matrix is built from Q and K, so showing where they come from first
 * is the causal order.
 */
export function QKVProjection() {
  const [open, setOpen] = useState("q");
  const active = PROJECTIONS.find((p) => p.key === open);

  return (
    <Figure caption="Q、K、V 都是同一個 embedding 乘上不同的可學習矩陣得到的投影。產生 Q、K 的那兩個矩陣只用來算 attention score；產生 V 的矩陣只負責內容。點選任一路徑可以展開它的矩陣乘法。">
      <Label>3a — Three Projections of One Embedding</Label>

      {/*
        Side-by-side from `sm` up, not `lg`: E feeding three paths only reads
        correctly left-to-right. Stacked, the arrows point sideways while the
        flow reads downward, which is the layout fighting the diagram.
      */}
      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex shrink-0 items-center justify-center">
          <VectorColumn
            values={EMBED_COL}
            label={
              <>
                E<sub className="text-[0.7em] leading-none">creature</sub>
              </>
            }
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {PROJECTIONS.map((p) => (
            <ProjectionPath
              key={p.key}
              projection={p}
              on={open === p.key}
              onSelect={() => setOpen(p.key)}
            />
          ))}
        </div>
      </div>

      {/* Expanded matrix-vector multiply for the selected path. */}
      <div className="mt-3 rounded-sm border border-rule px-2 py-4 sm:px-3">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-sm border border-rule px-1.5 py-1.5 font-mono text-fig-3xs leading-5 text-text-muted sm:px-2 sm:text-fig-2xs">
              {active.rows.map((row, i) => (
                <div key={i} className="whitespace-nowrap">
                  {/* Two columns on phones, all four from `sm` up: four
                      columns of signed numbers overflow a narrow screen. */}
                  <span className="sm:hidden">
                    {row.slice(0, 2).join("  ")}
                  </span>
                  <span className="hidden sm:inline">{row.join("  ")}</span>
                  <span className="text-text-muted"> …</span>
                </div>
              ))}
              <div className="text-center text-text-muted">⋮</div>
            </div>
            <div className="font-mono text-fig-2xs text-ink-accent">
              <MatrixName sub={active.sub} />
            </div>
          </div>

          <span
            className="font-mono text-fig-sm text-text-muted"
            aria-hidden="true"
          >
            ×
          </span>

          <VectorColumn values={EMBED_COL} label="E" />

          <span
            className="font-mono text-fig-sm text-text-muted"
            aria-hidden="true"
          >
            =
          </span>

          <VectorColumn
            values={active.result}
            tone="accent"
            label={active.out}
          />
        </div>

        <p className="mt-3 text-center text-fig-sm leading-relaxed text-text-muted">
          {active.detail}
        </p>
      </div>
    </Figure>
  );
}

/*
 * The residual step. The weighted sum itself lives inside the attention matrix
 * (it IS the focus column), so this figure only carries what happens after:
 * Δ is added back rather than replacing the embedding.
 */
export function QKVFlow() {
  const delta = [0, 1, 2].map((dim) =>
    FOCUS_ROWS.reduce((acc, row) => acc + row.weight * row.valueVec[dim], 0),
  );

  return (
    <Figure caption="原本的 embedding 加上更新量 Δ，得到這個位置更新後的表示 E′。">
      <Label>3c — The Residual Add</Label>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <VectorColumn
          values={[...EMBED_COL.slice(0, 3), "⋮"]}
          label={
            <>
              E<sub className="text-[0.7em] leading-none">creature</sub>
            </>
          }
        />
        <span className="font-mono text-fig-lg text-ink-accent">+</span>
        <VectorColumn
          values={[...delta.map((v) => v.toFixed(1)), "⋮"]}
          label="Δ"
        />
        <span className="font-mono text-fig-lg text-text-muted">=</span>
        <VectorColumn
          values={[
            ...delta.map((v, i) => (Number(EMBED_COL[i]) + v).toFixed(1)),
            "⋮",
          ]}
          tone="accent"
          label={
            <>
              E′<sub className="text-[0.7em] leading-none">creature</sub>
            </>
          }
        />
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ *
 * 5. Parallelism — why GPUs suit this
 * ------------------------------------------------------------------ */

export function ParallelCompare() {
  const [mode, setMode] = useState("parallel");
  const cells = [0, 1, 2, 3, 4, 5];

  return (
    <Figure caption="RNN 必須等前一步算完才能算下一步；attention 讓所有位置的運算彼此獨立，可以一次全部發下去。這正好是 GPU 擅長的事 —— 也是 Transformer 能被訓練到這種規模的真正原因。">
      {/*
        The pulse keyframes are declared here rather than in globals.css: this
        is the only place that uses them, and a post-scoped figure shouldn't
        add global CSS. Styled-jsx scopes it to this component automatically.
      */}
      <style jsx>{`
        @keyframes attn-pulse {
          0%,
          100% {
            opacity: 0.25;
          }
          40% {
            opacity: 1;
          }
        }
        .attn-cell {
          animation: attn-pulse 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .attn-cell {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label>7 — Parallelism</Label>
        <div className="flex gap-1">
          {[
            ["sequential", "循序 (RNN)"],
            ["parallel", "平行 (Attention)"],
          ].map(([key, name]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={[
                "rounded-md border px-3 py-1.5 text-fig-xs font-bold transition-colors duration-150 ease-lacquer",
                mode === key
                  ? "border-kinpaku bg-kinpaku text-gold-ink"
                  : "border-rule text-text-muted hover:border-ink-accent hover:text-ink-accent",
              ].join(" ")}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {cells.map((i) => (
          <div
            key={i}
            className="attn-cell flex h-11 w-11 items-center justify-center rounded-sm border border-kinpaku/60 font-mono text-fig-xs text-gold-ink"
            style={{
              backgroundColor: "oklch(var(--kinpaku) / 0.85)",
              // Sequential: each cell waits its turn. Parallel: all fire at once.
              animationDelay: mode === "sequential" ? `${i * 0.2}s` : "0s",
            }}
          >
            t{i}
          </div>
        ))}
      </div>

      <p className="mt-4 text-fig-sm leading-relaxed text-text-muted">
        {mode === "sequential"
          ? "一格算完才輪到下一格，時間隨序列長度線性增長。"
          : "所有格子同時開始 —— 序列變長，wall-clock time 幾乎不變。"}
      </p>
    </Figure>
  );
}
