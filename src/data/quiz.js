// Вопросы квиза ease (~20 шагов): демография, симптомы менопаузы по доменам
// + промо-слайды. Симптомы оцениваются по шкале 0–4 и формируют Symptom Score.

// Единая шкала тяжести симптома.
const SCALE = [
  { label: 'Not at all', value: 0, emoji: '🌿' },
  { label: 'A little', value: 1, emoji: '🙂' },
  { label: 'Moderately', value: 2, emoji: '😕' },
  { label: 'Quite a bit', value: 3, emoji: '😣' },
  { label: 'Severely', value: 4, emoji: '😖' },
];

const scale = (id, domain, question, subtitle) => ({
  id,
  type: 'scale',
  domain,
  question,
  subtitle,
  options: SCALE,
});

// Домены симптомов → используются в разбивке Symptom Score.
export const DOMAINS = {
  vasomotor: 'Hot flashes & sweats',
  sleep: 'Sleep',
  mood: 'Mood & anxiety',
  cognitive: 'Focus & memory',
  physical: 'Body & energy',
  sexual: 'Intimacy',
};

export const QUIZ = [
  {
    id: 'age',
    type: 'single',
    domain: 'bio',
    question: 'First, how old are you?',
    subtitle: 'This helps us tailor your plan and compare with women like you.',
    options: [
      { label: 'Under 40', value: '<40' },
      { label: '40–45', value: '40-45' },
      { label: '46–50', value: '46-50' },
      { label: '51–55', value: '51-55' },
      { label: '56 or older', value: '56+' },
    ],
  },
  {
    id: 'stage',
    type: 'single',
    domain: 'bio',
    question: 'Where are you in your journey?',
    subtitle: 'There’s no wrong answer — many women aren’t sure.',
    options: [
      { label: 'Perimenopause', sub: 'Periods are changing', value: 'peri', emoji: '🌓' },
      { label: 'Menopause', sub: 'No period for ~12 months', value: 'meno', emoji: '🌗' },
      { label: 'Postmenopause', sub: 'Over a year since my last period', value: 'post', emoji: '🌕' },
      { label: 'I’m not sure', value: 'unsure', emoji: '❓' },
    ],
  },
  scale('hotflash', 'vasomotor', 'How often do hot flashes affect you?', 'Sudden waves of heat, flushing or a racing heart.'),
  scale('sweats', 'vasomotor', 'And night sweats?', 'Waking up overheated or needing to change the sheets.'),
  scale('sleep', 'sleep', 'How is your sleep lately?', 'Trouble falling asleep, or not feeling rested.'),
  {
    id: 'promo-1',
    type: 'promo',
    emoji: '🤝',
    stat: '47M',
    title: 'You’re in good company',
    body: 'About 47 million women enter menopause every year. ease was built with — and for — them.',
  },
  scale('wake', 'sleep', 'Do you wake during the night?', 'From heat, a racing mind, or no clear reason.'),
  scale('anxiety', 'mood', 'Anxiety or irritability?', 'Feeling on edge, snappy, or overwhelmed.'),
  scale('lowmood', 'mood', 'Low mood or tearfulness?', 'Feeling flat, down, or crying more easily.'),
  scale('fog', 'cognitive', 'Brain fog or forgetfulness?', 'Losing your train of thought or words.'),
  scale('focus', 'cognitive', 'Trouble concentrating?', 'Harder to stay on task than it used to be.'),
  {
    id: 'promo-2',
    type: 'promo',
    emoji: '🧠',
    stat: '15 min',
    title: '15 minutes a day',
    body: 'Guided CBT is clinically shown to ease the distress of hot flashes, sleep and low mood — in just 15 minutes a day.',
  },
  scale('joints', 'physical', 'Joint aches or stiffness?', 'Especially in the morning or after sitting.'),
  scale('energy', 'physical', 'Fatigue or low energy?', 'Running on empty, even after rest.'),
  scale('libido', 'sexual', 'Changes in your libido?', 'Less desire or interest than before.'),
  scale('dryness', 'sexual', 'Vaginal dryness or discomfort?', 'During daily life or intimacy.'),
  {
    id: 'promo-3',
    type: 'promo',
    emoji: '🏅',
    stat: 'Trusted',
    title: 'Evidence-based, and recognised',
    body: 'Apple Editors’ Choice · ORCHA-certified for NHS libraries · symptom tracking and HRT reviews by real users.',
  },
  {
    id: 'weight',
    type: 'number',
    domain: 'bio',
    question: 'What’s your current weight?',
    subtitle: 'Used only to personalise your plan. Round numbers are fine.',
    unit: ['kg', 'lb'],
    placeholder: '68',
  },
  {
    id: 'hrt',
    type: 'single',
    domain: 'bio',
    question: 'Are you currently using HRT?',
    subtitle: 'Hormone replacement therapy.',
    options: [
      { label: 'Yes, I’m on HRT', value: 'yes', emoji: '💊' },
      { label: 'No, not right now', value: 'no', emoji: '🚫' },
      { label: 'I’m considering it', value: 'considering', emoji: '🤔' },
    ],
  },
  {
    id: 'goal',
    type: 'single',
    domain: 'bio',
    question: 'What would help you most right now?',
    subtitle: 'We’ll put this front and centre in your plan.',
    options: [
      { label: 'Sleep through the night', value: 'sleep', emoji: '🌙' },
      { label: 'Fewer hot flashes', value: 'flashes', emoji: '🔥' },
      { label: 'A steadier mood', value: 'mood', emoji: '💗' },
      { label: 'Sharper focus', value: 'focus', emoji: '✨' },
      { label: 'Feel like myself again', value: 'self', emoji: '🌸' },
    ],
  },
];

// Индекс симптомных (оцениваемых) вопросов.
export const SCORED_IDS = QUIZ.filter((q) => q.type === 'scale').map((q) => q.id);
