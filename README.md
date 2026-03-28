# Candy Chain 🍭🔗

A complete, production-ready, single-repo web application for a match-3 puzzle game with real blockchain prizes paid in $CRUSH tokens.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Game Engine**: Phaser 3 (rendered dynamically, SSR disabled)
- **Web3**: wagmi, viem, RainbowKit on Base L2
- **Contracts**: Hardhat, Solidity, OpenZeppelin
- **Backend/DB**: Supabase (PostgreSQL)

---

## Local Run Instructions

### 1. Web Application
```bash
npm install
npm run dev
```

### 2. Smart Contracts (Hardhat)
Navigate to the `contracts` directory, create a `.env` file using `.env.example`, and fund your deployer address on Base Sepolia.
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/Deploy.ts --network base-sepolia
```

### 3. Supabase Database
Go to your Supabase project dashboard, navigate to the SQL Editor, and run the queries found in `supabase/migrations/0000_schema.sql`.
Set your Supabase URL and Anon Key in `.env.local` inside the root directory.

---

## Deploying to Vercel
Candy Chain is fully optimized for Vercel. 
Simply push to GitHub and import the repository into Vercel. 
Ensure you define the Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PRIVATE_KEY` (Backend admin token minting)
- `NEXT_PUBLIC_PRIZE_VAULT_ADDRESS` (Deployed Proxy Address)

---

## $CRUSH Tokenomics & Utility
Candy Chain implements an efficient Play-to-Earn loop strictly designed for low-cost L2 testnets (Base Sepolia) and free backend deployments (Vercel).

1. **Earn**: Players accumulate off-chain score natively in the Phaser engine.
2. **Convert**: A secure Next.js Serverless API route converts scores into `$CRUSH` allocations on the `PrizeVault` smart contract using an administrative wallet.
3. **Claim**: Players connect their Web3 Wallet on the Dashboard to claim their accumulated `$CRUSH` onto the blockchain.
4. **Spend (Utility)**: 
   - Spend `$CRUSH` to purchase in-game Power-ups (e.g., Color Bombs).
   - Spend `$CRUSH` to buy "Extra Moves" when failing a level.
   - Unlock visual cosmetic skins for your candies.

---

## Security Best Practices
- Keep the `NEXT_PUBLIC_SUPABASE_ANON_KEY` safe inside RLS policies.
- Limit game scores via backend metrics using timestamp evaluation.
- Never expose your `PRIVATE_KEY` outside of the `.env` file during Hardhat deployment.

---

## Mobile Application Roadmap
**Capacitor Route:** 
Wrap the Next.js app with `@capacitor/core` and `@capacitor/cli` using `npx cap init` and build for iOS/Android natively. It will load `GameCanvas` automatically.

**Flutter Route:**
Start a ground-up rewrite using `Flame` for 2D graphics. Use `walletconnect_flutter_v2` for Web3 injection over WalletConnect. Keep using the same Supabase database and Hardhat smart contracts.
