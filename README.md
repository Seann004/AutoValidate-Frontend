# 🚗 Developer-First Smart Vehicle Data Validation SDK & API (AutoValidate)
---

## 👥 Team Members  
- 👨‍💻Shawn Chee (Final-Year @ UM)
- 👨‍💻Sean Sean (3rd-Year @ UM)

---
## Track & Problem Statement  

**Track:** Industry Collaboration  
**Problem Statement:** Smart Vehicle Data Validation & Error Detection by BJAK  

**Description:**  
When buying or renewing car insurance online, users often mistype or enter incorrect vehicle details (e.g., plate number, car model, year of manufacture).  

**The Problem:**  
These mistakes can:  
- Delay policy approval  
- Cause pricing errors  
- Lead to invalid insurance coverage  

**What the Solution Should Solve:**  
Build a smart system that **detects and corrects typos or inaccurate vehicle input specifications in real time** – ensuring smoother, faster, and more reliable insurance applications.  

---

## 🎞️ Presentation & Demo  
📽️ **Video Demo:** [Watch on YouTube](https://youtu.be/your-demo-link)  
🖥️ **Pitching Slides:** [View Pitch Deck](https://drive.google.com/file/d/14r2BA8vEM3UCE0CVZe8r1d0jY8e___Bt/view?usp=drivesdk)  

---
## 🔧 Project Overview  
Smart Vehicle Data Validation is a two-layer system designed to **detect and correct typos or inaccurate vehicle details in real time** during online insurance applications.  

### 🔹 The Problem  
When users mistype or enter incorrect details (plate number, car model, year):  
- 🚨 Policy approvals get delayed  
- 💸 Pricing errors occur  
- ❌ Invalid insurance coverage risks arise  

### 🔹 The Solution  
Our system combines **instant SDK field validation** (frontend) with a **multi-stage backend API** for correction, ensuring smoother, faster, and more reliable insurance applications.  

### Developer-First Design 🧑‍💻
AutoValidate is built for plug-and-play integration, allowing developers to leverage a complex validation pipeline without deep expertise.
- Lightweight SDK: A standalone JS/TS module for instant client-side validation.
- API Integration: Standard HTTP requests return clean JSON, making it framework-agnostic.
  
---

## ✨ Core Features  

### 1. SDK – Dynamic Field Checking (Frontend Layer)  
The SDK ensures **bad data never reaches the backend** by enforcing instant client-side validation:  

- **Year of Registration** → Numeric only, max 4 digits, auto-blocks alphabets or >4 chars.  
- **IC Number** → Regex format `YYMMDD-XX-XXXX`, real-time validation.  
- **Car Number Plate** → Country-specific regex (e.g., `ABC 1234`, `WXX 123`).  

---

### 2. API – Validation & Correction (Backend Layer)  
- [Backend-API Repo](https://github.com/Shawnchee/AutoValidate-Backend-API)

A **multi-stage intelligence pipeline** validates and corrects vehicle details:  

#### ✅ Step 1: Direct Database Lookup (Supabase)  
- Query authoritative DB (brands, models).  
- Known typo-corrections instantly fixed (`Toyata` → `Toyota`).  
- ⚡ Millisecond response time.  

#### 🔍 Step 2: Embeddings + Vector Search (Qdrant)  
- For unseen typos → convert input into embeddings (HF Embedding Model).  
- Vector similarity search in Qdrant.  
- Retrieve **top-10 candidates**, reranker narrows to **final top-3**.  

#### 📄 Step 3: VOC Biasing (Optional)  
- If user uploads **Vehicle Ownership Certificate (VOC)**:  
  - OCR extracts brand, model, manufactured year.  
  - Bias weighting applied → prioritize results closer to official document.  

---

### 3. Reinforcement & Continuous Learning  
We built a **closed-loop feedback engine** powered by Airflow / Cron Job:  

- Collects user feedback (suggestions selected choices).  
- Fine-tunes reranker → smarter corrections each day.  
- Expands typo-correction DB automatically (seeding).  

💡 The system **gets better the more it’s used**, with zero manual upkeep.  

---

### 4. End-to-End Data Flow  

```
flowchart TD
    A[Frontend SDK] -->|Blocks Invalid Formats| B[API Call]
    B --> C[Supabase Lookup]
    C -->|Known Typo Correction| D[Return Corrected Value]
    C -->|No Match| E[Embedding Search (Qdrant)]
    E --> F[Reranker]
    F -->|Top-3 Suggestions| D
    F -->|VOC Bias| G[Prioritized Suggestions]
    D --> H[User Feedback Stored]
    G --> H
    H --> I[Airflow Retraining]
```
---

## 5. Why This Approach Works  

- ⚡ **Speed** → SDK + Supabase instantly solve **80–90% of cases**.  
- 🎯 **Accuracy** → Embeddings + reranker catch typos & semantic mismatches.  
- 📄 **Adaptability** → VOC uploads bias results toward *real-world official documents*.  
- 🔄 **Continuous Learning** → Airflow retrains daily, errors shrink over time.  

---

## 🚀 Tech Stack  

- **Frontend**: SDK (JS/TS) with Regex Validation (Logic + Rule-Based Validation)
- **Backend**: FastAPI / Node.js  
- **Database**: Supabase 
- **Vector DB**: Qdrant / Weaviate  
- **Embedding Models**: HF Model (TBC)
- **Cross-Encoder Reranker**: Qwen / Jina / HF Reranker
- **Pipelines**: Apache Airflow  
- **OCR**: Tesseract VOC Extraction (optional)
- **Monitoring**: TBC

---

