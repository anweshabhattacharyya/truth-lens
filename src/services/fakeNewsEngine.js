export const analyzeNews = (text, sourceUrl) => {
  if (!text || text.trim().length < 20) {
    throw new Error("Text is too short for reliable analysis. Please provide more context.");
  }

  const lowercaseText = text.toLowerCase();
  
  // Weights and parameters
  let score = 50; // Base score (0 = Fake, 100 = Credible)
  const flags = [];
  const positiveSignals = [];

  // Keyword patterns
  const clickbaitPatterns = ["shocking", "viral", "secret", "exposed", "miracle", "guaranteed", "must share", "you won't believe", "mind-blowing", "click here"];
  const emotionalPatterns = ["outrage", "disgusting", "terrible", "destroy", "devastating", "furious", "idiot", "evil", "crazy"];
  const unverifiedClaims = ["they don't want you to know", "hidden truth", "wake up", "the media won't show", "cover-up", "hoax"];
  
  const credibilityPatterns = ["according to", "study", "reported", "announced", "official", "stated", "evidence", "research", "published", "investigation"];
  const neutralTonePatterns = ["said", "added", "noted", "during", "however", "approximately", "estimated", "detailed"];
  
  // Date pattern: DD/MM/YYYY or Month DD, YYYY or YYYY
  const dateRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
  
  // Analyze Fake indicators
  let fakeMatches = 0;
  clickbaitPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      fakeMatches++;
      score -= 8;
      if (!flags.includes("Clickbait vocabulary detected")) flags.push("Clickbait vocabulary detected");
    }
  });

  emotionalPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      fakeMatches++;
      score -= 5;
      if (!flags.includes("Highly emotional or exaggerated wording")) flags.push("Highly emotional or exaggerated wording");
    }
  });

  unverifiedClaims.forEach(phrase => {
    if (lowercaseText.includes(phrase)) {
      fakeMatches++;
      score -= 10;
      if (!flags.includes("Suspicious claims or conspiracy tone")) flags.push("Suspicious claims or conspiracy tone");
    }
  });

  if (lowercaseText.includes("!")) {
    const exclamations = (lowercaseText.match(/!/g) || []).length;
    if (exclamations > 2) {
      score -= 6;
      flags.push("Excessive use of exclamation marks");
    }
  }
  
  // ALL CAPS detection
  const words = text.split(/\s+/);
  const allCapsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (allCapsWords.length > 3) {
    score -= 5;
    flags.push("Excessive use of ALL CAPS (shouting)");
  }

  // Analyze Credibility indicators
  let credMatches = 0;
  credibilityPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      credMatches++;
      score += 6;
      if (!positiveSignals.includes("Cites sources or evidence")) positiveSignals.push("Cites sources or evidence");
    }
  });

  neutralTonePatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      credMatches++;
      score += 3;
      if (!positiveSignals.includes("Uses neutral reporting tone")) positiveSignals.push("Uses neutral reporting tone");
    }
  });

  if (dateRegex.test(lowercaseText)) {
    score += 5;
    positiveSignals.push("Includes specific dates or timelines");
  } else {
    flags.push("Lacks specific dates or verifiable timelines");
  }

  // Source evaluation (Mock)
  const trustedDomains = ["bbc.com", "reuters.com", "apnews.com", "npr.org", "nytimes.com", "who.int", "cdc.gov", "wsj.com", "bloomberg.com", "nature.com"];
  const untrustedDomains = ["fakenews.com", "viraltruth.net", "conspiracy.org", "shocking-news.info", "theonion.com", "babylonbee.com"];

  let sourceDomain = "";
  if (sourceUrl) {
    try {
      let urlStr = sourceUrl;
      if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
      const url = new URL(urlStr);
      sourceDomain = url.hostname.replace(/^www\./, '');
      
      if (trustedDomains.includes(sourceDomain)) {
        score += 15;
        positiveSignals.push(`Source (${sourceDomain}) is recognized as highly reputable`);
      } else if (untrustedDomains.includes(sourceDomain)) {
        score -= 20;
        flags.push(`Source (${sourceDomain}) has a history of unreliability or satire`);
      } else {
        flags.push(`Source (${sourceDomain}) is not recognized in our trusted database`);
      }
    } catch (e) {
      flags.push("Invalid source URL provided");
    }
  } else {
    flags.push("No source provided for verification");
  }

  // Cap score between 1 and 99
  score = Math.max(1, Math.min(99, score));

  // Determine Category
  let prediction = "Uncertain";
  let riskLevel = "Medium";
  let explanation = "";

  if (score >= 70) {
    prediction = "Credible";
    riskLevel = "Low";
    explanation = `The text exhibits a neutral tone with factual language and avoids emotional manipulation. ${positiveSignals.length > 0 ? 'It includes credible markers like sourcing and dates.' : ''} The pattern aligns closely with standard journalistic writing.`;
  } else if (score <= 40) {
    prediction = "Fake";
    riskLevel = "High";
    explanation = `The content shows strong signs of manipulation, including clickbait phrases, emotional language, or lack of verifiable evidence. Such patterns are commonly associated with misinformation.`;
  } else {
    prediction = "Uncertain";
    riskLevel = "Medium";
    explanation = `The text has mixed signals. While it contains some factual structuring, it lacks strong evidence or uses mild sensationalism. Please verify with trusted secondary sources before sharing.`;
  }

  return {
    prediction,
    confidenceScore: score,
    riskLevel,
    explanation,
    flags,
    positiveSignals
  };
};
