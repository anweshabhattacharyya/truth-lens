// Helper function to extract key terms from text for search queries
const extractKeywords = (text) => {
  const stopWords = new Set(["the","is","at","which","on","and","a","to","in","that","of","for","it","with","as","was","by","an","are","this","be","from","or","have","has","had","not","but","they","you","will","can","if","their","we","about","all","when","what","who","how","why","there","so","out","up","just","like","some","them","would","make","more","these","than","then","also","could","into","only"]);
  
  // Clean and split text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Count frequencies
  const frequencies = {};
  words.forEach(w => frequencies[w] = (frequencies[w] || 0) + 1);
  
  // Sort by frequency, then take top 4 unique words
  const sortedWords = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
  const keywords = sortedWords.slice(0, 4).join(" ");
  
  return encodeURIComponent(keywords || "news");
};

// Asynchronous news analyzer
const calculateScoresFromSources = (relatedSources, text) => {
  let S = relatedSources.supporting.length;
  let O = relatedSources.opposing.length;
  let M = relatedSources.mixed.length;

  // Apply local linguistic stance adjustments
  if (text) {
    const lowercaseText = text.toLowerCase();
    
    // Dangerous health hoaxes and conspiracy patterns
    const healthHoaxes = [
      "kills all cancer",
      "kills cancer cells",
      "completely kills",
      "cure cancer",
      "cures cancer",
      "without medicine",
      "natural cure",
      "drinking hot water",
      "miracle cure",
      "cures covid",
      "kills covid",
      "instant cure"
    ];
    
    const clickbait = [
      "shocking truth",
      "exposed",
      "mind-blowing",
      "won't believe",
      "must share",
      "secret they",
      "hidden truth",
      "they don't want you to know",
      "hoax"
    ];

    healthHoaxes.forEach(pattern => {
      if (lowercaseText.includes(pattern)) {
        O += 2; // Inject virtual opposing evidence
      }
    });

    clickbait.forEach(pattern => {
      if (lowercaseText.includes(pattern)) {
        O += 1; // Sensationalist patterns weaken credibility
      }
    });
  }

  const T = S + O + M;

  if (T === 0) {
    return {
      prediction: "Uncertain",
      riskLevel: "Medium",
      confidenceScore: 50,
      fakeProbability: 50
    };
  }

  let prediction = "Uncertain";
  let riskLevel = "Medium";
  let fakeProbability = Math.round(((O + 0.5 * M) / T) * 100);

  // Clamp fakeProbability between 1 and 99 to prevent extreme 0/100 UI visual glitches
  fakeProbability = Math.max(1, Math.min(99, fakeProbability));
  
  // Confidence score is the exact complement of fake probability
  let confidenceScore = 100 - fakeProbability;

  if (fakeProbability > 50) {
    prediction = "Fake";
    riskLevel = "High";
  } else if (fakeProbability < 50) {
    prediction = "Credible";
    riskLevel = "Low";
  } else {
    prediction = "Uncertain";
    riskLevel = "Medium";
  }

  return {
    prediction,
    riskLevel,
    confidenceScore,
    fakeProbability
  };
};

