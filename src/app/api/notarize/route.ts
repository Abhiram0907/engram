import { NextRequest, NextResponse } from 'next/server';
import { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, AccountId, PrivateKey } from '@hashgraph/sdk';

// Initialize Hedera Client
const OPERATOR_ID = process.env.HEDERA_ACCOUNT_ID;
const OPERATOR_KEY = process.env.HEDERA_PRIVATE_KEY;

// Store topic ID in memory for this session (in production this would be in DB or ENV)
let globalTopicId: string | null = null;

function getClient() {
    if (!OPERATOR_ID || !OPERATOR_KEY) {
        throw new Error('HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set');
    }

    // Explicitly parse keys to validation format issues immediately
    // rather than waiting for "INVALID_SIGNATURE" errors from the network
    const operatorId = AccountId.fromString(OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(OPERATOR_KEY);

    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);
    return client;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ message: 'Content is required' }, { status: 400 });
        }

        const client = getClient();

        // 1. Create Topic if it doesn't exist
        if (!globalTopicId) {
            console.log('Creating new Hedera Topic...');
            const transaction = new TopicCreateTransaction();
            const txResponse = await transaction.execute(client);
            const receipt = await txResponse.getReceipt(client);
            globalTopicId = receipt.topicId?.toString() || null;
            console.log(`Topic Created: ${globalTopicId}`);
        }

        if (!globalTopicId) {
            return NextResponse.json({ message: 'Failed to create topic' }, { status: 500 });
        }

        // 2. Submit Message
        const submitTx = await new TopicMessageSubmitTransaction()
            .setTopicId(globalTopicId)
            .setMessage(content)
            .execute(client);

        const submitReceipt = await submitTx.getReceipt(client);

        // 3. Construct Explorer URL
        const validStart = submitTx.transactionId.validStart;
        const accountId = submitTx.transactionId.accountId;

        // Format: 0.0.12345@1234567890.000000000
        const txIdString = `${accountId?.toString()}@${validStart?.seconds.toString()}.${validStart?.nanos.toString()}`;
        const explorerUrl = `https://hashscan.io/testnet/transaction/${txIdString}`;
        const topicUrl = `https://hashscan.io/testnet/topic/${globalTopicId}`;

        return NextResponse.json({
            status: 'success',
            topicId: globalTopicId,
            sequenceNumber: submitReceipt.topicSequenceNumber?.toString() || '0',
            url: explorerUrl,
            topicUrl: topicUrl
        });

    } catch (error: any) {
        console.error('Hedera Error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
