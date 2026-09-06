# AI Revenue Recovery Platform

An AI-powered payment recovery platform that uses Google Gemini and retrieval-augmented generation (RAG) to select recovery actions based on a company's own uploaded policy documents — with backend guardrails, human-in-the-loop escalation, real-time updates, and a full audit trail.

## The Problem It Solves

When a payment fails, most systems handle it one of two bad ways: fully manual (a human reviews every single case — slow, doesn't scale) or fully automated with hardcoded if/else rules (rigid, breaks the moment the company's policy changes, and someone has to redeploy code just to adjust a threshold).

This project takes a middle path. A company uploads its actual payment recovery policy as a PDF — no code changes needed when the policy changes. When a payment fails, the system retrieves the relevant rules from that policy document and asks an LLM to decide the correct recovery action grounded in that specific text, citing exactly which policy clause justifies the decision. But the AI is never trusted blindly — every decision passes through deterministic backend guardrails (citation verification, confidence thresholds, hard safety rules, rate limits) before it's allowed to execute, and anything risky or uncertain is routed to a human reviewer instead. Every step — retrieval, decision, block, review, execution — is recorded in an immutable audit trail, so the full story of any single payment event can be reconstructed after the fact.

---

## Live Demo

- **Live Demo** - https://ai-revenue-recovery-frontend-es60.onrender.com/
---

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Socket.IO Client

**Backend:** Node.js, Express, MongoDB (Atlas) + Mongoose, Socket.IO

**AI / RAG:** Google Gemini (`gemini-2.5-flash`) for decision-making with structured JSON output (`responseSchema`), HuggingFace Inference API (`sentence-transformers/all-MiniLM-L6-v2`) for embeddings, ChromaDB for vector storage, LangChain.js for text splitting and vector store integration

**Infrastructure:** Docker (ChromaDB), GitHub Actions (CI), Render (deployment — backend web service, frontend static site, ChromaDB as a Docker web service)

**Auth:** JWT stored in an httpOnly cookie, bcrypt password hashing

---

## Architecture

```
Payment Event (simulated webhook)
        │
        ▼
Idempotency check (unique index on providerEventId)
        │
        ▼
RAG retrieval — situation described in natural language,
top-k relevant policy chunks pulled from ChromaDB
        │
        ▼
Gemini decision — structured JSON output: action,
confidence, reasoning, cited policy text
        │
        ▼
Guardrails — citation grounding check, confidence
threshold, forbidden-action rules, high-value escalation,
outreach rate limiting
        │
        ├── Approved ──────────┐
        │                      ▼
        └── Blocked ──► Human Review ──► Approved/Rejected
                                          │
                                          ▼
                                  Execution (mocked)
                                          │
                                          ▼
                              Audit Trail (every step logged)
                                          │
                                          ▼
                            Real-time push via Socket.IO
```

Multi-tenancy is enforced throughout: every collection scopes to `company`, ChromaDB uses one collection per company (`policies_<companyId>`), and Socket.IO clients join a room per company so updates never leak across tenants.

---

## Folder Structure

**Backend**
```
backend/
  server.js                # entry point — HTTP server + Socket.IO setup
  src/
    app.js                 # Express app, middleware, route mounting
    config/                # DB connection, Gemini client, vector store, socket
    models/                # Mongoose schemas
    controllers/            # route handlers
    routers/                # Express routers
    middleware/             # auth guard, file upload
    services/                # RAG pipeline, decision engine, guardrails, executor, audit logging
```

**Frontend**
```
frontend/
  src/
    components/             # Sidebar, AppLayout (persistent shell)
    features/
      <feature>/
        hooks/useFeature.js
        pages/               # page components
        services/feature.api.js
        feature.context.jsx  # React context + provider
    router.jsx               # route tree, wired to feature.context.jsx providers
    App.jsx                  # provider nesting + RouterProvider
```

Each feature (auth, company, policy, customer, paymentEvent, decision, review, execution, auditLog, analytics) follows the same pattern: an API service, a context/provider holding state, a hook for consuming it, and one or more pages.

---

## API Endpoints

**Auth** (`/api/auth`)
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create account, sets auth cookie |
| POST | `/login` | Log in, sets auth cookie |
| POST | `/logout` | Clear auth cookie |
| GET | `/me` | Get current logged-in user |

**Company** (`/api/companies`)
| Method | Route | Description |
|---|---|---|
| POST | `/` | Create company profile (one per user) |
| GET | `/me` | Get logged-in user's company |
| PUT | `/me` | Update company profile |

