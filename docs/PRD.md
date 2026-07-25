# Product Requirement Document (PRD)

**Product Name:** CineMatch  
**Document Version:** 1.0.0  
**Author:** Faheem Jalaldeen  
**Status:** Ready for Engineering Review  
**Target Release:** Q3 2026  

---

## 1. Executive Summary & Strategic Context

Group entertainment selection suffers from severe choice overload and preference asymmetry. Co-viewers (couples, roommates, friend groups) routinely spend 15–30 minutes browsing disjointed streaming catalogs before agreeing on a title, frequently defaulting to uninspired choices or abandoning co-viewing altogether.

**CineMatch** addresses this problem by replacing open-ended streaming catalog browsing with a structured **10-Card Sprint** powered by a **4-way gesture interaction model** (Right = Like, Left = Dislike, Down = Skip, Up = Super Like). 

By combining individual preference vectors with real-time mood constraints, streaming availability filters, and hard-veto guardrails, CineMatch reaches a mutually satisfying co-viewing decision in under 3 minutes.

---

## 2. Core Problem & Hypotheses

### Problem Statement
Existing streaming interfaces and recommendation apps suffer from three core design failures:
1. **Endless Browsing Loops:** Unbounded catalog scrolling leads to decision fatigue.
2. **Preference Asymmetry:** Single-user recommendation algorithms fail when forced to aggregate conflicting taste profiles across groups.
3. **Execution Friction:** Recommending titles that are not available on shared streaming subscriptions creates immediate drop-off.

### Hypotheses
* **H1 (Sprint Constraint):** Restricting group sessions to a bounded **10-card deck** reduces average group decision time from >15 minutes to <3 minutes.
* **H2 (Signal Density):** A **4-way gesture model** captures 2x higher preference signal density per session compared to standard binary (up/down) voting.
* **H3 (Hard Veto Efficiency):** Enforcing a **0% leakage threshold** on individual hard-vetoed titles (Dislikes) increases group match satisfaction and session completion rates.

---

## 3. Target Personas

| **Persona**                                     | **Demographics & Context**                                                                                                | **Pain Points**                                                                                                                    | **Goals**                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **1. The Casual Co-Viewer** *(Alex, 28)*        | Watches TV and movies with their partner about three times a week. Usually uses their phone while sitting on the couch.   | Frustrated by endless scrolling across Netflix, Hulu, and other streaming services. Dislikes spending time debating what to watch. | Make a decision in under three minutes with as little effort as possible.                                                       |
| **2. The Opinionated Cinephile** *(Taylor, 32)* | Has deep knowledge of directors, genres, and film tropes. Actively tracks movies using platforms like Letterboxd or IMDb. | Finds generic recommendations frustrating. Dislikes being recommended movies they've already rejected or seen.                     | Receive personalized recommendations that respect hard vetoes and provide rich context such as trailers, ratings, and synopses. |

---

## 4. Key Performance Indicators (KPIs)

### North Star Metric
* **Session Match Rate:** % of started rooms that result in a selected movie match (Target: $\ge 85\%$).

### Secondary Metrics
* **Average Time-to-Match:** Median time from room creation to final selection (Target: $<180\text{ seconds}$).
* **Hard-Veto Leakage Rate:** % of group decks containing a movie marked as "Dislike" by any participant (Target: Strict $0.0\%$).
* **24-Hour Post-Watch Verification Rate:** % of users confirming they watched the matched title (Target: $\ge 60\%$).
* **Organic Invite Rate (K-Factor):** Average number of room invite links shared per active user (Target: $>1.2$).

---

## 5. User Stories & Acceptance Criteria

### User Story 1: Individual Profile & 4-Way Swipe Interaction
> **As an** individual user,  
> **I want to** evaluate movie cards using intuitive 4-way gestures (Right, Left, Down, Up),  
> **So that** the app learns my multi-dimensional taste profile with minimal effort.

* **Acceptance Criteria:**
  * **AC 1.1:** Swiping **Right** registers a `Like` (+1.0 weight); swiping **Left** registers a `Dislike` (-2.0 weight); swiping **Down** registers a `Skip` (0.0 weight); swiping **Up** registers a `Super Like` (+3.0 weight).
  * **AC 1.2:** Card UI displays movie poster, title, release year, runtime, star rating, genre tags, and active streaming platform badges.
  * **AC 1.3:** Swipe gestures trigger tactile haptic feedback on supported mobile devices.
  * **AC 1.4:** Tapping or flipping a card reveals a 2-sentence AI-generated micro-hook and detailed synopsis.

### User Story 2: Asynchronous Room Creation & Invite
> **As a** room host,  
> **I want to** create a co-viewing session, set tonight's mood/runtime constraints, and share a link,  
> **So that** my partner or friends can join and swipe through the same deck on their own devices.

* **Acceptance Criteria:**
  * **AC 2.1:** Host can select active streaming subscriptions (e.g., Netflix, Hulu, Prime Video) and contextual mood filters (e.g., "Cozy & Low Key", "Under 100 mins", "Mind-Bending").
  * **AC 2.2:** App generates a unique, short URL (`cinematch.app/room/XYZ123`) and QR code.
  * **AC 2.3:** Guest users can join via link without mandatory account creation (authenticated via anonymous session tokens).

### User Story 3: 10-Card Sprint & Group Matching
> **As a** participant in a room session,  
> **I want to** swipe through a bounded deck of exactly 10 curated titles,  
> **So that** we can quickly discover overlapping preferences without endless scrolling.

* **Acceptance Criteria:**
  * **AC 3.1:** Deck generation algorithm filters out any movie marked with a `Dislike` by any room participant in past sessions.
  * **AC 3.2:** Deck is restricted to movies available on shared streaming services selected in room configuration.
  * **AC 3.3:** When all participants complete their 10 swipes, the room transitions automatically to the **Match Celebration Screen**.

