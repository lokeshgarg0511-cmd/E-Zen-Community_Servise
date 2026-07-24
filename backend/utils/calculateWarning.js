/**
 * Composite Score = (Attendance x 0.30) + (Assessment Marks x 0.40) + (Submission Timeliness x 0.30)
 * Risk Levels: Excellent >= 80 | Normal 65-79.99 | At Risk < 65
 */
const calculateComposite = ({ attendancePct, marksPct, submissionPct }) => {
  const score = attendancePct * 0.3 + marksPct * 0.4 + submissionPct * 0.3;

  let riskLevel = "normal";
  if (score >= 80) riskLevel = "excellent";
  else if (score < 65) riskLevel = "at-risk";

  return {
    score: Math.round(score * 100) / 100,
    riskLevel,
    breakdown: {
      attendanceScore: attendancePct,
      marksScore: marksPct,
      submissionScore: submissionPct,
    },
  };
};

module.exports = calculateComposite;
