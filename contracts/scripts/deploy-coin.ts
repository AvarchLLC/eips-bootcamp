import fs from 'fs';
import path from 'path';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

/**
 * Production Deployment script for ETHShalaCoin (ESHC) on Base Sepolia.
 * 
 * Usage:
 *   DEPLOYER_PRIVATE_KEY="0x..." pnpm --filter web tsx contracts/scripts/deploy-coin.ts
 */

const RPC_URL = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;

async function main() {
  if (!PRIVATE_KEY) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('📋 ETHShalaCoin (ESHC) Deployment Dry-Run & Pre-Flight Check');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('Target Network: Base Sepolia (Chain ID: 84532)');
    console.log('RPC Endpoint  : ' + RPC_URL);
    console.log('\n⚠️  To execute a real deployment on Base Sepolia:');
    console.log('   DEPLOYER_PRIVATE_KEY="0x..." pnpm --filter web tsx contracts/scripts/deploy-coin.ts\n');

    // Check compiled artifacts
    const artifactDir = path.resolve(__dirname, '../artifacts');
    const binPath = path.join(artifactDir, 'contracts_ETHShalaCoin_sol_ETHShalaCoin.bin');
    const abiPath = path.join(artifactDir, 'contracts_ETHShalaCoin_sol_ETHShalaCoin.abi');

    if (fs.existsSync(binPath) && fs.existsSync(abiPath)) {
      const bytecode = fs.readFileSync(binPath, 'utf8').trim();
      const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      console.log('✅ Compiled Bytecode: Verified (' + bytecode.length + ' chars)');
      console.log('✅ Compiled ABI     : Verified (' + abi.length + ' contract entries)');
      console.log('Contract Status    : READY FOR BASE SEPOLIA BROADCAST 🚀');
    } else {
      console.error('❌ Artifacts missing. Please compile with npx solc first.');
    }
    console.log('═══════════════════════════════════════════════════════════════════');
    return;
  }

  const account = privateKeyToAccount(PRIVATE_KEY);
  console.log(`🚀 Initiating deployment from: ${account.address}`);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`💰 Account Balance: ${balance} wei on Base Sepolia`);

  if (balance === BigInt(0)) {
    console.error('❌ Account has 0 Base Sepolia ETH. Please fund with testnet faucet first.');
    process.exit(1);
  }

  const artifactDir = path.resolve(__dirname, '../artifacts');
  const binPath = path.join(artifactDir, 'contracts_ETHShalaCoin_sol_ETHShalaCoin.bin');
  const abiPath = path.join(artifactDir, 'contracts_ETHShalaCoin_sol_ETHShalaCoin.abi');

  const bytecode = `0x${fs.readFileSync(binPath, 'utf8').trim()}` as `0x${string}`;
  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

  const initialMinter = (process.env.INITIAL_MINTER || account.address) as `0x${string}`;
  const initialTreasuryMint = BigInt(5_000_000) * BigInt(10 ** 18); // 5,000,000 ESHC

  console.log('📦 Deploying ETHShalaCoin (ESHC)...');
  console.log(`   Initial Minter: ${initialMinter}`);
  console.log(`   Initial Mint  : 5,000,000 ESHC`);

  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [initialMinter, initialTreasuryMint],
  });

  console.log(`📡 Broadcasted TX: https://sepolia.basescan.org/tx/${hash}`);
  console.log('⏳ Awaiting block confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`🎉 ETHShalaCoin successfully deployed!`);
  console.log(`   Contract Address: ${receipt.contractAddress}`);
  console.log(`   Block Number    : ${receipt.blockNumber}`);
  console.log(`   Basescan Link   : https://sepolia.basescan.org/token/${receipt.contractAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
