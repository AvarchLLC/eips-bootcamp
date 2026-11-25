# ETHShala Product Development Roadmap & Technical Analysis

> **Prepared For**: ETHShala Core Team  
> **Source Roadmap**: Subhrajeet Bhattacharjee’s Roadmap (18 Nov – 1 Dec 2026)  
> **Audit Date**: 25 November 2026  
> **Remaining Runway**: 6 Days (Target Launch: 1 December 2026)

---

## 1. Executive Summary & Current Health Check

| Milestone | Roadmap Deadline | Status as of Nov 25 | Completion % | Risk Level |
| :--- | :--- | :--- | :---: | :---: |
| **M1: Student Dashboard & Navigation** | 20 Nov | **In Progress** | 65% | Low |
| **M2: ETHShala Coin System** | 22 Nov | **Not Started** | 0% | High |
| **M3: Marketplace & Inventory** | 24 Nov | **Partial (Modules only)**| 20% | High |
| **M4: Arcade & 5 Games** | 26 Nov | **Not Started** | 0% | **Critical** |
| **M5: Missions & Achievements** | 27 Nov | **Backend Done, UI Pending**| 50% | Medium |
| **M6: Courses, Payments & Certificates** | 28 Nov | **Partially Done** | 45% | Medium |
| **M7: Student Wallet & Login** | 29 Nov | **Web3 Configured** | 25% | Medium |
| **M8: Testing & Launch** | 30 Nov – 1 Dec | **Scheduled** | 0% | High |

**Overall Progress**: ~26% of newly proposed roadmap features are complete. Because Milestones 2, 3, and 4 are behind their initial schedule, strategic scope triage is mandatory to guarantee a stable launch on **December 1, 2026**.

---

## 2. Milestone-by-Milestone Analysis: Done vs. Left

### Milestone 1: Student Dashboard & Navigation (Deadline: 20 Nov)
- **What is Already Done**:
  - `DashboardShell`, `Sidebar`, and `Topbar` architecture are functioning (`apps/web/app/dashboard/*`).
  - Real-time XP polling, recent notifications drawer, and dynamic user greeting.
  - Quizzes (`/api/quiz-league`), Streaks (`UserStreak`), and Leaderboards are fully wired to PostgreSQL.
- **What is Left**:
  - **Player Level System**: Formula linking XP to discrete levels (e.g. `Level = Math.floor(Math.sqrt(totalXp / 100)) + 1`) and visual progress bar towards the next level.
  - **Coin Balance Pill**: Topbar currently only displays XP. Needs a secondary gold pill displaying ETHShala Coin balance (`ESHC`).
  - **Achievement Quick-Widget**: Embed a preview of the user's latest unlocked badges into the dashboard overview.

---

### Milestone 2: ETHShala Coin System (Deadline: 22 Nov)
- **What is Already Done**:
  - XP transaction ledger (`XPTransaction`) works reliably for non-financial platform progression.
- **What is Left**:
  - **Database Model**: Add `CoinTransaction` model and `coinBalance Int @default(0)` on `User` in `prisma/schema.prisma`.
  - **Smart Contract on Base**: Standard OpenZeppelin ERC-20 contract (`ETHShalaCoin.sol` / `ESHC`) deployable to Base Sepolia/Mainnet.
  - **Dual-Currency Logic**: Quizzes, assignments, and games need to award both XP (reputation/ranking) and Coins (spendable currency).
  - **Coin Top-Up & Packages**: Coin checkout flow allowing students to acquire packages with fiat (PayPal) or crypto (ETH/USDC on Base).

---

### Milestone 3: Marketplace & Inventory (Deadline: 24 Nov)
- **What is Already Done**:
  - Course/Bootcamp marketplace exists (`/dashboard/marketplace` for purchasing learning modules).
  - Swag/Rewards redemption page exists (`/dashboard/rewards` for spending XP on physical items).
- **What is Left**:
  - **Digital Goods Catalog**: Avatars, profile borders/frames, UI color themes, collectible badge cosmetics, and temporary XP boosts (e.g. 2x XP for 24h).
  - **Currency Transition**: Switch cosmetic purchases from XP to ETHShala Coins.
  - **User Inventory System**: Create `/dashboard/inventory` and `UserInventory` model where students can view their purchased cosmetics and click "Equip / Activate".
  - **Polybase / NFT Badge Records**: Subhrajeet’s roadmap suggests Polybase for NFT records. *Note: Polybase adds unnecessary 3rd party infrastructure complexity. Recommended alternative: standard IPFS metadata or Base L2 on-chain minting using existing Viem/Wagmi stack.*

---

### Milestone 4: Arcade & 5 Games (Deadline: 26 Nov) — **CRITICAL RISK**
- **What is Already Done**:
  - Absolutely nothing exists in the repository for the Arcade or games.
