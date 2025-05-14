
'use server';

/**
 * @fileOverview Generates smart reply suggestions for a given text message,
 * considering various contextual factors like timing, sender, relationship, and tone.
 *
 * - generateSmartReply - A function that generates smart reply suggestions.
 * - GenerateSmartReplyInput - The input type for the generateSmartReply function.
 * - GenerateSmartReplyOutput - The return type for the generateSmartReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartReplyInputSchema = z.object({
  message: z.string().describe('The incoming text message to generate replies for.'),
  language: z.enum(['en', 'hi']).describe('The language of the reply suggestions (en for English, hi for Hinglish).').default('en'),
  tone: z.enum(["funny", "flirty", "savage", "sweet", "sarcastic", "formal"]).optional().describe('The desired tone for the reply suggestions. If not specified, a general witty tone will be used.'),
  timing: z.enum(['morning', 'afternoon', 'evening', 'lateNight']).optional().describe('The timing of when the message was received (e.g., morning, lateNight).'),
  senderType: z.enum(['friend', 'crush', 'ex', 'parent', 'stranger', 'boss']).optional().describe('Who sent the message (e.g., ex, friend, boss).'),
  relationshipVibe: z.enum(['justMet', 'complicated', 'oldFlame', 'ghostedMe', 'closeFriend', 'workMode']).optional().describe("The user's current relationship vibe with the sender (e.g., complicated, closeFriend)."),
  additionalContext: z.string().optional().describe('Any additional free-text context provided by the user about the situation.'),
});
export type GenerateSmartReplyInput = z.infer<typeof GenerateSmartReplyInputSchema>;

const GenerateSmartReplyOutputSchema = z.object({
  replies: z.array(z.string()).describe('An array of witty and contextually appropriate reply suggestions.'),
});
export type GenerateSmartReplyOutput = z.infer<typeof GenerateSmartReplyOutputSchema>;

export async function generateSmartReply(input: GenerateSmartReplyInput): Promise<GenerateSmartReplyOutput> {
  return generateSmartReplyFlow(input);
}

const generateSmartReplyPrompt = ai.definePrompt({
  name: 'generateSmartReplyPrompt',
  input: {schema: GenerateSmartReplyInputSchema},
  output: {schema: GenerateSmartReplyOutputSchema},
  prompt: `You are an expert in crafting witty, context-aware, and emotionally intelligent text message replies.
Generate a few distinct reply suggestions (each under 20 words) for the user.
The replies should be in {{{language}}}{{#if (eq language "hi")}} (Hinglish: English transliterated into Hindi){{/if}}.

Here's the situation:
The user received the message: "{{{message}}}"

{{#if senderType}}
This message is from their {{{senderType}}}.
{{/if}}
{{#if relationshipVibe}}
Their relationship vibe with this person is "{{{relationshipVibe}}}".
{{/if}}
{{#if timing}}
The message was received during the {{{timing}}}.
{{/if}}
{{#if additionalContext}}
Some additional context from the user: "{{{additionalContext}}}".
{{/if}}

{{#if tone}}
The user wants the reply to have a {{{tone}}} tone.
{{else}}
The user wants a generally witty and engaging tone.
{{/if}}

Based on all this information, what are some good replies? Make sure they are concise.`,
});

const generateSmartReplyFlow = ai.defineFlow(
  {
    name: 'generateSmartReplyFlow',
    inputSchema: GenerateSmartReplyInputSchema,
    outputSchema: GenerateSmartReplyOutputSchema,
  },
  async input => {
    const {output} = await generateSmartReplyPrompt(input);
    return output!;
  }
);