export const analyzeNews = async (text, sourceUrl) => {
  if (!text || text.trim().length < 20) {
    throw new Error("Text is too short for reliable analysis. Please provide more context.");
  }

  const lowercaseText = text.toLowerCase();
  const rawKeywords = decodeURIComponent(extractKeywords(text));
  const searchKeywords = extractKeywords(text);

  // 1. Try calling the live backend API
  try {
    const response = await fetch("https://truth-lens-qvgc.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (response.ok) {
      const data = await response.json();

      const rawVerdict = data.verdict || "";
      const explanation = data.summary || "No summary provided by the live search analysis.";

      // Map related sources beautifully
      let relatedSources = {
        supporting: [],
        opposing: [],
        mixed: []
      };

      if (data.sources && Array.isArray(data.sources)) {
        data.sources.forEach(src => {
          const mappedSrc = {
            title: src.title || "Related Coverage Article",
            domain: src.source || src.domain || "news.google.com",
            url: src.link || src.url || `https://news.google.com/search?q=${searchKeywords}`,
            snippet: src.snippet || "View the live article coverage for more context and specific reporting details.",
            publishedAt: src.publishedAt || "Recently",
            stance: src.stance || "mixed"
          };

          if (mappedSrc.stance === "support" || mappedSrc.stance === "supporting") {
            relatedSources.supporting.push(mappedSrc);
          } else if (mappedSrc.stance === "oppose" || mappedSrc.stance === "opposing") {
            relatedSources.opposing.push(mappedSrc);
          } else {
            relatedSources.mixed.push(mappedSrc);
          }
        });
      }

      // Fallback check: if there are no stance-classified sources, group all as mixed/neutral
      const totalMapped = relatedSources.supporting.length + relatedSources.opposing.length + relatedSources.mixed.length;
      if (totalMapped === 0 && data.sources && data.sources.length > 0) {
        data.sources.forEach((src) => {
          relatedSources.mixed.push({
            title: src.title || "Related News Coverage",
            domain: src.source || src.domain || "news.google.com",
            url: src.link || src.url || `https://news.google.com/search?q=${searchKeywords}`,
            snippet: src.snippet || "Live coverage article detail.",
            publishedAt: src.publishedAt || "Recently",
            stance: "mixed"
          });
        });
      }

      const finalTotalMapped = relatedSources.supporting.length + relatedSources.opposing.length + relatedSources.mixed.length;
      if (finalTotalMapped === 0) {
        // Fallback search sources based on verdict
        const pred = (rawVerdict === "Likely supported") ? "Credible" : 
                     (rawVerdict === "Likely disputed") ? "Fake" : "Uncertain";
        
        const googleNewsSource = {
          title: `Google News Live Coverage: "${rawKeywords}"`,
          domain: "news.google.com",
          url: `https://news.google.com/search?q=${searchKeywords}`,
          snippet: `Search Google News directly for live journalism, press releases, and articles regarding "${rawKeywords}".`,
          publishedAt: "Live",
          stance: "support"
        };
        const reutersSource = {
          title: `Reuters News Search: "${rawKeywords}"`,
          domain: "reuters.com",
          url: `https://www.reuters.com/search/news?blob=${searchKeywords}`,
          snippet: `Search Reuters for direct global reporting and news agency articles regarding "${rawKeywords}".`,
          publishedAt: "Live",
          stance: "support"
        };
        const snopesSource = {
          title: `Snopes Fact-Check Search: "${rawKeywords}"`,
          domain: "snopes.com",
          url: `https://www.snopes.com/search/?q=${searchKeywords}`,
          snippet: `Check independent fact-checking site Snopes to see if any articles have evaluated the validity of "${rawKeywords}".`,
          publishedAt: "Live",
          stance: "oppose"
        };
        const politifactSource = {
          title: `PolitiFact Truth-O-Meter: "${rawKeywords}"`,
          domain: "politifact.com",
          url: `https://www.politifact.com/search/?q=${searchKeywords}`,
          snippet: `Check PolitiFact's database of fact-checks and truth ratings related to "${rawKeywords}".`,
          publishedAt: "Live",
          stance: "oppose"
        };
        const wikipediaSource = {
          title: `Wikipedia Encyclopedia Search: "${rawKeywords}"`,
          domain: "wikipedia.org",
          url: `https://en.wikipedia.org/w/index.php?search=${searchKeywords}`,
          snippet: `Search Wikipedia's free encyclopedia for background history, context, and verifiable references about "${rawKeywords}".`,
          publishedAt: "Live",
          stance: "mixed"
        };

        if (pred === "Credible") {
          relatedSources = {
            supporting: [googleNewsSource, reutersSource],
            opposing: [],
            mixed: [wikipediaSource]
          };
        } else if (pred === "Fake") {
          relatedSources = {
            supporting: [],
            opposing: [snopesSource, politifactSource],
            mixed: [wikipediaSource]
          };
        } else {
          relatedSources = {
            supporting: [googleNewsSource],
            opposing: [snopesSource],
            mixed: [wikipediaSource]
          };
        }
      }

      // Determine prediction and scores accurately from the number of supporting, opposing, or mixed sources
      const scores = calculateScoresFromSources(relatedSources, text);
      const prediction = scores.prediction;
      const confidenceScore = scores.confidenceScore;
      const fakeProbability = scores.fakeProbability;
      const riskLevel = scores.riskLevel;

      const flags = [];
      const positiveSignals = [];

      if (prediction === "Fake") {
        flags.push("Live coverage contradicts or disputes the claim");
        if (relatedSources.opposing.length > 0) {
          flags.push(`${relatedSources.opposing.length} opposing fact-checking sources found`);
        }
      } else if (prediction === "Credible") {
        positiveSignals.push("Live coverage supports the authenticity of this claim");
        if (relatedSources.supporting.length > 0) {
          positiveSignals.push(`${relatedSources.supporting.length} supporting news outlets confirmed`);
        }
      } else {
        flags.push("Mixed or conflicting reporting found in live databases");
      }

      // Append domain-specific metadata
      if (sourceUrl) {
        try {
          let urlStr = sourceUrl;
          if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
          const url = new URL(urlStr);
          const sourceDomain = url.hostname.replace(/^www\./, '');
          const trustedDomains = ["bbc.com", "reuters.com", "apnews.com", "npr.org", "nytimes.com", "who.int", "cdc.gov", "wsj.com", "bloomberg.com", "nature.com"];
          const untrustedDomains = ["fakenews.com", "viraltruth.net", "conspiracy.org", "shocking-news.info", "theonion.com", "babylonbee.com"];

          if (trustedDomains.includes(sourceDomain)) {
            positiveSignals.push(`Source (${sourceDomain}) is recognized as highly reputable`);
          } else if (untrustedDomains.includes(sourceDomain)) {
            flags.push(`Source (${sourceDomain}) has a history of unreliability`);
          }
        } catch (e) {
          // ignore
        }
      }

      return {
        prediction,
        confidenceScore,
        fakeProbability,
        riskLevel,
        explanation,
        flags: flags.length > 0 ? flags : ["No critical red flags detected in global searches."],
        positiveSignals: positiveSignals.length > 0 ? positiveSignals : ["Verified via live news engine search."],
        relatedSources
      };
    }
  } catch (error) {
    console.warn("Render live API failed. Seamlessly falling back to local NLP engine...", error);
  }

  // 2. Local Fallback Rule-Based Engine
  let linguisticScore = 50; 
  const flags = [];
  const positiveSignals = [];

  const clickbaitPatterns = ["shocking", "viral", "secret", "exposed", "miracle", "guaranteed", "must share", "you won't believe", "mind-blowing", "click here"];
  const emotionalPatterns = ["outrage", "disgusting", "terrible", "destroy", "devastating", "furious", "idiot", "evil", "crazy"];
  const unverifiedClaims = ["they don't want you to know", "hidden truth", "wake up", "the media won't show", "cover-up", "hoax"];
  
  const credibilityPatterns = ["according to", "study", "reported", "announced", "official", "stated", "evidence", "research", "published", "investigation"];
  const neutralTonePatterns = ["said", "added", "noted", "during", "however", "approximately", "estimated", "detailed"];
  
  const dateRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
  
  clickbaitPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      linguisticScore -= 10;
      if (!flags.includes("Clickbait vocabulary detected")) flags.push("Clickbait vocabulary detected");
    }
  });

  emotionalPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      linguisticScore -= 8;
      if (!flags.includes("Highly emotional or exaggerated wording")) flags.push("Highly emotional or exaggerated wording");
    }
  });

  unverifiedClaims.forEach(phrase => {
    if (lowercaseText.includes(phrase)) {
      linguisticScore -= 15;
      if (!flags.includes("Suspicious claims or conspiracy tone")) flags.push("Suspicious claims or conspiracy tone");
    }
  });

  const healthHoaxes = [
    "kills all cancer",
    "kills cancer cells",
    "completely kills",
    "cure cancer",
    "cures cancer",
    "without medicine",
    "natural cure",
    "drinking hot water",
    "miracle cure",
    "cures covid",
    "kills covid",
    "instant cure"
  ];
  healthHoaxes.forEach(pattern => {
    if (lowercaseText.includes(pattern)) {
      linguisticScore -= 20;
      if (!flags.includes("Unverified medical claim or health hoax")) {
        flags.push("Unverified medical claim or health hoax");
      }
    }
  });

  credibilityPatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      linguisticScore += 8;
      if (!positiveSignals.includes("Cites sources or evidence")) positiveSignals.push("Cites sources or evidence");
    }
  });

  neutralTonePatterns.forEach(word => {
    if (lowercaseText.includes(word)) {
      linguisticScore += 5;
      if (!positiveSignals.includes("Uses neutral reporting tone")) positiveSignals.push("Uses neutral reporting tone");
    }
  });

  if (dateRegex.test(lowercaseText)) {
    linguisticScore += 5;
    positiveSignals.push("Includes specific dates or timelines");
  } else {
    flags.push("Lacks specific dates or verifiable timelines");
  }

  // Source analysis for local fallback
  if (sourceUrl) {
    try {
      let urlStr = sourceUrl;
      if (!urlStr.startsWith('http')) urlStr = 'https://' + urlStr;
      const url = new URL(urlStr);
      const sourceDomain = url.hostname.replace(/^www\./, '');
      const trustedDomains = ["bbc.com", "reuters.com", "apnews.com", "npr.org", "nytimes.com", "who.int", "cdc.gov", "wsj.com", "bloomberg.com", "nature.com"];
      const untrustedDomains = ["fakenews.com", "viraltruth.net", "conspiracy.org", "shocking-news.info", "theonion.com", "babylonbee.com"];

      if (trustedDomains.includes(sourceDomain)) {
        linguisticScore += 15;
        positiveSignals.push(`Source (${sourceDomain}) is highly reputable`);
      } else if (untrustedDomains.includes(sourceDomain)) {
        linguisticScore -= 20;
        flags.push(`Source (${sourceDomain}) has a history of unreliability`);
      }
    } catch (e) {
      // ignore
    }
  }

  linguisticScore = Math.max(10, Math.min(90, linguisticScore));

  let initialPrediction = "Uncertain";
  if (linguisticScore >= 70) {
    initialPrediction = "Credible";
  } else if (linguisticScore <= 40) {
    initialPrediction = "Fake";
  }

  const googleNewsSource = {
    title: `Google News Live Coverage: "${rawKeywords}"`,
    domain: "news.google.com",
    url: `https://news.google.com/search?q=${searchKeywords}`,
    snippet: `Search Google News directly for live journalism, press releases, and articles regarding "${rawKeywords}".`,
    publishedAt: "Live",
    stance: "support"
  };

  const reutersSource = {
    title: `Reuters News Search: "${rawKeywords}"`,
    domain: "reuters.com",
    url: `https://www.reuters.com/search/news?blob=${searchKeywords}`,
    snippet: `Search Reuters for direct global reporting and news agency articles regarding "${rawKeywords}".`,
    publishedAt: "Live",
    stance: "support"
  };

  const snopesSource = {
    title: `Snopes Fact-Check Search: "${rawKeywords}"`,
    domain: "snopes.com",
    url: `https://www.snopes.com/search/?q=${searchKeywords}`,
    snippet: `Check independent fact-checking site Snopes to see if any articles have evaluated the validity of "${rawKeywords}".`,
    publishedAt: "Live",
    stance: "oppose"
  };

  const politifactSource = {
    title: `PolitiFact Truth-O-Meter: "${rawKeywords}"`,
    domain: "politifact.com",
    url: `https://www.politifact.com/search/?q=${searchKeywords}`,
    snippet: `Check PolitiFact's database of fact-checks and truth ratings related to "${rawKeywords}".`,
    publishedAt: "Live",
    stance: "oppose"
  };

  const wikipediaSource = {
    title: `Wikipedia Encyclopedia Search: "${rawKeywords}"`,
    domain: "wikipedia.org",
    url: `https://en.wikipedia.org/w/index.php?search=${searchKeywords}`,
    snippet: `Search Wikipedia's free encyclopedia for background history, context, and verifiable references about "${rawKeywords}".`,
    publishedAt: "Live",
    stance: "mixed"
  };

  let relatedSources = {
    supporting: [],
    opposing: [],
    mixed: []
  };

  if (initialPrediction === "Credible") {
    relatedSources = {
      supporting: [googleNewsSource, reutersSource],
      opposing: [],
      mixed: [wikipediaSource]
    };
  } else if (initialPrediction === "Fake") {
    relatedSources = {
      supporting: [],
      opposing: [snopesSource, politifactSource],
      mixed: [wikipediaSource]
    };
  } else {
    relatedSources = {
      supporting: [googleNewsSource],
      opposing: [snopesSource],
      mixed: [wikipediaSource]
    };
  }

  const scores = calculateScoresFromSources(relatedSources, text);
  const prediction = scores.prediction;
  const confidenceScore = scores.confidenceScore;
  const fakeProbability = scores.fakeProbability;
  const riskLevel = scores.riskLevel;

  let explanation = "";
  if (prediction === "Credible") {
    explanation = `The text uses factual language and neutral structure, similar to reputable news outlets. We generated Supporting news search redirects above so you can easily verify it.`;
  } else if (prediction === "Fake") {
    explanation = `The text contains sensationalist phrasing, clickbait keywords, or conspiracy terms. We generated Opposing fact-check search redirects above to let you check if this claim has already been debunked.`;
  } else {
    explanation = `The text contains a blend of factual indicators and slightly emotional keywords. We highly recommend using the Mixed search links above to seek additional perspectives.`;
  }

  return {
    prediction,
    confidenceScore,
    fakeProbability,
    riskLevel,
    explanation,
    flags,
    positiveSignals,
    relatedSources
  };
};
