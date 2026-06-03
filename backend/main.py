import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Truth Lens AI API",
    description="Live fact-checking stance analysis and claim cross-referencing backend.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    text: str

def clean_text(text: str) -> str:
    """Basic cleaning of the input claim."""
    return re.sub(r'[^\w\s]', '', text).strip()

def extract_search_keywords(text: str) -> str:
    """Extracts search query keywords by removing stop words."""
    stop_words = {"the","is","at","which","on","and","a","to","in","that","of","for","it","with","as","was","by","an","are","this","be","from","or","have","has","had","not","but","they","you","will","can","if","their","we","about","all","when","what","who","how","why","there","so","out","up","just","like","some","them","would","make","more","these","than","then","also","could","into","only"}
    words = clean_text(text).lower().split()
    keywords = [w for w in words if len(w) > 3 and w not in stop_words]
    # Return up to 8 terms for a highly targeted search
    return " ".join(keywords[:8]) if keywords else "news"

def query_google_news(query: str):
    """
    Queries Google News RSS feed to retrieve live headlines, links, 
    and descriptions regarding the query. Requires zero API keys.
    """
    encoded_query = urllib.parse.quote_plus(query)
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(rss_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        articles = []
        
        for item in root.findall('.//item')[:6]: # Extract top 6 matching articles
            title = item.find('title').text if item.find('title') is not None else "Related Coverage"
            link = item.find('link').text if item.find('link') is not None else ""
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else "Recently"
            source = item.find('source').text if item.find('source') is not None else "Google News"
            
            # Clean up title by removing the source suffix (e.g. "- BBC News")
            clean_title = title
            if " - " in title:
                clean_title = " - ".join(title.split(" - ")[:-1])
                
            articles.append({
                "title": clean_title,
                "url": link,
                "domain": source,
                "publishedAt": pub_date,
                "snippet": f"Latest news coverage regarding '{query}' from {source}."
            })
        return articles
    except Exception as e:
        print(f"Error fetching Google News: {e}")
        return []

def classify_stance(title: str, claim: str) -> str:
    """
    Evaluates stance of a news headline relative to a claim.
    Classifies as 'oppose' if it contains debunk terms, 'support' if aligning,
    and 'mixed' otherwise.
    """
    title_lower = title.lower()
    claim_lower = claim.lower()
    
    # Stance classification markers
    debunk_terms = [
        "fake", "hoax", "myth", "debunk", "false", "misleading", "fact check", 
        "untrue", "incorrect", "refutes", "disputes", "lies", "conspiracy", "debunked",
        "contradicts", "rumor", "erroneous", "scam"
    ]
    
    # If the headline contains opposing or debunking indicators, it disputes the claim
    for term in debunk_terms:
        if term in title_lower:
            return "oppose"
            
    # Count matching words between title and claim
    claim_words = [w for w in clean_text(claim).lower().split() if len(w) > 4]
    matches = sum(1 for w in claim_words if w in title_lower)
    
    # If the title matches key concepts of the claim and doesn't debunk it, it supports the occurrence/reporting of the claim
    if matches >= 3:
        return "support"
                
    return "mixed"

@app.post("/predict")
async def predict_claim(request: ClaimRequest):
    claim_text = request.text
    if not claim_text or len(claim_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Claim text must be at least 20 characters long.")
        
    keywords = extract_search_keywords(claim_text)
    raw_sources = query_google_news(keywords)
    
    sources = []
    support_count = 0
    oppose_count = 0
    mixed_count = 0
    
    for src in raw_sources:
        stance = classify_stance(src["title"], claim_text)
        src["stance"] = stance
        
        if stance == "support":
            support_count += 1
        elif stance == "oppose":
            oppose_count += 1
        else:
            mixed_count += 1
            
        sources.append(src)
        
    # Determine the overall verdict based on sources
    total_sources = len(sources)
    
    if total_sources == 0:
        verdict = "Mixed coverage"
        summary = "No immediate matching search results or public reports found in global news databases."
    else:
        if oppose_count > support_count:
            verdict = "Likely disputed"
            summary = f"Analysis indicates high contradiction. Found {oppose_count} sources disputing the claim."
        elif support_count > oppose_count:
            verdict = "Likely supported"
            summary = f"Claim aligns with active reports. Found {support_count} corroborating articles."
        else:
            verdict = "Mixed coverage"
            summary = "Reporting consensus is divided or neutral. Fact-check indices yield conflicting arguments."

    return {
        "verdict": verdict,
        "summary": summary,
        "sources": sources,
        "evidence": {
            "support": support_count,
            "oppose": oppose_count,
            "mixed": mixed_count
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
