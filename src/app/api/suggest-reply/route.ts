
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

export async function POST(request: NextRequest) {
  try {
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
    let errorMessage = "An unknown error occurred while generating replies.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