- **What is Left**:
  - Arcade hub page (`/dashboard/arcade`).
  - 5 standalone games:
    1. *Whack-a-Scam* (Phishing/scam awareness reflex game).
    2. *Flappy Ether* (Flappy bird clone with gas/gwei obstacles).
    3. *Protocol Memory* (Card flip memory game with EIP numbers and icons).
    4. *Blockchain Snake* (Snake collecting valid blocks to build a chain).
    5. *Merge the Blocks* (2048-style block combination game).
  - Game session verification API (anti-cheat score hashing).
  - Reward distribution (XP + Coins on completion/high score).
  - Arcade leaderboards.

---

### Milestone 5: Missions & Achievements (Deadline: 27 Nov)
- **What is Already Done**:
  - Prisma models exist: `Achievement`, `UserAchievement`, `UserDailyQuest`.
  - Achievements UI page exists (`/dashboard/achievements`) with rarity filters (COMMON, RARE, EPIC, LEGENDARY) and stats cards.
  - Daily quest tracking schema exists in Prisma (`questKey`: `DAILY_LESSON`, `XP_GOAL`, `ARENA_PRACTICE`).
- **What is Left**:
  - Daily & Weekly Quests UI card on the student dashboard allowing users to claim rewards upon completion.
  - Automatic quest trigger hooks (e.g. completing a lesson dispatches a quest progression check).
  - Coin reward integration for quest completion.

---

### Milestone 6: Courses, Payments & Certificates (Deadline: 28 Nov)
- **What is Already Done**:
  - Automated PayPal order creation & capture (`/api/payments/paypal/*`).
  - Automated Crypto payment verification on-chain (`/api/payments/crypto/verify/*`).
  - Certificate database model (`CompetitionCertificate`) and student certificates showcase (`/dashboard/certificates`).
- **What is Left**:
  - **Manual Payment Verification & Admin Review**:
    - An admin review page (`/dashboard/admin/payments`) listing pending transaction hashes or payment receipts.
    - Admin action to manually grant `ModuleSubscription` or coin balance if automated capture fails.
  - **PDF Certificate Generator**:
    - Client-side or server-side downloadable PDF generator (rendering recipient name, course title, verification ID, date, and signatures).
  - **Public Verification Page**:
    - Route: `/verify/[certificateId]` with QR code lookup allowing employers/campuses to verify authenticity.
  - **Course Completion Trigger**:
    - When a user finishes 100% of lessons in a module, automatically issue a verified certificate.

---

### Milestone 7: Student Wallet & Login (Deadline: 29 Nov)
- **What is Already Done**:
  - RainbowKit + Wagmi configured via `Web3Provider.tsx`.
  - User model has an optional `walletAddress` field.
- **What is Left**:
  - Dedicated `/dashboard/wallet` page showing connected address, network badge (Base), coin balance, and recent ledger entries.
  - **Sign-In With Ethereum (SIWE)** integration with Better Auth to allow passwordless wallet authentication alongside existing email OTP and Google auth.
  - Transfer/Withdrawal or on-chain claim interface for ERC-20 tokens.

---

### Milestone 8: Testing, Polish & Launch (30 Nov – 1 Dec)
- End-to-end user journey test: Sign Up -> Connect Wallet -> Buy Coins / Complete Quest -> Play Arcade Game -> Purchase Inventory Item -> Complete Course -> Download Certificate.
- Cross-browser and responsive mobile testing.
- Database indexing and production seeding.

---

