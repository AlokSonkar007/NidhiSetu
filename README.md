# Nidhi Setu

**Every Deposit. Every Date. Accounted For.**

Nidhi Setu is a high-fidelity frontend prototype for security deposit and Fixed Deposit Receipt (FDR) lifecycle management, created for Smart India Hackathon 2026 problem statement **SIH26265** (AICTE Regulation Bureau).

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

Requires Node.js 20 or later.

## Prototype modules

- Overview dashboard and FDR portfolio
- Institution-wise FDR repository with search, filters, pagination and CSV export
- Document register, upload metadata, preview placeholder and version history
- Verification centre with mock OCR extraction, mock bank responses and human scrutiny
- Maturity calendar and configurable reminder window
- Renewal and replacement history
- Release/refund request workflow with maker-checker demonstration
- Alerts and escalation controls
- Reports and CSV downloads
- Chronological audit trail

## Demo roles

Use the role selector on the sign-in screen and switch roles from the top bar:

1. Institution User
2. Scrutiny Officer
3. Approving Authority
4. Bank Verifier
5. Administrator

The demo credentials are prefilled; no real authentication is required.

## Important prototype boundaries

This repository contains a **frontend-only demonstration**. Data is fictional and persists in the current browser through localStorage.

- OCR is represented by predefined sample extraction responses.
- Bank verification uses a mock adapter; no live bank is connected.
- AICTE, email and SMS integrations are not connected.
- Uploaded files are represented by document metadata in the browser; production file storage is not implemented.
- Role switching demonstrates UI permissions and is not a security boundary.
- The audit screen illustrates the proposed HMAC-chain concept but does not provide cryptographic immutability.
- No real institutional, financial or personal records should be entered.

## Suggested production architecture

The frontend is structured to evolve toward Node.js + Express APIs, Python/Tesseract extraction, MySQL persistence, JWT authentication, server-enforced role authorization, secure document storage, authorized bank adapters, notification gateways and server-side tamper-evident audit events.

## Design

Light-only institutional interface using Source Sans 3, restrained banking-blue accents, clear trust labels and responsive layouts. Submitted, Extracted and Bank-confirmed values remain distinct throughout the prototype.
