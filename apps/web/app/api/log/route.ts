import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for validation
const logSchema = z.object({
    apiKey: z.string().min(1, "API Key is required"),
    hash: z.string().min(1, "Hash is required"),
    metadata: z.record(z.any()), // Accepts any object structure for metadata
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // STRICT VALIDATION
        const result = logSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Validation Error", details: result.error.format() },
                { status: 400 }
            );
        }

        const { apiKey, hash, metadata } = result.data;

        // SECURITY: Do not console.log the apiKey.
        // console.log(`Received request with hash: ${hash}`); 

        // MOCK DATABASE RESPONSE (Transaction ID)
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // CORS Headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        return NextResponse.json({
            success: true,
            transactionId,
            status: "logged",
            timestamp: new Date().toISOString()
        }, { status: 200, headers });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Handle CORS Preflight
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