## 3. Time, Effort & Complexity Analysis

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPLEXITY VS EFFORT MATRIX                    │
├────────────────────────────────────────────────────────────────────────┤
│ HIGH EFFORT / HIGH RISK:                                               │
│  • Milestone 4: Arcade & 5 Canvas Games                                │
│    - Risk: 5 games from scratch in 5 days is virtually impossible      │
│      without code re-use or cutting corners.                           │
│    - Strategy: Phase 1 ships 2 polished games; Phase 2 ships 3 later.  │
│                                                                        │
│  • Milestone 2: Coin System & Base ERC-20 Token                        │
│    - Risk: Smart contract deployment + off-chain ledger sync + double   │
│      spending prevention.                                              │
│    - Strategy: Build the Postgres ledger first; deploy Base testnet    │
│      faucet contract next.                                             │
├────────────────────────────────────────────────────────────────────────┤
│ MEDIUM EFFORT / PREDICTABLE:                                           │
│  • Milestone 3: Inventory & Digital Cosmetics (1.5 days)               │
│  • Milestone 6: PDF Certificates & Admin Payment Verification (1.5 days│
│  • Milestone 7: Dedicated Wallet Page & SIWE Auth (1 day)              │
├────────────────────────────────────────────────────────────────────────┤
│ LOW EFFORT / QUICK WINS:                                               │
│  • Milestone 1: Topbar Coin Pill & Level Progress Bar (0.5 day)        │
│  • Milestone 5: Daily Quest Dashboard Widget & Claim Buttons (0.5 day) │
└────────────────────────────────────────────────────────────────────────┘
```

### Strategic Triage Recommendations

1. **Triage the Arcade (Milestone 4)**:
   - **Do not attempt to build 5 custom canvas engines simultaneously before Dec 1**.
   - **Launch with 2 flagship games for Dec 1**:
     - Game 1: **Protocol Memory** (Card flip memory match with Ethereum EIPs & logos — fast to build, highly educational, fully accessible React component).
     - Game 2: **Blockchain Snake** or **Whack-a-Scam** (Canvas-based game with score recording).
   - Label the remaining 3 as *"Coming Soon - Unlocks in Season 2"*.

2. **Polybase vs. Postgres + Base L2**:
   - Subhrajeet's roadmap mentions Polybase for NFT records. Adding an entirely new unvetted decentralized database library (Polybase) right now creates unnecessary build overhead and failure points.
   - Use our existing PostgreSQL schema for instant off-chain indexing, and issue on-chain NFT proofs or metadata directly via Base L2 / IPFS.

---

## 4. Team Task Allocations

| Team Member | Core Focus | Assigned Ownership |
| :--- | :--- | :--- |
| **Dhanush Naik**<br>*(Full Stack Engineer)* | Platform Engineering & Core Architecture | • Coin Database Schema & Ledger Engine (`CoinTransaction`)<br>• Base ERC-20 Token Integration (`ETHShalaCoin`)<br>• SIWE Wallet Authentication integration<br>• Payments Admin Approval Page (`/admin/payments`)<br>• E2E Integration & Performance |
| **Subhrajeet Bhattacharjee**<br>*(Full Stack Intern)* | Gamification, Arcade & Economy | • Arcade Hub (`/dashboard/arcade`)<br>• Game 1: Protocol Memory & Game 2: Blockchain Snake / Whack-a-Scam<br>• Score Submission & Coin Reward API<br>• Marketplace Digital Cosmetics (Avatars, Themes, Boosts)<br>• Student Inventory System (`/dashboard/inventory`) |
| **Rajdeep Chakraborty**<br>*(Full Stack Intern)* | UI Systems, Quests & Credentials | • Topbar Coin Balance & Player Level UI<br>• Daily Quests Dashboard Card & Claim Handlers<br>• PDF Certificate Generator (`/dashboard/certificates`)<br>• Public Verification Route (`/verify/[certificateId]` + QR)<br>• Wallet Dashboard Page (`/dashboard/wallet`) |


---

## 5. Daily Execution Schedule (Nov 25 – Dec 1)

- **Wednesday, Nov 25 (Today)**:
  - Add Coin models to `prisma/schema.prisma` and run migration (`Dhanush`).
  - Add Player Level formula and Coin Balance pill to Topbar (`Rajdeep`).
  - Scaffold `/dashboard/arcade` and develop *Protocol Memory* (`Subhrajeet`).
- **Thursday, Nov 26**:
  - Deploy Base ERC-20 testnet token contract & faucet API (`Dhanush`).
  - Build second arcade game (*Whack-a-Scam* or *Snake*) + Anti-cheat score submit (`Subhrajeet`).
  - Wire Daily Quests card into Dashboard with Claim buttons (`Rajdeep`).
- **Friday, Nov 27**:
  - Build Digital Cosmetics Marketplace items + Coin checkout API (`Subhrajeet`).
  - Build Student Inventory (`/dashboard/inventory`) with "Equip" functionality (`Subhrajeet`).
  - Build PDF Certificate generation engine + `/verify/[id]` public route with QR (`Rajdeep`).
- **Saturday, Nov 28**:
  - Build `/dashboard/admin/payments` for manual crypto/fiat review & approval (`Dhanush`).
  - Build `/dashboard/wallet` page with coin transaction history & top-up modal (`Rajdeep`).
  - Connect course completion to auto-issue certificate (`Dhanush` + `Rajdeep`).
- **Sunday, Nov 29**:
  - Connect SIWE wallet login to Better Auth (`Dhanush`).
  - Link Coin awards to Arcade games and Daily Missions (`Subhrajeet`).
  - Operational testing of payments and rewards (`Yash`).
- **Monday, Nov 30**:
  - Full site feature freeze.
  - End-to-end integration testing, bug fixing, responsive mobile audit (`Entire Team`).
- **Tuesday, Dec 1**:
  - **Launch Day**: Production deployment, release announcement.
