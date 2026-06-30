import { steps } from '../data/questions';

export function calculateScores(answers: Record<string, string>) {
  const categoryScores: Record<string, number> = {
    visibility: 0,
    trust: 0,
    conversion: 0,
    offer: 0,
    retention: 0,
    competition: 0,
  };

  const categoryMax: Record<string, number> = {
    visibility: 22.5, // 原20 + google_review_count(2.5)
    trust: 22.5,      // 原20 + google_rating(2.5)
    conversion: 25,   // 原20 + weekly_calls(2.5) + weekly_bookings(2.5)
    offer: 15,
    retention: 15,
    competition: 10,
  };

  const RAW_MAX_TOTAL = 110; // 22.5+22.5+25+15+15+10

  const allProblems: { text: string, score: number, max: number }[] = [];

  steps.forEach(step => {
    step.questions.forEach(q => {
      if (q.category && answers[q.id]) {
        const option = q.options?.find(o => o.value === answers[q.id]);
        if (option && option.score !== undefined) {
          categoryScores[q.category] += option.score;

          // 找出该题的满分，用于判断这题是否"低于满分"（而不是写死 < 5）
          const maxScoreForQuestion = Math.max(...(q.options?.map(o => o.score ?? 0) ?? [0]));
          if (option.score < maxScoreForQuestion && option.problemText) {
             allProblems.push({ text: option.problemText, score: option.score, max: maxScoreForQuestion });
          }
        }
      }
    });
  });

  const rawTotal = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  // 按比例缩放回 100 分制，保持原有 6 大类权重比例不变
  const totalScore = Math.round((rawTotal / RAW_MAX_TOTAL) * 100);

  const rates: Record<string, number> = {
    visibility: categoryScores.visibility / categoryMax.visibility,
    trust: categoryScores.trust / categoryMax.trust,
    conversion: categoryScores.conversion / categoryMax.conversion,
    offer: categoryScores.offer / categoryMax.offer,
    retention: categoryScores.retention / categoryMax.retention,
    competition: categoryScores.competition / categoryMax.competition,
  };

  let mainIssueCategory = 'visibility';
  let minRate = rates.visibility;

  for (const [category, rate] of Object.entries(rates)) {
    if (rate < minRate) {
      minRate = rate;
      mainIssueCategory = category;
    }
  }

  // 按"丢分比例"排序（丢分越多越靠前），而不是绝对分数，
  // 这样满分2.5的题和满分5的题可以公平比较严重程度
  const topProblems = allProblems
    .sort((a, b) => (a.score / a.max) - (b.score / b.max))
    .slice(0, 3)
    .map(p => p.text);

  return {
    totalScore,
    categoryScores,
    categoryMax,
    mainIssueCategory,
    topProblems,
  };
}
