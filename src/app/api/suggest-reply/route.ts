
import { NextResponse, type NextRequest } from 'next/server';
import { generateSmartReply, type GenerateSmartReplyInput, type GenerateSmartReplyOutput } from '@/ai/flows/generate-smart-reply';
import { z } from 'zod';

// Re-define the input schema here for validation, or import if sharable without 'use server' issues
const GenerateSmartReplyInputAPISchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty." }),
  language: z.enum(['en', 'hi']).default('en'),
  tone: z.enum(["funny", "flirty", "savage", "sweet", "sarcastic", "formal"]).optional(),
  timing: z.enum(['morning', 'afternoon', 'evening', 'lateNight']).optional(),
  senderType: z.enum(['friend', 'crush', 'ex', 'parent', 'stranger', 'boss']).optional(),
  relationshipVibe: z.enum(['justMet', 'complicated', 'oldFlame', 'ghostedMe', 'closeFriend', 'workMode']).optional(),
  mood: z.enum(['happy', 'annoyed', 'confused', 'nervous', 'heartbroken', 'neutral']).optional(),
  goal: z.enum(['impress', 'tease', 'comfort', 'endConversation', 'restartVibe']).optional(),
  additionalContext: z.string().optional(),
});

// In-memory store for IP-based rate limiting
const ipRequestTimestamps = new Map<string, number[]>();
const REQUEST_LIMIT = 10; // 10 requests
const WINDOW_MS = 60 * 1000; // per 60 seconds (1 minute)

export async function POST(request: NextRequest) {
  try {
    // 1. API Key Authentication
    const apiKey = process.env.API_ROUTE_SECRET;
    const requestApiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      console.error("API_ROUTE_SECRET is not set. Denying access.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requestApiKey || requestApiKey !== apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. IP-based Rate Limiting
    let ip = request.ip;
    if (!ip) {
      const forwardedFor = request.headers.get('x-forwarded-for');
      if (forwardedFor) {
        ip = forwardedFor.split(',')[0].trim();
      }
    }

    if (!ip) {
      console.warn("Rate limiting: Could not determine IP address. Denying access.");
      return NextResponse.json({ error: "Could not determine client IP address." }, { status: 400 });
    }

    const now = Date.now();
    const timestamps = ipRequestTimestamps.get(ip) || [];
    
    // Filter timestamps that are within the current window
    const recentTimestamps = timestamps.filter(ts => now - ts < WINDOW_MS);

    if (recentTimestamps.length >= REQUEST_LIMIT) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Add current request timestamp and update the store
    recentTimestamps.push(now);
    ipRequestTimestamps.set(ip, recentTimestamps);

    // Proceed with request processing
    const body = await request.json();
    
    const validationResult = GenerateSmartReplyInputAPISchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input", details: validationResult.error.flatten() }, { status: 400 });
    }

    const input: GenerateSmartReplyInput = validationResult.data;
    const output: GenerateSmartReplyOutput = await generateSmartReply(input);

    return NextResponse.json(output);

  } catch (error) {
    console.error("Error in /api/suggest-reply:", error);
    // Send a generic error message to the client to avoid exposing internal details
    return NextResponse.json({ error: "An internal server error occurred. Please try again later." }, { status: 500 });
  }
}
