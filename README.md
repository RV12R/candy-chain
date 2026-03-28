# 🍭🔗 Candy Chain

Candy Chain is a complete, production-ready Web3 Match-3 puzzle game. Players clear dynamic candy grids via a highly-optimized Phaser 3 engine to earn off-chain arcade points, which seamlessly convert to on-chain `$CRUSH` token rewards through automated Serverless API integrations. 

![Phaser 3](https://img.shields.io/badge/Phaser.js-3-orange) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-V4-blue) ![Base Sepolia](https://img.shields.io/badge/Base-Sepolia-blue) ![Supabase](https://img.shields.io/badge/Supabase-DB-green)

---

## ⚡ Key Features

- **Gasless Frontend**: Users play pure Web2 Match-3 games without constantly signing transactions. Scores are pushed into a Postgres Database silently.
- **Native Web3 Injections**: Bypass heavy external library downloads using an ultra-fast bespoke Wagmi native dropdown modal.
- **Auto-Calculated Rewards**: Backend services automatically allocate `$CRUSH` token smart-contract claims based on the Supabase daily Hall of Fame. 
- **60fps Neon Arcade Graphics**: Highly optimized gradient mapping and Phaser canvas scaling simulating a neon arcade cabinet natively in the DOM.

---

## 🏗️ Technical Stack

### Frontend & Game Engine
- **Framework**: Next.js 15 (App Router)
- **Game Engine**: Phaser 3 (SSR disabled for native rendering)
- **Styling**: Tailwind CSS V4
- **Blockchain Hooks**: Wagmi v2 + Viem

### Backend & Crypto
- **Database / Auth**: Supabase PostgreSQL
- **Blockchain Network**: Base Sepolia L2
- **Smart Contracts**: Hardhat, Solidity, OpenZeppelin (`CRUSHToken`, `PrizeVault`)
- **API**: Next.js Serverless Routes for reward delegation

---

## 🚀 Getting Started

### 1. Web Application Configuration
Ensure you define the following Environment Variables in `.env.local` to connect to your Supabase and Base Sepolia environments:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PRIVATE_KEY` (Backend admin token minting)
- `NEXT_PUBLIC_PRIZE_VAULT_ADDRESS` (Deployed Proxy Address)

```bash
npm install
npm run dev
```

### 2. Smart Contracts (Hardhat)
Navigate to the `contracts` directory, create a `.env` file, and fund your deployer address on Base Sepolia.
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/Deploy.ts --network base-sepolia
```

### 3. Deploying to Vercel
Candy Chain is fully optimized for Vercel. 
Simply push to GitHub, import the repository into Vercel, inject the environment variables, and click Deploy. Ensure `ADMIN_PRIVATE_KEY` is securely stored.

---

## 🤝 Roadmap & Community
**Mobile Build**: Wrap the Next.js app with Capacitor (`npx cap init`) to natively deploy the `GameCanvas` automatically to iOS/Android app stores while retaining the Web3 wallet injection flows.
