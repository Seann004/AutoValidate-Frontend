# 🚗 AutoValidate Frontend Demo

A **demo frontend application** showcasing the usage of the **AutoValidate SDK** and **API** for real-time vehicle data validation.

This frontend allows developers and testers to interact with the **SDK** for client-side validation and the **backend API** for typo correction, semantic search, and document extraction.

---

## 👥 Team Members  
- 👨‍💻 Shawn Chee (Final-Year @ UM)  
- 👨‍💻 Sean Sean (3rd-Year @ UM)  

---
## Test out the **SDK and API directly**:  
👉 [AutoValidate Frontend](https://autovalidate-api-demo.vercel.app/)  

You can try all the validation scenarios, input testing, and document processing features there.  

---
## 🔗 Related Repositories  

- [AutoValidate SDK (Input Validator)](https://github.com/Seann004/Auto-Input-Validator-SDK)  
- [AutoValidate Backend API](https://github.com/Shawnchee/AutoValidate-Backend-API)  
- [AutoValidate Training Pipeline (Airflow)](https://github.com/Shawnchee/AutoValidate-Training-Airflow)  
- [Developer Documentation (v0 – WIP)](https://sss-45.gitbook.io/sss-docs/)  

---

## 🎯 Purpose  

The frontend demonstrates:  

- **SDK integration**: Real-time validation of vehicle inputs (plate number, IC, car model, year, postcode).  
- **API usage**: Multi-stage backend validation and correction pipeline.  
- **Interactive feedback**: Instant results for input testing, including VOC (Vehicle Ownership Certificate) processing.  

---

## 🔧 Features  

### 1. SDK Integration (Frontend Validation)  
- Instant input validation using **AutoValidate SDK**  
- Supports Malaysian formats: IC, car plate, postcode  
- Extensible for **custom validators**  

### 2. API Integration (Backend Correction)  
- Submit inputs to backend API for typo detection and correction  
- Optional VOC upload for deterministic document-based corrections  
- Multi-stage semantic search using embeddings and Qdrant  

### 3. Interactive Testing  
- Real-time input feedback  
- View top suggestions from backend  
- Test all validation and correction scenarios  

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
- **OCR**: VLM (Vision-Language Model) VOC Extraction (optional)
- **Monitoring**: TBC

## 💡 Notes  

- Designed for **developers and testers** to explore all SDK and API functionality.  
- Works **out-of-the-box** with the SDK and API repositories.  
- Provides **real-time feedback** for vehicle data validation scenarios.  
