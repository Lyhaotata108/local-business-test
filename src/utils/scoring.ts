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
    visibility: 20,
    trust: 20,
    conversion: 20,
    offer: 15,
    retention: 15,
    competition: 10,
  };

  const allProblems: { text: string, score: number }[] = [];

  steps.forEach(step => {
    step.questions.forEach(q => {
      if (q.category && answers[q.id]) {
        const option = q.options?.find(o => o.value === answers[q.id]);
        if (option && option.score !== undefined) {
          categoryScores[q.category] += option.score;
          
          if (option.score < 5 && option.problemText) {
             allProblems.push({ text: option.problemText, score: option.score });
          }
        }
      }
    });
  });

  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);

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

  const topProblems = allProblems.sort((a, b) => a.score - b.score).slice(0, 3).map(p => p.text);

  return {
    totalScore,
    categoryScores,
    categoryMax,
    mainIssueCategory,
    topProblems,
  };
}
