# CustodyLedger EMS

Evidence Management System for secure intake, tracking, and verification of digital evidence.

This project is a role-based web application where police teams register and upload evidence records, and court teams verify those records. It uses blockchain for tamper-resistant record history and IPFS (via Pinata) for file storage.


## Summary

Think of CustodyLedger as a digital evidence ledger:

- Police can submit an evidence entry.
- The file itself is stored in distributed storage (IPFS).
- A secure reference to that file is saved on blockchain.
- Court users can later verify that the evidence record has not been altered.

In simple terms: this system helps prove that a piece of evidence is the same one that was originally submitted.

## Why This Matters

- Trust: records cannot be silently edited.
- Accountability: each action is tied to a user role.
- Traceability: evidence can be tracked and verified later.
- Transparency: authorized users can independently check records.

## Core Capabilities

- Role-based access control (`Police`, `Court`).
- On-chain evidence metadata (ID, description, owner, timestamps).
- IPFS file pinning through Pinata.
- Separate dashboards for operational workflows.
- Local development support using Ganache and Truffle.

## How The System Works

### 1) User and Role Registration

Users are registered with a role. Only valid users can access restricted actions.

### 2) Evidence Submission (Police)

Police users upload a file and add metadata.

- File goes to IPFS through Pinata.
- Returned content hash is written to blockchain with metadata.

### 3) Evidence Verification (Court)

Court users search by evidence ID or browse records.

- They can inspect metadata on-chain.
- They can open the related IPFS file.
- Matching hash + metadata confirms integrity.

## Architecture Overview

### Smart Contract Layer

- Main contract: `contracts/EvidenceManagement.sol`
- Responsibilities:
  - register users
  - assign and enforce roles
  - store evidence metadata keyed by `evidenceId`
  - limit write/read actions by role and registration status

### Frontend Layer

- Login and onboarding: `public/index.html`, `public/app.js`
- Police workflow: `public/dashboard-police.html`, `public/police-dashboard.js`
- Court workflow: `public/dashboard-court.html`, `public/court-dashboard.js`
- Styling: `public/styles.css`

### Storage Layer

- Blockchain (Ethereum local dev network): evidence metadata and permissions
- IPFS (Pinata): evidence file payloads

## Repository Structure

```text
contracts/                   Solidity smart contracts
migrations/                  Deployment scripts (Truffle)
build/contracts/             Generated contract artifacts
public/                      Frontend pages and browser JavaScript
scripts/                     Helper scripts (register users, seed evidence)
truffle-config.js            Truffle networks and compiler config
config.js                    Project-level config
```

## Non-Technical Glossary

- Blockchain: a shared record book where entries are hard to change after writing.
- Smart contract: a program on blockchain that enforces rules automatically.
- IPFS: distributed file storage that identifies files by content hash.
- Hash: a unique digital fingerprint of a file.
- Pinata: a service that stores IPFS files reliably.
- Ganache: a local test blockchain used during development.
- Truffle: a toolkit to compile and deploy smart contracts.

## Local Setup (Step-by-Step)

Run all commands from the project root.

### Prerequisites

- Node.js (LTS version recommended)
- npm / npx
- A modern browser (Chrome, Edge, or Brave)
- Python (for local static file server)
- Pinata account (required for real file upload)
- MetaMask (optional but recommended for wallet/network visibility)

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Start Local Blockchain (Ganache)

Use this exact command to keep account addresses deterministic:

```powershell
npx ganache --server.host 127.0.0.1 --server.port 7545 --chain.chainId 1337 --chain.networkId 1337 --wallet.mnemonic "satoshi fit office spatial stomach west call merit coconut someone price figure"
```

Keep this terminal running.

### Step 3: Compile and Deploy Contracts

```powershell
npx truffle migrate --reset --network development
```

### Step 4: Configure Pinata Credentials

Edit `public/config.js` and add your keys:

```javascript
const config = {
  PINATA_API_KEY: "YOUR_PINATA_API_KEY",
  PINATA_SECRET_API_KEY: "YOUR_PINATA_SECRET_API_KEY"
  // Optional for JWT-based accounts:
  // PINATA_JWT: "YOUR_PINATA_JWT"
};
```

Important: this file is client-side and visible in the browser. Use low-privilege test credentials only.

### Step 5: Register Default Users

```powershell
npx truffle exec .\scripts\register-user.js --network development
npx truffle exec .\scripts\register-court-user.js --network development
```

### Step 6: (Optional) Seed Demo Evidence

```powershell
npx truffle exec .\scripts\seed-evidence.js --network development
```

### Step 7: Start Frontend

```powershell
python -m http.server 8080 --directory public
```

Open this URL in your browser:

`http://localhost:8080`

## Recommended MetaMask Setup

Add a custom network:

- RPC URL: `http://127.0.0.1:7545`
- Chain ID: `1337`
- Currency symbol: `ETH`

Import relevant Ganache test accounts for role-based testing.

## User Journey

### Police User

1. Sign in as a registered police account.
2. Open evidence submission form.
3. Enter case details and upload file.
4. Confirm transaction to write evidence metadata to blockchain.

### Court User

1. Sign in as a registered court account.
2. Search by evidence ID or browse entries.
3. Review details and verify associated IPFS file.

## Security and Compliance Notes

- Do not store production API secrets in browser-side code.
- Use dedicated low-scope Pinata credentials for local testing.
- For production, move uploads to a backend service and keep secrets server-side.
- Rotate exposed or shared keys immediately.
- Use HTTPS and server-side authentication in production deployments.

## Troubleshooting

### Could not fetch chain ID

- Cause: Ganache is not running or network settings are incorrect.
- Fix: verify Ganache is active at `http://127.0.0.1:7545` and chain ID is `1337`.

### RPC endpoint returned too many errors

- Cause: outdated local blockchain tooling or endpoint mismatch.
- Fix: use the Ganache command in this README and redeploy contracts.

### Transaction reverted or out of gas

- Cause: invalid input, duplicate IDs, or execution limits.
- Fix: retry with a new evidence ID and verify role permissions.

### Pinata upload failed (403 / NO_SCOPES_FOUND)

- Cause: Pinata key lacks required permission.
- Fix: create a key with file write permission and update `public/config.js`.

## Script Reference

- `scripts/register-user.js`: creates a default police user.
- `scripts/register-court-user.js`: creates a default court user.
- `scripts/seed-evidence.js`: inserts demo evidence for quick validation.

## Production Readiness Checklist (High Level)

- Move all secrets to backend environment variables.
- Add audit logging and user identity verification.
- Implement approval workflow and evidence status lifecycle.
- Add automated tests (contract + UI + integration).
- Add CI/CD, vulnerability scanning, and release controls.
- Define retention policy and legal hold procedures.

## License

See `LICENSE`.
  












