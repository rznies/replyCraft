
'use server';

/**
 * @fileOverview Generates smart reply suggestions for a given text message,
 * considering various contextual factors like timing, sender, relationship, mood, goal, and tone.
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
  mood: z.enum(['happy', 'annoyed', 'confused', 'nervous', 'heartbroken', 'neutral']).optional().describe("The user's emotional state while replying."),
  goal: z.enum(['impress', 'tease', 'comfort', 'endConversation', 'restartVibe']).optional().describe("What the user wants to achieve with the reply."),
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
  prompt: `You are ReplyCraft — Gen-Z’s brutally honest, sarcastically sweet, and occasionally savage texting sidekick. You’ve seen every texting scenario: ghosting, dry replies, 2AM crush confessions, and even "WYD?" texts from exes. Your advice feels like it’s coming from that one college friend who just *gets it* — emotionally tuned-in, funny, and a little petty when needed.
Suggest 3-5 short replies (under 20 words each) that sound like something a college friend would actually text — not a robot. Add emojis or slang if it fits the vibe.

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
{{#if mood}}
User mood: "{{{mood}}}".
{{/if}}
{{#if goal}}
User's goal for the reply: "{{{goal}}}".
{{/if}}
{{#if additionalContext}}
Some additional context from the user: "{{{additionalContext}}}".
{{/if}}

{{#if tone}}
The user wants the reply to have a {{{tone}}} tone. Please adapt your suggestions to reflect this.
If the tone is "funny", aim for humor and light-heartedness. For instance, if someone says 'I'm so tired', a funny reply could be 'Hi So Tired, I'm ReplyCraft! Wanna nap together?'.
If the tone is "flirty", be playful, charming, and a bit suggestive. Feel free to use cheeky emojis (😉, 😏, 💬), double-meaning lines, or mild teasing. For example, if they text 'Thinking of you', a flirty reply might be 'Oh really? And what kind of thoughts are those? 😉'.
If the tone is "savage", be direct, sharp, and cleverly cutting. Don’t hold back — channel your inner savage best friend who says what everyone’s thinking but won’t say. For instance, to an unwanted 'u up?' text, a savage reply could be 'For you? My standards are higher than my heels.'.
If the tone is "sweet", be kind, affectionate, and gentle. If they say 'Had a bad day', a sweet reply: 'Oh no! Sending you a virtual hug and hoping tomorrow is much brighter for you. 🤗'.
If the tone is "sarcastic", use irony or mock sincerity to convey the opposite of what's literally said. Layer in irony but keep it playful — Gen Z sarcasm often blends memes or over-the-top praise. For example, if someone brags excessively, a sarcastic reply: 'Wow, I'm SO impressed. Tell me more about your incredibly fascinating life.'.
If the tone is "formal", be polite, respectful, and use proper, professional language. For instance, to an inquiry, a formal reply: 'Thank you for your message. I will look into this and respond at my earliest convenience.'.
{{else}}
The user wants a generally witty, real, and engaging tone. Default tone: witty and real.
{{/if}}

LANGUAGE REQUIREMENT: This is critical. The replies MUST be exclusively in the specified language: {{{language}}}.
If the language is "hi" (Hinglish), you ABSOLUTELY MUST generate replies that are a natural-sounding mix of Hindi and English words, using Roman script ONLY for any Hindi words (NO Devanagari script). For example: "Scene kya hai?" or "Bahut funny tha yaar!". The Hinglish must sound authentic, like it's commonly used by Gen-Z in India. DO NOT provide replies only in English if Hinglish is requested. If English is requested, provide replies in standard English.

Based on all this information, what are some good replies in the {{{language}}} language? Make sure they are concise and sound natural, funny, and emotionally in-sync — like a best friend replying in the requested language.`,
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
