import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

const PRIZE_VAULT_ABI = [
  {
    "inputs": [
      { "internalType": "address[]", "name": "players", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "name": "addReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export async function POST(req: Request) {
  try {
    const { playerAddress, score } = await req.json();
    if (!playerAddress || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    const privateKey = process.env.ADMIN_PRIVATE_KEY;
    const vaultAddress = process.env.NEXT_PUBLIC_PRIZE_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000'; // Fallback for local testing if env is missing

    if (!privateKey) {
      // If we are developing locally without an admin key, we just pretend it worked!
      return NextResponse.json({ success: true, message: '[Simulated] Reward allocated. Add ADMIN_PRIVATE_KEY to truly mint on chain.' });
    }

    const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http()
    }).extend(publicActions);

    // Calculate reward (e.g., 1 CRUSH per 100 points, CRUSH has 18 decimals)
    const _multiplier = 100;
    const crushAmount = BigInt(Math.floor(score / _multiplier)) * 10n ** 18n;

    if (crushAmount <= 0n) {
      return NextResponse.json({ success: true, message: 'Score too low for a token reward' });
    }

    // Execute transaction on Base Sepolia
    const { request } = await client.simulateContract({
      address: vaultAddress as `0x${string}`,
      abi: PRIZE_VAULT_ABI,
      functionName: 'addReward',
      args: [[playerAddress as `0x${string}`], [crushAmount]]
    });

    const hash = await client.writeContract(request);
    await client.waitForTransactionReceipt({ hash });

    return NextResponse.json({ success: true, txHash: hash, crushAwarded: crushAmount.toString() });

  } catch (err: any) {
    console.error('Reward API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