### User Story 4: Match Resolution & Deep Linking
> **As a** room participant,  
> **I want to** view matched movies and tap a single button to launch the title,  
> **So that** we can immediately begin watching on our chosen streaming service.

* **Acceptance Criteria:**
  * **AC 4.1:** Match screen lists all overlapping titles ranked by combined Pareto utility score.
  * **AC 4.2:** Each match includes a direct deep-link button (e.g., "Watch on Netflix") that launches the title directly in the native streaming app or browser.
  * **AC 4.3:** If multiple matches occur, an interactive "Tie-Breaker Wheel" option is available to select a single winner.

---

## 6. System Architecture & Database Schema

### System Architecture

```

┌──────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [ Next.js PWA / Mobile Web Frontend ]                                   │
│         │                                                                │
│         ├──> [ Serverless API Routes / REST ]                            │
│         │         │                                                      │
│         │         ├──> [ TMDB API ] (Movie Metadata & Media Assets)      │
│         │         ├──> [ Watchmode API ] (Streaming Deep-Links)          │
│         │         └──> [ Supabase (PostgreSQL) ]                         │
│         │                   ├──> `profiles`                              │
│         │                   ├──> `swipes`                                │
│         │                   └──> `rooms`                                 │
│         │                                                                │
│         └──> [ Vector Search Engine ] (Pgvector / Pinecone)              │
│              (1536-dim Taste Vector Cosine Similarity)                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

```

### Complete Database Schema (PostgreSQL / Supabase)

```sql
-- Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. User / Device Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  subscriptions TEXT[] DEFAULT '{}',
  taste_vector VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Individual Swipe Logs Table
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  movie_id INT NOT NULL,
  direction TEXT CHECK (direction IN ('like', 'dislike', 'skip', 'superlike')) NOT NULL,
  dwell_time_ms INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, movie_id)
);

-- 3. Room Sessions Table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  host_id UUID REFERENCES profiles(id),
  participant_ids UUID[] DEFAULT '{}',
  mood_filters JSONB DEFAULT '{}'::jsonb,
  status TEXT CHECK (status IN ('active', 'completed', 'expired')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Movie Embeddings Table
CREATE TABLE movie_embeddings (
  movie_id INT PRIMARY KEY,
  title TEXT NOT NULL,
  genres TEXT[],
  runtime INT,
  platforms TEXT[],
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for Fast Vector Search
CREATE INDEX ON movie_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

```

---

## 7. Functional & Non-Functional Requirements

### Functional Requirements

* **FR 1.1 (Vector Computation):** System shall update individual user taste vectors after every session using weighted vector averages.
* **FR 1.2 (Hard Veto Filter):** System shall execute a deterministic SQL query excluding any title where `swipes.direction = 'dislike'` for any `participant_id` in the room.
* **FR 1.3 (Platform Filtering):** System shall query Watchmode API to verify streaming availability in the user's region before including titles in the room deck.
* **FR 1.4 (Deep Link Resolution):** System shall construct platform-specific URL schemes (e.g., `netflix://title/80117401` or web fallbacks).

### Non-Functional Requirements

* **NFR 2.1 (Latency):** Card deck generation endpoint response time shall be $<500\text{ ms}$ at $p_{95}$.
* **NFR 2.2 (Availability):** System shall maintain $99.9\%$ uptime during peak evening usage hours ($18:00\text{--}23:00$ local time).
* **NFR 2.3 (Performance):** Touch-gesture card stack animation rendering shall maintain $60\text{ fps}$ on standard mobile web browsers without UI thread blocking.

---

## 8. Edge Cases & Risk Mitigation

| Risk / Edge Case | Impact | Mitigation Strategy |
| --- | --- | --- |
| **Zero Matches in 10-Card Sprint** | High | Automatically display a fallback UI with two options: *"Pivot Mood (e.g. switch to Comedy)"* or *"Spin 5 Wildcards"*. |
| **No Shared Subscriptions** | Medium | If participants share zero active streaming accounts, default the deck to free-with-ads platforms (Tubi, YouTube) or paid rental options. |
| **New User Cold Start** | Medium | Present a rapid 3-card "Taste Anchor" choice during initial app launch to seed the user's vector before their first session. |

---

## 9. Release & Execution Roadmap

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            RELEASE ROADMAP                               │
├──────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: MVP Core (Weeks 1–2)                                            │
│ • Next.js Framer Motion 4-Way Swipe Deck UI                              │
│ • TMDB & Watchmode API Integration                                       │
│ • Supabase Schema & Anonymous Token Auth                                 │
│                                                                          │
│ PHASE 2: Group Matching & Sprints (Weeks 3–4)                            │
│ • Room URL Generation (`/room/[id]`)                                     │
│ • Hard-Veto Filter Engine & Pareto Group Aggregator                      │
│ • Match Celebration UI & Tie-Breaker Wheel                               │
│                                                                          │
│ PHASE 3: Evals & Portfolio Publication (Week 5)                          │
│ • Benchmark Eval Suite (Synthetic Pairings & Veto Leakage Checks)         │
│ • PostHog Telemetry & Public Case Study / LinkedIn Write-Up              │
└──────────────────────────────────────────────────────────────────────────┘

```

```

---

<ElicitationsGroup message="Next steps for building your repository:">
  <Elicitation label="Generate Next.js 4-Way Swipe Deck Component" query="Provide the full Next.js component code using Framer Motion for a 4-way gesture swipe card deck with haptic feedback."/>
  <Elicitation label="Generate Supabase SQL Migration & API Route" query="Write the complete Next.js API route and Supabase vector matching query for generating the 10-card group deck."/>
</ElicitationsGroup>

```
