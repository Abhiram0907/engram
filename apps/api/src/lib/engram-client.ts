import {
  AccountId,
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';

export interface NotarizeResult {
  status: 'success';
  topicId: string;
  sequenceNumber: string;
  url: string;
  topicUrl: string;
}

export interface EngramClient {
  notarize(content: string): Promise<NotarizeResult>;
}

type SupportedNetwork = 'testnet' | 'mainnet' | 'previewnet';

let globalTopicId: string | null = null;

class HederaEngramClient implements EngramClient {
  constructor(
    private readonly operatorId: string,
    private readonly operatorKey: string,
    private readonly network: SupportedNetwork,
  ) {}

  private getClient() {
    const accountId = AccountId.fromString(this.operatorId);
    const privateKey = PrivateKey.fromString(this.operatorKey);

    const client = this.createNetworkClient();
    client.setOperator(accountId, privateKey);
    return client;
  }

  private createNetworkClient() {
    switch (this.network) {
      case 'mainnet':
        return Client.forMainnet();
      case 'previewnet':
        return Client.forPreviewnet();
      case 'testnet':
      default:
        return Client.forTestnet();
    }
  }

  private getExplorerNetworkPath() {
    return this.network;
  }

  private async ensureTopic(client: Client) {
    if (globalTopicId) {
      return globalTopicId;
    }

    const createTopicTx = new TopicCreateTransaction();
    const createTopicResponse = await createTopicTx.execute(client);
    const topicReceipt = await createTopicResponse.getReceipt(client);

    globalTopicId = topicReceipt.topicId?.toString() ?? null;
    if (!globalTopicId) {
      throw new Error('Failed to create topic');
    }

    return globalTopicId;
  }

  async notarize(content: string): Promise<NotarizeResult> {
    const client = this.getClient();
    const topicId = await this.ensureTopic(client);

    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(content)
      .execute(client);

    const submitReceipt = await submitTx.getReceipt(client);
    const validStart = submitTx.transactionId.validStart;
    const accountId = submitTx.transactionId.accountId;

    const txIdString = `${accountId?.toString()}@${validStart?.seconds.toString()}.${validStart?.nanos.toString()}`;
    const networkPath = this.getExplorerNetworkPath();

    return {
      status: 'success',
      topicId,
      sequenceNumber: submitReceipt.topicSequenceNumber?.toString() ?? '0',
      url: `https://hashscan.io/${networkPath}/transaction/${txIdString}`,
      topicUrl: `https://hashscan.io/${networkPath}/topic/${topicId}`,
    };
  }
}

function normalizeNetwork(value: string | undefined): SupportedNetwork {
  if (!value) {
    return 'testnet';
  }

  const normalized = value.toLowerCase();
  if (normalized === 'mainnet' || normalized === 'previewnet' || normalized === 'testnet') {
    return normalized;
  }

  throw new Error('HEDERA_NETWORK must be one of: testnet, mainnet, previewnet');
}

export function createEngramClient(): EngramClient {
  const operatorId = process.env.HEDERA_ACCOUNT_ID;
  const operatorKey = process.env.HEDERA_PRIVATE_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error('HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set');
  }

  return new HederaEngramClient(operatorId, operatorKey, normalizeNetwork(process.env.HEDERA_NETWORK));
}
