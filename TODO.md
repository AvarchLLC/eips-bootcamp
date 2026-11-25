# ETHShala Master Sprint Board & Modular Task Assignments

> **Timeline**: 18 November – 1 December 2026 (Launch in 6 days)  
> **Architecture Guide**: See [`docs/ROADMAP_ANALYSIS.md`](./docs/ROADMAP_ANALYSIS.md)  
> **UI Design Standard**: Strictly follow [`DESIGN.md`](./DESIGN.md) (Warm paper ivory `#fcfbf7`, deep pine `#06100e`/`#0a1a16`, Caveat cursive marginalia, no neon cyber-glows).

---

## 🏛 Modular Team Ownership (Zero Merge Conflict Architecture)

To avoid stepping on each other's code and maintain high momentum, the remaining work is divided into **isolated page modules**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MODULE OWNERSHIP BREAKDOWN                      │
├────────────────────────────────────────────────────────────────────────┤
│ 🎮 SUBHRAJEET'S MODULE: Arcade, Games & Student Inventory              │
│    • /dashboard/arcade (Lobby + Protocol Memory + Whack-a-Scam)       │
│    • /dashboard/inventory (Equippable avatars, frames, themes)         │
│    • /api/arcade/* & /api/marketplace/purchase                         │
├────────────────────────────────────────────────────────────────────────┤
│ 🎓 RAJDEEP'S MODULE: Wallet, Verified Credentials & Missions UI        │
│    • /dashboard/wallet (Balance, Base network, transaction ledger)     │
│    • /dashboard/certificates (PDF Generator + /verify/[id] QR lookup)  │
│    • Topbar Level/Coin Pill + Dashboard Daily Missions widget          │
├────────────────────────────────────────────────────────────────────────┤
│ ⚙️ DHANUSH'S MODULE: Core Platform, DB Schema & Admin Payments         │
│    • Prisma schema migrations (CoinTransaction, InventoryItem)        │
│    • Base ERC-20 smart contract (ETHShalaCoin)                         │
│    • /dashboard/admin/payments (Manual order review & 1-click approve) │
│    • SIWE Wallet Authentication integration                            │
├────────────────────────────────────────────────────────────────────────┤
│ 📋 YASH & POOJA'S MODULE: Operations, QA, Curriculum & Tokenomics      │
│    • Manual crypto/fiat payment checking protocol                      │
│    • Course curriculum verification & end-to-end beta testing          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎮 MODULE 1: Subhrajeet Bhattacharjee
**Domain**: Arcade, Games & Student Inventory  
**Target Routes**: `/dashboard/arcade`, `/dashboard/inventory`, `/api/arcade/*`  
**Dependencies Needed from Dhanush**: `CoinTransaction` schema, `coinBalance` field on User.

### Phase 1 Tasks (Due: Nov 26 – Nov 27) `[P0 - Launch Critical]`
- [ ] **Task SB-1: Arcade Lobby (`/dashboard/arcade/page.tsx`)**
  - Create the arcade hub adhering to `DESIGN.md` (warm paper ivory background, game cards with retro hard shadows `shadow-[5px_5px_0px_#0e7955]`).
  - Show user's Arcade high scores, total coins earned from games, and game select cards.
- [ ] **Task SB-2: Game 1 — Protocol Memory (`/app/components/arcade/ProtocolMemory.tsx`)**
  - A card-flip matching game where students match Ethereum terms, EIP numbers, and client logos (e.g., EIP-1559, EIP-4844, Geth, Nethermind).
  - Built with pure React state (`isFlipped`, `matchedPairs`, `timer`, `moves`).
  - Awards 50 XP + 20 Coins on successful match completion under 90 seconds.
- [ ] **Task SB-3: Game 2 — Whack-a-Scam (`/app/components/arcade/WhackAScam.tsx`)**
  - Fast-reaction reflex mini-game: Tap legitimate Ethereum entities (e.g., "Verify Signature", "Hardware Wallet", "EIP Draft") while avoiding scams (e.g., "Free Airdrop DM", "Send Seed Phrase", "Fake Support Bot").
  - Canvas or React grid implementation.
- [ ] **Task SB-4: Score & Reward Submission API (`/api/arcade/submit-score/route.ts`)**
  - Validates game duration and score bounds to prevent client-side score manipulation.
  - Credits user with XP via `XPTransaction` and Coins via `CoinTransaction`.
- [ ] **Task SB-5: Student Inventory Page (`/dashboard/inventory/page.tsx`)**
  - Grid showing all cosmetics owned by the user (custom avatars, profile badges, UI theme borders, XP boosts).
  - "Equip" button that writes active cosmetic IDs to the user's profile.

### Phase 2 Tasks (Due: Nov 28 – Nov 29) `[P1 / P2]`
- [ ] **Task SB-6: Digital Cosmetics Marketplace Expansion (`/dashboard/marketplace`)**
  - Add digital items payable in ETHShala Coins: 3 Custom Avatars, 3 Profile Frames, 1 XP Boost potion.
  - Implement purchase API deducting Coins and adding item to `UserInventory`.
- [ ] **Task SB-7: Arcade Leaderboard Component**
  - Show weekly top arcade scorers.
- [ ] **Task SB-8 (Post-Launch Phase 2)**: *Blockchain Snake*, *Flappy Ether*, *Merge the Blocks*.

---

## 🎓 MODULE 2: Rajdeep Chakraborty
**Domain**: Student Wallet, Verified Credentials & Missions UI  
**Target Routes**: `/dashboard/wallet`, `/dashboard/certificates`, `/verify/[id]`, Topbar & Dashboard widgets  
**Dependencies Needed from Dhanush**: `coinBalance` on User, Certificate completion trigger.

### Phase 1 Tasks (Due: Nov 26 – Nov 27) `[P0 - Launch Critical]`
- [x] **Task RC-1: Topbar Level & Coin Pill (`/app/components/dashboard/Topbar.tsx`)**
  - Calculate Player Level from total XP: `Level = Math.floor(Math.sqrt(xp / 100)) + 1`.
  - Add a Level badge (e.g. `Lvl 3 Explorer`) next to the user's name.
  - Add an ETHShala Coin (`ESHC`) pill in the navbar next to XP with a gold coin icon (`bg-[#ffd359] text-[#111] font-bold px-3 py-1 rounded-full`).
- [ ] **Task RC-2: Daily Missions Dashboard Widget (`/app/components/dashboard/DailyMissionsCard.tsx`)**
  - Connect to existing `UserDailyQuest` data.
  - Render daily tasks (e.g. "Complete 1 Lesson", "Score 80%+ on Daily Quiz", "Play 1 Arcade Game").
  - Include progress bar and an active "Claim Reward" button that triggers toast notifications and awards XP/Coins.
- [ ] **Task RC-3: Downloadable PDF Certificate Generator (`/app/components/certificates/CertificateDownloadButton.tsx`)**
  - Integrate client-side PDF generation (using `html2canvas` + `jspdf` or `@react-pdf/renderer`).
  - Output an official academic certificate with ETHShala branding, student name, track title, unique certificate ID, issue date, and Avarch sign-off.
- [ ] **Task RC-4: Public Certificate Verification Page (`/app/verify/[certificateId]/page.tsx`)**
  - Create a public, unauthenticated route: `ethshala.com/verify/[certificateId]`.
  - Look up certificate metadata in `CompetitionCertificate` / `ModuleCertificate` and display verified badge with timestamp.
  - Render a scannable QR code on the certificate linking directly to this verification URL.

### Phase 2 Tasks (Due: Nov 28 – Nov 29) `[P0 / P1]`
- [x] **Task RC-5: Student Wallet Page (`/dashboard/wallet/page.tsx`)**
  - Header showing connected Ethereum wallet address (via Wagmi) with a "Copy Address" button and Base network indicator badge.
  - Coin Balance Card showing total available `ESHC` coins and fiat equivalent estimate.
  - Transaction History Table listing earned and spent coin activity.
  - "Top-Up Coins" modal trigger and student test faucet.

---

## ⚙️ MODULE 3: Dhanush Naik
**Domain**: Core Platform Engineering, Database Schema & Admin Operations  
**Target Routes**: `prisma/schema.prisma`, `/api/payments/*`, `/dashboard/admin/payments`, Smart Contracts

### Phase 1 Tasks (Due: Nov 25 – Nov 27) `[P0 - Launch Critical]`
- [x] **Task DN-1: Database Schema Expansion (`prisma/schema.prisma`)**
  - Add `coinBalance Int @default(0)` to `User`.
  - Add `CoinTransaction` model (`id`, `userId`, `amount`, `type`, `reason`, `referenceId`, `createdAt`).
  - Add `UserInventory` model (`id`, `userId`, `itemId`, `itemType`, `isEquipped`, `acquiredAt`).
  - Run `npx prisma db push` and `npx prisma generate`.
- [ ] **Task DN-2: Base ERC-20 Smart Contract (`ETHShalaCoin.sol`)**
  - Write standard OpenZeppelin ERC-20 contract for `ETHShalaCoin` (`ESHC`).
  - Deploy to Base Sepolia testnet and verify on Basescan.
- [x] **Task DN-3: Coin Ledger Service & Reward Hooks (`/app/lib/coins.ts`)**
  - Build helper methods: `creditCoins(userId, amount, reason, refId)` and `debitCoins(userId, amount, reason)`.
  - Export server actions for coin operations (`/app/actions/coins.ts`).

### Phase 2 Tasks (Due: Nov 28 – Nov 29) `[P0 / P1]`
- [ ] **Task DN-4: Admin Payment Review Page (`/dashboard/admin/payments/page.tsx`)**
  - Table of pending or completed crypto and PayPal transactions.
  - 1-click "Approve & Grant Module Access" button for manual bank/crypto receipts.
- [ ] **Task DN-5: Sign-In With Ethereum (SIWE)**
  - Add SIWE wallet signature verification linked with existing Better Auth session.

---

## 📋 MODULE 4: Yash Kamal Chaturvedi & Pooja Ranjan
**Domain**: Operations, QA, Curriculum & Tokenomics

- [ ] **Task YC-1: Manual Payment Approval Protocol**: Define operations checklist for manually verifying incoming student crypto transfers or UPI/PayPal receipts (`YC`).
- [ ] **Task YC-2: End-to-End User Testing**: Test the entire student loop: Sign-up -> Quiz -> Arcade -> Inventory -> Certificate (`YC`).
- [ ] **Task PR-1: Tokenomics Balancing**: Validate coin earn rates (quizzes, arcade, quests) vs spend costs (cosmetics, boosts) to prevent hyperinflation (`PR`).
- [ ] **Task PR-2: Ecosystem & Partner Outreach**: Share roadmap progress with Ethereum Foundation / Base ecosystem partners (`PR`).

---

## 🌐 MODULE 5: Cloudflare Hosting & Production Deployment
**Lead**: `DN` | **Priority**: `[P1 - Post-Feature Freeze / Pre-Launch]`

- [ ] **Task CF-1: Cloudflare DNS & Proxy Setup**
  - Migrate domain nameservers to Cloudflare.
  - Enable Full (Strict) SSL/TLS, HTTP/3, and automatic DDoS / bot mitigation.
  - Configure page rules and edge caching headers for static assets, avatars, and fonts.
- [ ] **Task CF-2: Deployment Pipeline (Cloudflare Edge / Container Proxy)**
  - Configure `apps/web` deployment via `@opennextjs/cloudflare` on Cloudflare Workers/Pages, OR deploy containerized instance with Cloudflare proxy routing.
  - Set up Cloudflare Hyperdrive / connection pooling for the PostgreSQL database.
- [ ] **Task CF-3: Production Secrets & Environment Variables**
  - Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, crypto treasury keys, and RPC endpoints in Cloudflare dashboard / secrets.