**Policies** (`/api/policies`)
| Method | Route | Description |
|---|---|---|
| POST | `/` | Upload a policy document (PDF/TXT), auto-chunks and embeds into ChromaDB |
| GET | `/` | List all policies for the company |
| DELETE | `/:id` | Delete a policy document |
| POST | `/test-retrieve` | (dev/testing) retrieve top-k policy chunks for a raw query |

**Customers** (`/api/customers`)
| Method | Route | Description |
|---|---|---|
| POST | `/` | Create a customer |
| GET | `/` | List all customers |
| GET | `/:id` | Get a single customer |
| PUT | `/:id` | Update a customer |
| DELETE | `/:id` | Delete a customer |

**Payment Events** (`/api/payment-events`)
| Method | Route | Description |
|---|---|---|
| POST | `/simulate` | Simulate a payment event (stand-in for a real gateway webhook) |
| POST | `/ingest` | Ingest an event by explicit `providerEventId`, idempotent — duplicates are safely ignored |
| GET | `/` | List all payment events |
| GET | `/:id` | Get a single payment event |

**Decisions** (`/api/decisions`)
| Method | Route | Description |
|---|---|---|
| POST | `/generate/:eventId` | Generate an AI decision for an event (or return the existing one) |
| GET | `/` | List all decisions |
| GET | `/event/:eventId` | Get the decision for a specific event |

**Reviews** (`/api/reviews`)
| Method | Route | Description |
|---|---|---|
| GET | `/pending` | List decisions blocked by guardrails, awaiting human review |
| PUT | `/:id/approve` | Approve a blocked decision |
| PUT | `/:id/reject` | Reject a blocked decision (notes required) |

**Executions** (`/api/executions`)
| Method | Route | Description |
|---|---|---|
| POST | `/run/:decisionId` | Execute the recommended action for an approved decision |
| GET | `/` | List all executions |

**Audit Logs** (`/api/audit-logs`)
| Method | Route | Description |
|---|---|---|
| GET | `/event/:eventId` | Full chronological audit trail for one payment event |
| GET | `/` | Recent audit log entries across the company (last 50) |

**Analytics** (`/api/analytics`)
| Method | Route | Description |
|---|---|---|
| GET | `/summary` | Aggregated stats — totals, guardrail block rate, decisions by action, execution outcomes |
| GET | `/timeline` | Event volume grouped by day |

All routes except `/register` and `/login` require the auth cookie (`protect` middleware).

---

## Running It Locally

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier)
- Google AI Studio API key (Gemini)
- HuggingFace account + access token
- Docker (for running ChromaDB locally)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ai-revenue-recovery

cd backend
npm install

cd ../frontend
npm install
```

### 2. Run ChromaDB locally

```bash
docker compose up -d chromadb
```

### 3. Environment variables

**`backend/.env`**
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_gemini_api_key
HUGGINGFACEHUB_API_KEY=your_huggingface_token
CHROMA_URL=http://localhost:8000
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run it

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Visit `http://localhost:5173`, register an account, create a company, upload a policy PDF, add a customer, and simulate a payment failure to see a decision get generated end to end.

---

## Future Improvements

- **Connect a real payment gateway and email provider.** The execution layer (`src/services/executor.service.js`) is already built as a swappable interface — replacing the mocked retry/email functions with real Razorpay/Stripe and SendGrid/SES calls wouldn't require touching the guardrail, review, or audit logic around it.
- **Persistent file storage.** Move uploaded policy PDFs to S3/Cloudinary so the original document survives redeploys (currently only the extracted text and embeddings persist, which is all the app actually uses today).
- **Persistent ChromaDB storage in production.** Attach a persistent disk (or move to a managed vector DB) so embeddings survive a Render restart without needing policies re-uploaded.
- **Automated test suite.** CI currently verifies the app builds and boots cleanly; adding unit tests for the guardrail logic and integration tests for the decision pipeline would catch regressions earlier.
- **Support multiple policy versions.** Currently all uploaded policies for a company are retrieved together; versioning (e.g. superseding an old policy) would better reflect how real companies update their rules over time.
- **Retry/backoff for the embedding pipeline**, mirroring the retry logic already built for Gemini calls, so a transient HuggingFace failure during upload doesn't leave a policy stuck in `failed` status.
- **Role-based access within a company** (e.g. an admin vs. a reviewer role), rather than every user having full access to everything in their company.
