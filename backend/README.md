# Truth Lens API Backend

This is the FastAPI backend for the **Truth Lens** claim verification web application. It handles live searches using Google News RSS, checks linguistic stances, and provides API responses.

## Local Setup & Run

1. Navigate to this directory in your terminal:
   ```bash
   cd /Users/anweshabhattacharyya/.gemini/antigravity/scratch/truth-lens-backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Run the FastAPI development server:
   ```bash
   python3 main.py
   ```
   The local server will start at `http://127.0.0.1:8000`. You can test it by opening the docs at `http://127.0.0.1:8000/docs`.

---

## Deploying to Render (Free Tier)

1. Create a new repository on your GitHub account (e.g. `truth-lens-backend`) and upload these files:
   ```bash
   git init
   git add .
   git commit -m "Initialize backend"
   git remote add origin https://github.com/<your-username>/truth-lens-backend.git
   git branch -M main
   git push -u origin main
   ```

2. Log into [Render](https://render.com) and click **New > Web Service**.

3. Link your new `truth-lens-backend` GitHub repository.

4. Set the following configuration:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Once deployed, Render will provide your public URL (e.g., `https://truth-lens-backend.onrender.com`). You can replace the API URL in `src/services/fakeNewsEngine.js` in your frontend project to use your own backend!
