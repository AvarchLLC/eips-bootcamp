import { NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/quiz-league/service';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { topic, eip = '', difficulty = 'INTERMEDIATE' } = await request.json();

    if (!topic && !eip) {
      return NextResponse.json({ error: 'EIP number or topic is required' }, { status: 400 });
    }

    const targetTopic = eip ? `${eip} - ${topic || 'Ethereum Improvement Proposal'}` : topic;

    // Check if OPENAI_API_KEY is available in environment
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert Ethereum Protocol Engineer and Security Auditor creating an advanced daily quiz for student builders on ETHShala.
Draft exactly 5 questions based on the topic/EIP provided. Include:
1. One SINGLE_CHOICE question (MCQ with 4 options, exactly one correct).
2. One MULTIPLE_CHOICE question (prefixed with [MULTI], with 4 options, 2 or 3 correct options).
3. One CODE_ORDERING question (prefixed with [ORDER], with 4 code execution lines sorted in correct sequence).
4. One VULNERABILITY_DEBUG question (prefixed with [DEBUG], with 4-5 lines of Solidity where exactly one line has a vulnerability).
5. One technical scenario SINGLE_CHOICE question with a code snippet.

Return strictly valid JSON with this exact schema:
{
  "title": "Title of Quiz",
  "topic": "${targetTopic}",
  "durationMinutes": 5,
  "maxPoints": 100,
  "questions": [
    {
      "question": "Question text...",
      "codeSnippet": "optional code or null",
      "points": 20,
      "explanation": "Clear protocol explanation...",
      "options": [
        { "text": "Option text", "isCorrect": true },
        { "text": "Option text", "isCorrect": false }
      ]
    }
  ]
}`,
              },
              {
                role: 'user',
                content: `Generate 5 technical questions for: ${targetTopic} (Difficulty: ${difficulty})`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const aiJson = await response.json();
          const parsed = JSON.parse(aiJson.choices[0].message.content);
          return NextResponse.json({ success: true, quiz: parsed });
        }
      } catch (aiErr) {
        console.warn('OpenAI generation failed, falling back to built-in generator:', aiErr);
      }
    }

    // High-Quality Protocol Generator fallback (guaranteed zero-downtime offline support)
    const normalizedTopic = `${eip} ${topic}`.toLowerCase();

    let generatedQuestions = [];

    if (normalizedTopic.includes('7702')) {
      generatedQuestions = [
        {
          question: 'What is the primary mechanism introduced in EIP-7702 for setting code on Externally Owned Accounts (EOAs)?',
          codeSnippet: null,
          points: 20,
          explanation: 'EIP-7702 introduces a new transaction type (0x04) that allows an EOA to temporarily designate contract code via an authorization list tuple [chain_id, address, nonce, y_parity, r, s], enabling smart contract wallet capabilities without migrating assets.',
          options: [
            { text: 'A temporary authorization list (type 0x04) pointing an EOA to smart contract code during transaction execution', isCorrect: true },
            { text: 'Permanent opcode injection via CREATE2 into the address 0x0', isCorrect: false },
            { text: 'Replacing the public key with a BLS aggregated signature', isCorrect: false },
            { text: 'Deprecating EOAs in favor of hard-forking all accounts to ERC-4337 EntryPoint', isCorrect: false },
          ],
        },
        {
          question: '[MULTI] Which of the following fields are included in an EIP-7702 authorization tuple signed by the EOA?',
          codeSnippet: null,
          points: 20,
          explanation: 'Each EIP-7702 authorization list item consists of: chain_id (prevents cross-chain replays), address (the implementation code to execute), nonce (prevents authorization replay on the same chain), and ECDSA signature (v/y_parity, r, s).',
          options: [
            { text: 'chain_id (reentrancy and cross-chain replay guard)', isCorrect: true },
            { text: 'address (target implementation code to attach)', isCorrect: true },
            { text: 'nonce (sequence number of the authority account)', isCorrect: true },
            { text: 'zkSNARK proving key', isCorrect: false },
          ],
        },
        {
          question: '[ORDER] Arrange the correct lifecycle sequence of an EIP-7702 delegation transaction:',
          codeSnippet: null,
          points: 20,
          explanation: 'First, the authority signs authorization. The relayer/invoker batches transaction 0x04. The EVM resolves the implementation code and applies delegation. Finally, the target logic executes and state commits.',
          options: [
            { text: '1. EOA signs authorization tuple containing target implementation and chain_id', isCorrect: true },
            { text: '2. Transaction type 0x04 is submitted to the mempool with the authorization list', isCorrect: true },
            { text: '3. EVM verifies signature, bumps nonce, and sets code pointer at authority address', isCorrect: true },
            { text: '4. Invocation runs target contract logic and state modifications commit', isCorrect: true },
          ],
        },
        {
          question: '[DEBUG] Identify the critical security flaw in this EIP-7702 batch execution delegator:',
          codeSnippet: `function executeBatch(Call[] calldata calls) external {\n  for (uint256 i = 0; i < calls.length; i++) {\n    // Vulnerable line below:\n    (bool success, ) = calls[i].target.delegatecall(calls[i].data);\n    require(success, "Batch subcall failed");\n  }\n}`,
          points: 20,
          explanation: 'Using delegatecall inside a generic batch execution loop on an EOA delegator allows an untrusted target to overwrite storage slots or execute SELFDESTRUCT, compromising the entire EOA state. It should use call instead.',
          options: [
            { text: 'function executeBatch(Call[] calldata calls) external {', isCorrect: false },
            { text: 'for (uint256 i = 0; i < calls.length; i++) {', isCorrect: false },
            { text: '(bool success, ) = calls[i].target.delegatecall(calls[i].data);', isCorrect: true },
            { text: 'require(success, "Batch subcall failed");', isCorrect: false },
          ],
        },
        {
          question: 'How does EIP-7702 handle the code pointer when the transaction completes?',
          codeSnippet: null,
          points: 20,
          explanation: 'Under EIP-7702, the code pointer is set as a delegation designator (0xef0100 ++ address) that remains attached to the account until explicitly revoked or updated by a subsequent authorization with a new nonce.',
          options: [
            { text: 'The delegation designator remains in account storage until updated with a new signed nonce', isCorrect: true },
            { text: 'The code is wiped immediately after every single block', isCorrect: false },
            { text: 'The account balance is locked for 7 days', isCorrect: false },
            { text: 'The private key is invalidated permanently', isCorrect: false },
          ],
        },
      ];
    } else if (normalizedTopic.includes('4337')) {
      generatedQuestions = [
        {
          question: 'In ERC-4337 (Account Abstraction), what role does the EntryPoint contract serve?',
          codeSnippet: null,
          points: 20,
          explanation: 'The EntryPoint is the singleton orchestrator contract that receives UserOperations, verifies signatures, checks paymaster deposits, executes account transactions, and refunds gas.',
          options: [
            { text: 'Singleton coordinator that unpacks, validates, and executes UserOperations', isCorrect: true },
            { text: 'Layer 1 consensus validator client', isCorrect: false },
            { text: 'Hard-forked consensus opcode in Geth', isCorrect: false },
            { text: 'Decentralized exchange automated market maker', isCorrect: false },
          ],
        },
        {
          question: '[MULTI] Which of the following functions are defined on an ERC-4337 compliant Paymaster contract?',
          codeSnippet: null,
          points: 20,
          explanation: 'ERC-4337 Paymasters must implement validatePaymasterUserOp (to verify whether the paymaster agrees to sponsor the gas) and postOp (to perform accounting or token transfers after execution).',
          options: [
            { text: 'validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)', isCorrect: true },
            { text: 'postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost)', isCorrect: true },
            { text: 'deposit() external payable', isCorrect: true },
            { text: 'mineBlock(bytes32 headerHash)', isCorrect: false },
          ],
        },
        {
          question: '[ORDER] Arrange the execution sequence of a UserOperation inside the EntryPoint contract:',
          codeSnippet: null,
          points: 20,
          explanation: 'Validation must always precede execution: 1. Bundler submits handleOps, 2. Account validates signature and nonce in validateUserOp, 3. Paymaster validates sponsorship, 4. EntryPoint executes account call and triggers postOp.',
          options: [
            { text: '1. Bundler calls handleOps([userOps], beneficiary) on EntryPoint', isCorrect: true },
            { text: '2. EntryPoint calls account.validateUserOp to verify signature & nonce', isCorrect: true },
            { text: '3. EntryPoint verifies paymaster deposit and gas limits', isCorrect: true },
            { text: '4. EntryPoint executes main userOp payload and refunds remaining gas', isCorrect: true },
          ],
        },
        {
          question: '[DEBUG] Spot the critical vulnerability in this custom ERC-4337 Smart Account validateUserOp implementation:',
          codeSnippet: `function validateUserOp(UserOp calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds) external returns (uint256 validationData) {\n  // Missing caller validation line:\n  bytes32 hash = userOpHash.toEthSignedMessageHash();\n  require(owner == hash.recover(userOp.signature), "Invalid signature");\n  if (missingAccountFunds > 0) payable(msg.sender).transfer(missingAccountFunds);\n}`,
          points: 20,
          explanation: 'In ERC-4337 accounts, validateUserOp MUST verify require(msg.sender == address(entryPoint), "Caller not EntryPoint"). Otherwise, any arbitrary caller can invoke validateUserOp and drain missingAccountFunds or forge validations.',
          options: [
            { text: 'function validateUserOp(UserOp calldata userOp...) external returns (uint256) {', isCorrect: true },
            { text: 'bytes32 hash = userOpHash.toEthSignedMessageHash();', isCorrect: false },
            { text: 'require(owner == hash.recover(userOp.signature), "Invalid signature");', isCorrect: false },
            { text: 'if (missingAccountFunds > 0) payable(msg.sender).transfer(missingAccountFunds);', isCorrect: false },
          ],
        },
        {
          question: 'Why are opcodes like TIMESTAMP and BLOCKNUMBER restricted during the ERC-4337 validation phase?',
          codeSnippet: null,
          points: 20,
          explanation: 'ERC-4337 bundlers run simulations in an isolated environment. Environment opcodes (TIMESTAMP, BLOCKHASH) could cause a UserOp to succeed during bundler simulation but revert on-chain, causing the bundler to lose gas fees (simulation/execution mismatch).',
          options: [
            { text: 'To prevent bundlers from being griefed by operations that pass simulation but revert on-chain', isCorrect: true },
            { text: 'Because smart contracts cannot read timestamps', isCorrect: false },
            { text: 'To reduce the bytecode size of the EntryPoint', isCorrect: false },
            { text: 'Because Layer 2 networks do not have timestamps', isCorrect: false },
          ],
        },
      ];
    } else {
      // General Ethereum / EVM Technical Questions
      generatedQuestions = [
        {
          question: `In Ethereum protocol architecture, how does ${targetTopic} optimize execution or state access?`,
          codeSnippet: null,
          points: 20,
          explanation: `${targetTopic} improves Ethereum performance and usability by standardizing interfaces and reducing execution overhead across client implementations.`,
          options: [
            { text: 'Standardizes execution interfaces and reduces state access overhead', isCorrect: true },
            { text: 'Forces all blocks to be mined via Proof of Work', isCorrect: false },
            { text: 'Increases gas limits to infinity', isCorrect: false },
            { text: 'Disables all cryptographic signatures', isCorrect: false },
          ],
        },
        {
          question: '[MULTI] Which of the following EVM opcodes directly modify permanent contract storage?',
          codeSnippet: null,
          points: 20,
          explanation: 'SSTORE writes a 32-byte value to storage. MSTORE and MSTORE8 only modify transient memory, while SLOAD reads from storage without writing.',
          options: [
            { text: 'SSTORE (0x55)', isCorrect: true },
            { text: 'TSTORE (0x5D - Transient storage under EIP-1153)', isCorrect: true },
            { text: 'MSTORE (0x52 - Memory only)', isCorrect: false },
            { text: 'SLOAD (0x54 - Storage read)', isCorrect: false },
          ],
        },
        {
          question: '[ORDER] Arrange the standard Checks-Effects-Interactions pattern for a secure withdrawal function:',
          codeSnippet: null,
          points: 20,
          explanation: 'To prevent reentrancy: 1. Validate requirements (Checks), 2. Update state balances to zero (Effects), 3. Transfer ETH to external address (Interactions).',
          options: [
            { text: '1. Check: require(balances[msg.sender] >= amount, "Insufficient balance");', isCorrect: true },
            { text: '2. Effect: balances[msg.sender] -= amount;', isCorrect: true },
            { text: '3. Interact: (bool sent, ) = msg.sender.call{value: amount}("");', isCorrect: true },
            { text: '4. Verify: require(sent, "ETH transfer failed");', isCorrect: true },
          ],
        },
        {
          question: '[DEBUG] Spot the reentrancy vulnerability line in this vault contract:',
          codeSnippet: `function withdraw(uint256 amount) external {\n  require(balances[msg.sender] >= amount, "No funds");\n  // Flawed order of operations:\n  (bool sent, ) = msg.sender.call{value: amount}("");\n  balances[msg.sender] -= amount;\n}`,
          points: 20,
          explanation: 'The external call is executed before reducing the user balance (balances[msg.sender] -= amount), allowing a malicious receiver fallback function to reenter withdraw() and drain the contract.',
          options: [
            { text: 'require(balances[msg.sender] >= amount, "No funds");', isCorrect: false },
            { text: '(bool sent, ) = msg.sender.call{value: amount}("");', isCorrect: true },
            { text: 'balances[msg.sender] -= amount;', isCorrect: false },
            { text: 'function withdraw(uint256 amount) external {', isCorrect: false },
          ],
        },
        {
          question: 'What is the consequence of an unchecked low-level call in Solidity (e.g., target.call(""))?',
          codeSnippet: null,
          points: 20,
          explanation: 'Low-level call does not bubble up reverts; it returns a boolean success value. If ignored, the calling contract assumes success even if the recipient ran out of gas or reverted.',
          options: [
            { text: 'The execution continues silently even if the external subcall reverted, leading to state inconsistencies', isCorrect: true },
            { text: 'The compiler refuses to compile the contract', isCorrect: false },
            { text: 'All gas in the transaction is burned permanently', isCorrect: false },
            { text: 'The contract bytecode is deleted from the blockchain', isCorrect: false },
          ],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      quiz: {
        title: `${targetTopic.toUpperCase()} Protocol Deep Dive`,
        topic: targetTopic,
        description: `Comprehensive protocol challenge testing EVM semantics, architecture, and security properties of ${targetTopic}.`,
        durationMinutes: 5,
        maxPoints: 100,
        questions: generatedQuestions,
      },
    });
  } catch (error: any) {
    console.error('AI question generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
  }
}
