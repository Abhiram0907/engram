
import { Client, TopicCreateTransaction, TopicMessageSubmitTransaction, PrivateKey } from "@hashgraph/sdk";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;

    if (!accountId || !privateKey) {
      return NextResponse.json({ error: "Hedera credentials missing" }, { status: 500 });
    }

    const client = Client.forTestnet();

    let key;
    try {
      if (privateKey.startsWith("0x")) {
        key = PrivateKey.fromStringECDSA(privateKey);
      } else {
        key = PrivateKey.fromString(privateKey);
      }
    } catch (e) {
      console.error("Key parsing error:", e);
      return NextResponse.json({ error: "Invalid private key format" }, { status: 500 });
    }

    client.setOperator(accountId, key);

    let topicId = process.env.HEDERA_TOPIC_ID;

    if (!topicId) {
      console.log("No HEDERA_TOPIC_ID found. Creating a new topic...");
      const transaction = new TopicCreateTransaction();
      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);
      topicId = receipt.topicId?.toString();

      if (!topicId) {
        throw new Error("Failed to create topic");
      }

      console.log("CRITICAL: New Topic ID created:", topicId);
      console.log("Please save this Topic ID to your .env.local as HEDERA_TOPIC_ID to reuse it.");
    }

    const submitTx = new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: data,
    });

    const submitTxResponse = await submitTx.execute(client);
    const receipt = await submitTxResponse.getReceipt(client);
    // There is no transactionId on the receipt directly in some SDK versions, but we can use the response transactionId
    const transactionId = submitTxResponse.transactionId.toString();

    // Format txId for explorer (replace @ with - and one . with - after the account num? Hashscan usually takes raw tx id with dashes or dots)
    // Hashscan format: 0.0.12345@1234567890.123456789 -> 0.0.12345-1234567890-123456789
    // Actually submitTxResponse.transactionId.toString() returns "0.0.12345@169..." format.
    // Let's rely on the raw string for now or do a simple replace if needed. 
    // Hashscan handles the @ format in search often, but for URL it might need dashes.
    // Example: https://hashscan.io/testnet/transaction/0.0.4576379@1706646872.639798485
    // Let's verify format. Run 1 might fail URL navigation if format wrong.

    return NextResponse.json({
      status: "success",
      txId: transactionId,
      explorerUrl: `https://hashscan.io/testnet/transaction/${transactionId}`
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
