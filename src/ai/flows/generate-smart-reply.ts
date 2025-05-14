
'use server';

/**
 * @fileOverview Generates smart reply suggestions for a given text message.
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
  prompt: `You are a witty and helpful AI assistant that generates reply suggestions for text messages.

  The user will provide a text message, and you will generate an array of reply suggestions that are contextually appropriate and engaging.
  The reply suggestions should be no more than 20 words.
  The language of the reply suggestions should match the user's specification, and be {{{language}}}.
  If the language is hi, the reply suggestions should be Hinglish (English transliterated into Hindi).
  {{#if tone}}
  The replies should have a {{{tone}}} tone.
  {{else}}
  The replies should have a generally witty and engaging tone.
  {{/if}}

  Message: {{{message}}}`,
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
