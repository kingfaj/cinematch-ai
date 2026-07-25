# 🎬 CineMatch — AI Group Movie Recommender

> An AI-powered co-viewing recommendation engine that solves group decision paralysis in under 3 minutes using a 10-card sprint and a 4-way gesture interaction model.

![CineMatch Banner](https://via.placeholder.com/1200x600.png?text=CineMatch+4-Way+Swipe+Demo)

## 📌 Executive Summary
Co-viewers routinely waste 15–30 minutes scrolling through streaming catalogs before choosing what to watch. **CineMatch** combines individual 1536-dimensional taste vectors, real-time mood constraints, and hard-veto filtering to deliver a mutually satisfying match in under 3 minutes.

- 🚀 **Live Demo:** [cinematch.vercel.app](https://cinematch.vercel.app) *(Link after deployment)*
- 📄 **Product Requirement Document (PRD):** [Read Full PRD here](docs/PRD.md)
- 📊 **Architecture & Evaluation Report:** [Read Architecture Docs](docs/ARCHITECTURE.md)

---

## 🛠️ Tech Stack & Systems Architecture
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion (Gesture UI)
- **Backend & Database:** Supabase (PostgreSQL + `pgvector`), Next.js Serverless Routes
- **APIs:** TMDB API (Metadata & Media), Watchmode API (Real-Time Streaming Deep Links)
- **AI/ML:** Vector Cosine Similarity Search + Pareto Group Optimization
