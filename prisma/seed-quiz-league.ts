import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "postgresql://ethshala_user:ETHShaala6767@143.244.213.59:5432/ethshala?sslmode=disable&connect_timeout=10&schema=public"
});

async function main() {
  console.log('Seeding ETHShala Quiz League data...');

  // 1. Ensure or find users for leaderboard podium
  const demoUsers = [
    {
      email: 'vitalik.builder@ethshala.com',
      name: 'Vitalik Sharma',
      username: 'vitalik_eth',
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      email: 'elena.rodriguez@ethshala.com',
      name: 'Elena Rostova',
      username: 'elena_zk',
      walletAddress: '0x3cD751E6b0078Be393132286c442345e5DC49699',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
    {
      email: 'chen.wei@ethshala.com',
      name: 'Chen Wei',
      username: 'chen_rollup',
      walletAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      email: 'aisha.patel@ethshala.com',
      name: 'Aisha Patel',
      username: 'aisha_evm',
      walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      email: 'marcus.vance@ethshala.com',
      name: 'Marcus Vance',
      username: 'marcus_defi',
      walletAddress: '0x250e76987d838a75310c34bf422ea9f1ac4cc906',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ];

  const createdUsers: any[] = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        username: u.username,
        walletAddress: u.walletAddress,
        image: u.image,
      },
      create: {
        email: u.email,
        name: u.name,
        username: u.username,
        walletAddress: u.walletAddress,
        image: u.image,
        emailVerified: true,
      },
    });
    createdUsers.push(user);
  }

  // 2. Create or update Week 1
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  const week = await prisma.quizWeek.upsert({
    where: { weekNumber: 1 },
    update: {
      title: 'Genesis League: Protocol Foundations',
      description: 'The premier weekly competition covering EVM opcodes, PoS consensus, Layer 2s, and smart contract security.',
      startDate: startOfWeek,
      endDate: endOfWeek,
      status: 'ACTIVE',
    },
    create: {
      weekNumber: 1,
      title: 'Genesis League: Protocol Foundations',
      description: 'The premier weekly competition covering EVM opcodes, PoS consensus, Layer 2s, and smart contract security.',
      startDate: startOfWeek,
      endDate: endOfWeek,
      status: 'ACTIVE',
    },
  });

  console.log(`Quiz Week 1 ready: ${week.id}`);

  // 3. Define 7 Daily Quizzes
  const quizzesData = [
    {
      dayIndex: 1,
      title: 'EVM Internals & Storage Layout',
      topic: 'EVM Architecture',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'AVAILABLE',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'What is the word size of the Ethereum Virtual Machine (EVM) stack and storage slots?',
          codeSnippet: '// EVM Stack & Memory Model\n// PUSH32 0x01...',
          explanation: 'The EVM is a 256-bit word-size virtual machine. Both stack elements and storage slots are 32 bytes (256 bits) in length.',
          points: 20,
          options: [
            { text: '64 bits (8 bytes)', isCorrect: false },
            { text: '128 bits (16 bytes)', isCorrect: false },
            { text: '256 bits (32 bytes)', isCorrect: true },
            { text: '512 bits (64 bytes)', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'Which opcode returns the direct sender of the current external call in Solidity?',
          codeSnippet: 'address sender = msg.sender; // Under the hood:',
          explanation: 'The CALLER opcode (0x33) pushes the address of the account that initiated the current call frame onto the stack.',
          points: 20,
          options: [
            { text: 'ORIGIN (0x32)', isCorrect: false },
            { text: 'CALLER (0x33)', isCorrect: true },
            { text: 'ADDRESS (0x30)', isCorrect: false },
            { text: 'GASPRICE (0x3A)', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'What is the gas behavior difference between REVERT (0xFD) and INVALID (0xFE)?',
          explanation: 'REVERT halts execution, reverts all state changes, but refunds any remaining unused gas to the caller. INVALID consumes all gas provided.',
          points: 20,
          options: [
            { text: 'Both consume all remaining transaction gas', isCorrect: false },
            { text: 'REVERT refunds unused gas; INVALID consumes all remaining gas', isCorrect: true },
            { text: 'INVALID refunds gas; REVERT does not', isCorrect: false },
            { text: 'Neither refunds any gas', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'Which data location in Solidity is immutable, read-only, and cheapest for external function parameters?',
          codeSnippet: 'function verify(bytes calldata proof) external pure returns (bool)',
          explanation: '`calldata` is a non-modifiable, non-persistent area where function arguments are stored directly in the transaction payload without copying into memory.',
          points: 20,
          options: [
            { text: 'storage', isCorrect: false },
            { text: 'memory', isCorrect: false },
            { text: 'calldata', isCorrect: true },
            { text: 'stack', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'How is the storage slot for a mapping entry calculated in Solidity?',
          codeSnippet: 'mapping(address => uint256) public balances;',
          explanation: 'Solidity hashes the 32-byte key padded with the 32-byte slot index: keccak256(abi.encode(key, slotIndex)).',
          points: 20,
          options: [
            { text: 'slotIndex + key', isCorrect: false },
            { text: 'keccak256(abi.encode(key, slotIndex))', isCorrect: true },
            { text: 'sha256(key)', isCorrect: false },
            { text: 'Linear sequential counter from 0', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 2,
      title: 'Proof-of-Stake Consensus & Gas Dynamics',
      topic: 'Consensus & Gas',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'AVAILABLE',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'In Ethereum PoS (Gasper), how many 12-second slots comprise one Epoch?',
          explanation: 'One epoch consists of 32 slots (32 * 12s = 6.4 minutes). Attestations and Casper FFG checkpoint votes are processed per epoch.',
          points: 20,
          options: [
            { text: '16 slots (3.2 minutes)', isCorrect: false },
            { text: '32 slots (6.4 minutes)', isCorrect: true },
            { text: '64 slots (12.8 minutes)', isCorrect: false },
            { text: '128 slots (25.6 minutes)', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'What happens to the base fee introduced in EIP-1559 during block execution?',
          codeSnippet: 'totalFee = (baseFee + priorityFee) * gasUsed',
          explanation: 'Under EIP-1559, the base fee is burned (permanently destroyed), while the priority fee (miner/builder tip) goes to the validator.',
          points: 20,
          options: [
            { text: 'Transferred to the block proposer', isCorrect: false },
            { text: 'Permanently burned and removed from ETH circulation', isCorrect: true },
            { text: 'Deposited into the Ethereum Community Treasury', isCorrect: false },
            { text: 'Refunded to the highest staked validator', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'What is the target block gas limit versus the maximum block gas limit in Ethereum post-EIP-1559?',
          explanation: 'The target gas limit is 15,000,000 gas (50%), while the maximum burst gas limit is 30,000,000 gas (100%).',
          points: 20,
          options: [
            { text: '15M target / 30M maximum', isCorrect: true },
            { text: '10M target / 20M maximum', isCorrect: false },
            { text: '30M target / 60M maximum', isCorrect: false },
            { text: 'Fixed at 30M without dynamic target', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'What is the primary condition that causes a validator to be slashed in Ethereum PoS?',
          explanation: 'Slashing occurs for malicious equivocation: proposing two distinct blocks for the same slot, or double-signing conflicting Casper FFG attestations.',
          points: 20,
          options: [
            { text: 'Being offline for 5 minutes', isCorrect: false },
            { text: 'Double voting or proposing conflicting blocks for the same slot', isCorrect: true },
            { text: 'Executing a transaction that reverts', isCorrect: false },
            { text: 'Sending ETH to an unverified contract', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is the minimum stake required to activate an independent native Ethereum validator?',
          explanation: 'Native solo staking requires exactly 32 ETH deposited into the official Deposit Contract.',
          points: 20,
          options: [
            { text: '16 ETH', isCorrect: false },
            { text: '32 ETH', isCorrect: true },
            { text: '64 ETH', isCorrect: false },
            { text: '1 ETH', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 3,
      title: 'Smart Contract Security & Reentrancy',
      topic: 'Contract Security',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'UPCOMING',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'Which design pattern is universally recommended to prevent Reentrancy attacks?',
          codeSnippet: '// 1. Checks\n// 2. Effects\n// 3. Interactions',
          explanation: 'The Checks-Effects-Interactions (CEI) pattern ensures internal state variables are updated BEFORE making external calls to untrusted addresses.',
          points: 20,
          options: [
            { text: 'Interactions-Effects-Checks', isCorrect: false },
            { text: 'Checks-Effects-Interactions (CEI)', isCorrect: true },
            { text: 'Effects-Checks-Interactions', isCorrect: false },
            { text: 'Always use tx.origin checks', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'Which EIP introduced transient storage opcodes (TSTORE & TLOAD) in Cancun upgrade for cheap reentrancy guards?',
          explanation: 'EIP-1153 introduced TSTORE and TLOAD, providing storage that clears at the end of each transaction, dropping reentrancy guard gas from ~20k to ~100 gas.',
          points: 20,
          options: [
            { text: 'EIP-1559', isCorrect: false },
            { text: 'EIP-1153', isCorrect: true },
            { text: 'EIP-4844', isCorrect: false },
            { text: 'EIP-4337', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'Why should smart contract developers avoid using `tx.origin` for authorization?',
          explanation: 'If an authorized user interacts with a malicious contract, that contract can forward a call to the vulnerable contract, where `tx.origin` still matches the victim.',
          points: 20,
          options: [
            { text: 'tx.origin is deprecated and throws compilation errors', isCorrect: false },
            { text: 'Vulnerable to phishing attacks via malicious intermediate contracts', isCorrect: true },
            { text: 'tx.origin always returns the zero address on L2s', isCorrect: false },
            { text: 'tx.origin costs 10x more gas than msg.sender', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'Starting in Solidity 0.8.0, what happens when integer arithmetic overflows or underflows?',
          codeSnippet: 'uint8 x = 255; x += 1;',
          explanation: 'Solidity 0.8.0+ includes built-in overflow/underflow checks that automatically revert the transaction unless wrapped in an `unchecked` block.',
          points: 20,
          options: [
            { text: 'Silently wraps around to 0 like in C', isCorrect: false },
            { text: 'Automatically causes a Panic revert (0x11)', isCorrect: true },
            { text: 'Requires SafeMath library or it fails to compile', isCorrect: false },
            { text: 'Sets the variable to type(uint).max', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is the primary vulnerability when using `block.timestamp` as a random seed in on-chain raffles?',
          explanation: 'Block proposers can withhold or slightly adjust timestamps within allowable tolerances (up to ~15s) to sway the random outcome in their favor.',
          points: 20,
          options: [
            { text: 'Timestamps are not accessible in EVM', isCorrect: false },
            { text: 'Proposers can manipulate timestamps within valid consensus bounds', isCorrect: true },
            { text: 'Timestamps reset to zero after each epoch', isCorrect: false },
            { text: 'block.timestamp is an encrypted hash', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 4,
      title: 'Layer 2 Scaling: Rollups, ZK & EIP-4844',
      topic: 'L2 Scaling',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'UPCOMING',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'What is the primary difference between Optimistic Rollups and Zero-Knowledge (ZK) Rollups?',
          explanation: 'Optimistic Rollups assume state transitions are valid unless challenged via fraud proofs within a dispute window (~7 days). ZK Rollups prove validity cryptographically upon posting.',
          points: 20,
          options: [
            { text: 'Optimistic Rollups use validity proofs; ZK Rollups use fraud proofs', isCorrect: false },
            { text: 'Optimistic use fraud proofs (dispute window); ZK use cryptographic validity proofs', isCorrect: true },
            { text: 'ZK Rollups execute on Bitcoin; Optimistic execute on Ethereum', isCorrect: false },
            { text: 'Optimistic Rollups cannot execute EVM bytecode', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'What data structure was introduced in EIP-4844 (Proto-Danksharding) to drastically reduce L2 rollup transaction fees?',
          explanation: 'EIP-4844 introduced temporary data "Blobs" that persist on consensus clients for ~18 days instead of permanent calldata in execution state.',
          points: 20,
          options: [
            { text: 'State Trie Merkleization', isCorrect: false },
            { text: 'Data Blobs (Blob-carrying transactions)', isCorrect: true },
            { text: 'ZK-SNARK compression trees', isCorrect: false },
            { text: 'Peer-to-peer state channels', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'Which mathematical commitment scheme is used to verify blobs in EIP-4844 without storing full blob contents in EVM?',
          explanation: 'KZG (Kate-Zaverucha-Goldberg) polynomial commitments allow EVM contracts to verify point evaluations against blobs via the `point evaluation precompile`.',
          points: 20,
          options: [
            { text: 'Merkle Patricia Trie', isCorrect: false },
            { text: 'KZG Polynomial Commitments', isCorrect: true },
            { text: 'RSA Signatures', isCorrect: false },
            { text: 'Keccak256 hash chains', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'What is the standard dispute challenge window for canonical L1 withdrawals in Optimistic Rollups like Arbitrum and Optimism?',
          explanation: 'Standard Optimistic Rollup withdrawal dispute windows are approximately 7 days (1 week) to guarantee honest validators have time to submit fraud proofs.',
          points: 20,
          options: [
            { text: '1 hour', isCorrect: false },
            { text: '24 hours', isCorrect: false },
            { text: '7 days', isCorrect: true },
            { text: '30 days', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is a "Sequencer" in the context of an Ethereum Layer 2 rollup?',
          explanation: 'A sequencer orders and executes transactions off-chain, providing users with instant soft-confirmations before batching them to Layer 1.',
          points: 20,
          options: [
            { text: 'The smart contract that burns ETH base fees', isCorrect: false },
            { text: 'An off-chain entity that orders and batches transactions for L1 settlement', isCorrect: true },
            { text: 'The hardware enclave inside an Ethereum validator', isCorrect: false },
            { text: 'A tool for calculating gas prices', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 5,
      title: 'Token Standards & Account Abstraction (ERC-4337)',
      topic: 'ERC Standards & AA',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'UPCOMING',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'Which ERC standard allows multi-token transfers of both fungible and non-fungible items in a single transaction?',
          explanation: 'ERC-1155 (Multi Token Standard) allows batch operations and management of multiple fungible and non-fungible tokens in one contract.',
          points: 20,
          options: [
            { text: 'ERC-20', isCorrect: false },
            { text: 'ERC-721', isCorrect: false },
            { text: 'ERC-1155', isCorrect: true },
            { text: 'ERC-4626', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'In ERC-4337 Account Abstraction, what entity aggregates and submits `UserOperations` to the EntryPoint contract?',
          explanation: 'Bundlers collect UserOperations from an alternate mempool, package them into an Ethereum transaction, and call `handleOps` on the EntryPoint.',
          points: 20,
          options: [
            { text: 'Paymaster', isCorrect: false },
            { text: 'Bundler', isCorrect: true },
            { text: 'Aggregator Oracle', isCorrect: false },
            { text: 'Relay Subgraph', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'In ERC-4337, what component allows dApps to sponsor gas fees or accept ERC-20 tokens for gas payment?',
          explanation: 'A Paymaster contract inspects and sponsors user transactions or accepts ERC-20 tokens (e.g. USDC) in exchange for paying ETH gas.',
          points: 20,
          options: [
            { text: 'Paymaster', isCorrect: true },
            { text: 'Sequencer', isCorrect: false },
            { text: 'Validator', isCorrect: false },
            { text: 'Vault', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'What is the yield-bearing vault standard introduced by ERC-4626?',
          explanation: 'ERC-4626 defines a standard API for tokenized yield-bearing vaults (deposits, mints, shares, withdrawals) to unify DeFi yield integrations.',
          points: 20,
          options: [
            { text: 'Tokenized Vault Standard', isCorrect: true },
            { text: 'Decentralized Oracle Standard', isCorrect: false },
            { text: 'NFT Royalty Registry', isCorrect: false },
            { text: 'Smart Wallet Factory', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is the signature of `transferFrom` in the ERC-20 token standard?',
          explanation: '`transferFrom(address from, address to, uint256 value) public returns (bool)` transfers tokens from an approved account to a recipient.',
          points: 20,
          options: [
            { text: 'transferFrom(address to, uint256 amount)', isCorrect: false },
            { text: 'transferFrom(address from, address to, uint256 value)', isCorrect: true },
            { text: 'transferFrom(uint256 id, address to)', isCorrect: false },
            { text: 'transferFrom(bytes32 hash, uint256 value)', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 6,
      title: 'DeFi Primitives, AMMs & Oracles',
      topic: 'DeFi Engineering',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'UPCOMING',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'What is the fundamental invariant of the Constant Product Market Maker (Uniswap v2)?',
          codeSnippet: 'uint reserve0;\nuint reserve1;\n// Invariant formula:',
          explanation: 'Uniswap v2 enforces x * y = k, where x and y represent the reserves of the two tokens, and k must remain invariant (or increase due to swap fees).',
          points: 20,
          options: [
            { text: 'x + y = k', isCorrect: false },
            { text: 'x * y = k', isCorrect: true },
            { text: 'x / y = k', isCorrect: false },
            { text: 'x^2 + y^2 = k', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'What is a "Flash Loan" in Ethereum decentralized finance?',
          explanation: 'A flash loan is an uncollateralized loan that must be borrowed and fully repaid with fees within the same atomic transaction.',
          points: 20,
          options: [
            { text: 'A loan that requires 150% over-collateralization', isCorrect: false },
            { text: 'An uncollateralized loan borrowed and repaid within a single atomic transaction', isCorrect: true },
            { text: 'A lightning network micro-payment channel', isCorrect: false },
            { text: 'A 24-hour peer-to-peer loan with fixed APR', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'Why are spot AMM prices dangerous when used directly as on-chain oracles in lending protocols?',
          explanation: 'Spot prices can be manipulated within a single block or transaction using flash loans to trigger wrongful liquidations or under-collateralized borrows.',
          points: 20,
          options: [
            { text: 'Spot prices consume too much memory', isCorrect: false },
            { text: 'Vulnerable to flash loan price manipulation attacks', isCorrect: true },
            { text: 'Spot prices are always 1 day delayed', isCorrect: false },
            { text: 'EVM disallows reading pairs from other contracts', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'What mitigation does Uniswap v3 use to resist short-term price manipulation in its oracle?',
          explanation: 'Uniswap v3 implements geometric Time-Weighted Average Price (TWAP) oracles tracked across cumulative tick observations.',
          points: 20,
          options: [
            { text: 'Centralized admin multisig prices', isCorrect: false },
            { text: 'Time-Weighted Average Price (TWAP) accumulators', isCorrect: true },
            { text: 'Off-chain proof-of-work mining', isCorrect: false },
            { text: 'Halting swaps during high volatility', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is Impermanent Loss experienced by liquidity providers in AMMs?',
          explanation: 'Impermanent loss is the difference in total portfolio value between holding tokens versus providing them as liquidity to an AMM while relative prices shift.',
          points: 20,
          options: [
            { text: 'Gas lost when a swap transaction reverts', isCorrect: false },
            { text: 'The value difference between holding tokens vs providing liquidity when prices change', isCorrect: true },
            { text: 'Permanent slashing of staked tokens in a validator', isCorrect: false },
            { text: 'Slippage paid to MEV searchers', isCorrect: false },
          ],
        },
      ],
    },
    {
      dayIndex: 7,
      title: 'EIP Process & Ethereum Governance',
      topic: 'EIPs & Governance',
      durationMinutes: 5,
      maxPoints: 100,
      status: 'UPCOMING',
      isPublished: true,
      questions: [
        {
          orderIndex: 0,
          question: 'What is the status progression of an Ethereum Improvement Proposal (EIP) defined in EIP-1?',
          explanation: 'Draft -> Review -> Last Call -> Final (or Stagnant / Withdrawn).',
          points: 20,
          options: [
            { text: 'Idea -> Published -> Voted -> Deployed', isCorrect: false },
            { text: 'Draft -> Review -> Last Call -> Final', isCorrect: true },
            { text: 'Submitted -> Approved -> Mainnet', isCorrect: false },
            { text: 'Proposed -> Audited -> Executed', isCorrect: false },
          ],
        },
        {
          orderIndex: 1,
          question: 'What is the difference between a "Core EIP" and an "ERC"?',
          explanation: 'Core EIPs require consensus changes across client implementations (hard forks), whereas ERCs define application-level standards (e.g. tokens, registries).',
          points: 20,
          options: [
            { text: 'There is no difference; ERC is just a newer name for EIP', isCorrect: false },
            { text: 'Core EIPs alter consensus/execution protocols; ERCs define application-level standards', isCorrect: true },
            { text: 'Core EIPs are written by miners; ERCs by wallet builders', isCorrect: false },
            { text: 'ERCs require a hard fork; Core EIPs do not', isCorrect: false },
          ],
        },
        {
          orderIndex: 2,
          question: 'How are decisions finalized in Ethereum protocol governance?',
          explanation: 'Ethereum governance uses off-chain rough consensus among client developers, researchers, node operators, and the community during All Core Devs (ACD) calls.',
          points: 20,
          options: [
            { text: 'On-chain token voting by ETH holders', isCorrect: false },
            { text: 'Off-chain rough consensus among client developers and community', isCorrect: true },
            { text: 'A board of directors at the Ethereum Foundation votes', isCorrect: false },
            { text: 'The largest staking pool determines the roadmap', isCorrect: false },
          ],
        },
        {
          orderIndex: 3,
          question: 'What regular technical conference calls serve as the primary forum for consensus and execution client teams?',
          explanation: 'All Core Devs (ACD) meetings (ACDE for execution, ACDC for consensus) are bi-weekly public calls where protocol proposals and hard forks are coordinated.',
          points: 20,
          options: [
            { text: 'All Core Devs (ACD) calls', isCorrect: true },
            { text: 'DeFi Alliance Board', isCorrect: false },
            { text: 'EVM Standardization Assembly', isCorrect: false },
            { text: 'Global Validator Council', isCorrect: false },
          ],
        },
        {
          orderIndex: 4,
          question: 'What is the required minimum duration for an EIP to remain in "Last Call" status before becoming Final?',
          explanation: 'EIP-1 requires a minimum of 14 days in Last Call status so all stakeholders have sufficient notice to review and voice objections.',
          points: 20,
          options: [
            { text: '48 hours', isCorrect: false },
            { text: '7 days', isCorrect: false },
            { text: '14 days', isCorrect: true },
            { text: '30 days', isCorrect: false },
          ],
        },
      ],
    },
  ];

  for (const qData of quizzesData) {
    const scheduledDate = new Date(startOfWeek);
    scheduledDate.setDate(startOfWeek.getDate() + (qData.dayIndex - 1));
    scheduledDate.setHours(9, 0, 0, 0);

    const quiz = await prisma.quiz.upsert({
      where: {
        weekId_dayIndex: {
          weekId: week.id,
          dayIndex: qData.dayIndex,
        },
      },
      update: {
        title: qData.title,
        topic: qData.topic,
        durationMinutes: qData.durationMinutes,
        maxPoints: qData.maxPoints,
        status: qData.status as any,
        isPublished: qData.isPublished,
        scheduledFor: scheduledDate,
      },
      create: {
        weekId: week.id,
        dayIndex: qData.dayIndex,
        title: qData.title,
        topic: qData.topic,
        durationMinutes: qData.durationMinutes,
        maxPoints: qData.maxPoints,
        status: qData.status as any,
        isPublished: qData.isPublished,
        scheduledFor: scheduledDate,
      },
    });

    // Delete existing questions to re-seed cleanly
    await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });

    for (const quest of qData.questions) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          orderIndex: quest.orderIndex,
          question: quest.question,
          codeSnippet: quest.codeSnippet,
          explanation: quest.explanation,
          points: quest.points,
          options: {
            create: quest.options.map((opt, oIdx) => ({
              orderIndex: oIdx,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
    }
    console.log(`Seeded Quiz Day ${qData.dayIndex}: ${qData.title}`);
  }

  // 4. Seed Leaderboard Weekly Scores for Demo Users
  const scoresData = [
    { userIdx: 0, totalPoints: 195, quizzesCompleted: 2, streak: 2, rank: 1 },
    { userIdx: 1, totalPoints: 185, quizzesCompleted: 2, streak: 2, rank: 2 },
    { userIdx: 2, totalPoints: 170, quizzesCompleted: 2, streak: 2, rank: 3 },
    { userIdx: 3, totalPoints: 155, quizzesCompleted: 2, streak: 1, rank: 4 },
    { userIdx: 4, totalPoints: 140, quizzesCompleted: 2, streak: 2, rank: 5 },
  ];

  for (const s of scoresData) {
    const user = createdUsers[s.userIdx];
    if (user) {
      await prisma.quizWeeklyScore.upsert({
        where: {
          weekId_userId: {
            weekId: week.id,
            userId: user.id,
          },
        },
        update: {
          totalPoints: s.totalPoints,
          quizzesCompleted: s.quizzesCompleted,
          currentStreak: s.streak,
          longestStreak: s.streak,
          rank: s.rank,
        },
        create: {
          weekId: week.id,
          userId: user.id,
          totalPoints: s.totalPoints,
          quizzesCompleted: s.quizzesCompleted,
          currentStreak: s.streak,
          longestStreak: s.streak,
          rank: s.rank,
        },
      });
    }
  }

  // 5. Seed one NFTReward record on Gnosis Chiado testnet / Mainnet for demo
  await prisma.quizNFTReward.upsert({
    where: { weekId: week.id },
    update: {
      winnerId: createdUsers[0].id,
      recipientAddress: createdUsers[0].walletAddress,
      tokenId: '1001',
      tokenUri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/1001.json',
      txHash: '0x3a8e91cb458764ef1a0c841b9a9f5d13bc7492c10817345b12da6d89201948ba',
      status: 'MINTED',
      network: 'Gnosis Chain',
      chainId: 100,
      mintedAt: new Date(),
    },
    create: {
      weekId: week.id,
      winnerId: createdUsers[0].id,
      recipientAddress: createdUsers[0].walletAddress,
      tokenId: '1001',
      tokenUri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/1001.json',
      txHash: '0x3a8e91cb458764ef1a0c841b9a9f5d13bc7492c10817345b12da6d89201948ba',
      status: 'MINTED',
      network: 'Gnosis Chain',
      chainId: 100,
      mintedAt: new Date(),
    },
  });

  console.log('✅ ETHShala Quiz League seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
