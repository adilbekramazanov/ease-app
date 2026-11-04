// Расчёт Symptom Score из ответов квиза.
// Симптомы оценены 0–4; переводим в 0–100 (выше = тяжелее).
import { QUIZ, DOMAINS } from '../data/quiz';

const DOMAIN_OF = Object.fromEntries(
  QUIZ.filter((q) => q.type === 'scale').map((q) => [q.id, q.domain])
);

export function computeScore(answers) {
  const byDomain = {}; // domain -> {sum, n}
  let sum = 0;
  let n = 0;

  for (const [id, domain] of Object.entries(DOMAIN_OF)) {
    const v = answers[id];
    if (typeof v !== 'number') continue;
    sum += v;
    n += 1;
    (byDomain[domain] ??= { sum: 0, n: 0 });
    byDomain[domain].sum += v;
    byDomain[domain].n += 1;
  }

  const overall = n ? Math.round((sum / (n * 4)) * 100) : 0;

  const breakdown = Object.keys(DOMAINS)
    .map((key) => {
      const d = byDomain[key];
      const pct = d && d.n ? Math.round((d.sum / (d.n * 4)) * 100) : 0;
      return { key, label: DOMAINS[key], pct };
    })
    .sort((a, b) => b.pct - a.pct);

  return { overall, breakdown, band: bandOf(overall) };
}

export function bandOf(score) {
  if (score <= 33) return { key: 'low', label: 'Manageable', color: 'var(--sev-low)' };
  if (score <= 66) return { key: 'mid', label: 'Moderate', color: 'var(--sev-mid)' };
  return { key: 'high', label: 'Significant', color: 'var(--sev-high)' };
}

export function colorForPct(pct) {
  if (pct <= 33) return 'var(--sev-low)';
  if (pct <= 66) return 'var(--sev-mid)';
  return 'var(--sev-high)';
}

// Короткий человеческий вывод под счётом.
export function summaryFor(band, topDomain) {
  const top = topDomain ? topDomain.label.toLowerCase() : 'your symptoms';
  if (band.key === 'low') {
    return `Your symptoms look manageable right now — but small, daily habits keep them that way. Your plan leans into ${top}.`;
  }
  if (band.key === 'mid') {
    return `Your symptoms are having a real impact, especially around ${top}. A focused daily plan can meaningfully turn this around.`;
  }
  return `Your symptoms are significant and deserve real support — particularly ${top}. You don’t have to push through this alone.`;
}
