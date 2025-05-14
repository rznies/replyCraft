
"use client";

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSmartReply } from '@/ai/flows/generate-smart-reply';
import type { GenerateSmartReplyInput, GenerateSmartReplyOutput } from '@/ai/flows/generate-smart-reply';
import { useToast } from "@/hooks/use-toast";
import { ReplyCard } from '@/components/reply-card';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';

const toneOptions: { value: NonNullable<GenerateSmartReplyInput['tone']>; label: string }[] = [
  { value: "funny", label: "😂 Funny" },
  { value: "flirty", label: "😘 Flirty" },
  { value: "savage", label: "😈 Savage" },
  { value: "sweet", label: "😇 Sweet" },
  { value: "sarcastic", label: "😒 Sarcastic" },
  { value: "formal", label: "👔 Formal" },
];
const DEFAULT_TONE_VALUE = "__replycraft_default_tone__";

const timingOptions: { value: NonNullable<GenerateSmartReplyInput['timing']>; label: string }[] = [
  { value: 'morning', label: '🌞 Morning' },
  { value: 'afternoon', label: '☀️ Afternoon' },
  { value: 'evening', label: '🌆 Evening' },
  { value: 'lateNight', label: '🌙 Late Night' },
];
const DEFAULT_TIMING_VALUE = "__replycraft_default_timing__";

const senderTypeOptions: { value: NonNullable<GenerateSmartReplyInput['senderType']>; label: string }[] = [
  { value: 'friend', label: '🫂 Friend' },
  { value: 'crush', label: '😍 Crush' },
  { value: 'ex', label: '💔 Ex' },
  { value: 'parent', label: '👨‍👩‍👧‍👦 Parent' },
  { value: 'stranger', label: '❓ Stranger' },
  { value: 'boss', label: '👔 Boss' },
];
const DEFAULT_SENDER_TYPE_VALUE = "__replycraft_default_sender_type__";

const relationshipVibeOptions: { value: NonNullable<GenerateSmartReplyInput['relationshipVibe']>; label: string }[] = [
  { value: 'justMet', label: '🤝 Just Met' },
  { value: 'complicated', label: "🤔 It's Complicated" },
  { value: 'oldFlame', label: '🔥 Old Flame' },
  { value: 'ghostedMe', label: '👻 Ghosted Me' },
  { value: 'closeFriend', label: '🤗 Close Friend' },
  { value: 'workMode', label: '💼 Work Mode' },
];
const DEFAULT_RELATIONSHIP_VIBE_VALUE = "__replycraft_default_relationship_vibe__";

const moodOptions: { value: NonNullable<GenerateSmartReplyInput['mood']>; label: string }[] = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'annoyed', label: '😠 Annoyed' },
    { value: 'confused', label: '😕 Confused' },
    { value: 'nervous', label: '😬 Nervous' },
    { value: 'heartbroken', label: '💔 Heartbroken' },
    { value: 'neutral', label: '😐 Neutral' },
];
const DEFAULT_MOOD_VALUE = "__replycraft_default_mood__";

const goalOptions: { value: NonNullable<GenerateSmartReplyInput['goal']>; label: string }[] = [
    { value: 'impress', label: '😎 Impress' },
    { value: 'tease', label: '😜 Tease' },
    { value: 'comfort', label: '🤗 Comfort' },
    { value: 'endConversation', label: '👋 End Conversation' },
    { value: 'restartVibe', label: '🔄 Restart Vibe' },
];
const DEFAULT_GOAL_VALUE = "__replycraft_default_goal__";


const ReplyCraftPage: FC = () => {
  const [message, setMessage] = useState<string>('');
  const [language, setLanguage] = useState<GenerateSmartReplyInput['language']>('en');
  const [selectedTone, setSelectedTone] = useState<GenerateSmartReplyInput['tone']>(undefined);
  const [timing, setTiming] = useState<GenerateSmartReplyInput['timing']>(undefined);
  const [senderType, setSenderType] = useState<GenerateSmartReplyInput['senderType']>(undefined);
  const [relationshipVibe, setRelationshipVibe] = useState<GenerateSmartReplyInput['relationshipVibe']>(undefined);
  const [selectedMood, setSelectedMood] = useState<GenerateSmartReplyInput['mood']>(undefined);
  const [selectedGoal, setSelectedGoal] = useState<GenerateSmartReplyInput['goal']>(undefined);
  const [additionalContext, setAdditionalContext] = useState<string>('');

  const [replies, setReplies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReplies = async () => {
    if (!message.trim()) {
      setError("Please enter a message to get replies for.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReplies([]);

    try {
      const input: GenerateSmartReplyInput = { 
        message, 
        language, 
        tone: selectedTone,
        timing,
        senderType,
        relationshipVibe,
        mood: selectedMood,
        goal: selectedGoal,
        additionalContext: additionalContext.trim() || undefined,
      };
      const result: GenerateSmartReplyOutput = await generateSmartReply(input);
      setReplies(result.replies);
      if (result.replies.length === 0) {
        toast({
          title: "No Replies Generated",
          description: "The AI couldn't come up with replies for this one. Try rephrasing or adding more context!",
        });
      }
    } catch (e) {
      console.error("Error generating replies:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate replies: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not generate replies. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Reply copied to clipboard.",
        });
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Copy Failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4 selection:bg-accent selection:text-accent-foreground">
      <main className="w-full max-w-2xl space-y-8 py-12">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            ReplyCraft
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg lg:text-xl">
            Your Gen-Z Texting Sidekick ✨
          </p>
        </header>

        <Card className="shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
              <MessageSquare size={28} />
              <span>Craft Your Reply</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <Textarea
              placeholder="What did they text you? Spill the tea..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none text-base border-2 focus:border-primary focus:ring-primary"
              aria-label="Incoming message"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language-tabs" className="block text-sm font-medium text-foreground mb-1.5">Reply Language:</Label>
                <Tabs defaultValue="en" onValueChange={(value) => setLanguage(value as 'en' | 'hi')} id="language-tabs">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">Hinglish</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <Label htmlFor="tone-select" className="block text-sm font-medium text-foreground mb-1.5">Reply Tone:</Label>
                <Select
                  value={selectedTone === undefined ? DEFAULT_TONE_VALUE : selectedTone} 
                  onValueChange={(value: string) => {
                    if (value === DEFAULT_TONE_VALUE) {
                      setSelectedTone(undefined);
                    } else {
                      setSelectedTone(value as NonNullable<GenerateSmartReplyInput['tone']>);
                    }
                  }}
                >
                  <SelectTrigger id="tone-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DEFAULT_TONE_VALUE}>✨ Witty (Default)</SelectItem>
                    {toneOptions.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender-type-select" className="block text-sm font-medium text-foreground mb-1.5">👤 Who is this from?</Label>
                  <Select
                    value={senderType === undefined ? DEFAULT_SENDER_TYPE_VALUE : senderType}
                    onValueChange={(value: string) => {
                      if (value === DEFAULT_SENDER_TYPE_VALUE) {
                        setSenderType(undefined);
                      } else {
                        setSenderType(value as NonNullable<GenerateSmartReplyInput['senderType']>);
                      }
                    }}
                  >
                    <SelectTrigger id="sender-type-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_SENDER_TYPE_VALUE}>Select sender (Optional)</SelectItem>
                      {senderTypeOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="relationship-vibe-select" className="block text-sm font-medium text-foreground mb-1.5">❤️ What’s the vibe?</Label>
                  <Select
                    value={relationshipVibe === undefined ? DEFAULT_RELATIONSHIP_VIBE_VALUE : relationshipVibe}
                    onValueChange={(value: string) => {
                      if (value === DEFAULT_RELATIONSHIP_VIBE_VALUE) {
                        setRelationshipVibe(undefined);
                      } else {
                        setRelationshipVibe(value as NonNullable<GenerateSmartReplyInput['relationshipVibe']>);
                      }
                    }}
                  >
                    <SelectTrigger id="relationship-vibe-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_RELATIONSHIP_VIBE_VALUE}>Select vibe (Optional)</SelectItem>
                      {relationshipVibeOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timing-select" className="block text-sm font-medium text-foreground mb-1.5">🕒 Timing of the message:</Label>
                  <Select
                    value={timing === undefined ? DEFAULT_TIMING_VALUE : timing}
                    onValueChange={(value: string) => {
                      if (value === DEFAULT_TIMING_VALUE) {
                        setTiming(undefined);
                      } else {
                        setTiming(value as NonNullable<GenerateSmartReplyInput['timing']>);
                      }
                    }}
                  >
                    <SelectTrigger id="timing-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_TIMING_VALUE}>Select timing (Optional)</SelectItem>
                      {timingOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="mood-select" className="block text-sm font-medium text-foreground mb-1.5">ემო Mood:</Label>
                  <Select
                    value={selectedMood === undefined ? DEFAULT_MOOD_VALUE : selectedMood}
                    onValueChange={(value: string) => {
                      if (value === DEFAULT_MOOD_VALUE) {
                        setSelectedMood(undefined);
                      } else {
                        setSelectedMood(value as NonNullable<GenerateSmartReplyInput['mood']>);
                      }
                    }}
                  >
                    <SelectTrigger id="mood-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_MOOD_VALUE}>Select mood (Optional)</SelectItem>
                      {moodOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
             
              <div>
                <Label htmlFor="goal-select" className="block text-sm font-medium text-foreground mb-1.5">🎯 Goal for Reply:</Label>
                <Select
                  value={selectedGoal === undefined ? DEFAULT_GOAL_VALUE : selectedGoal}
                  onValueChange={(value: string) => {
                    if (value === DEFAULT_GOAL_VALUE) {
                      setSelectedGoal(undefined);
                    } else {
                      setSelectedGoal(value as NonNullable<GenerateSmartReplyInput['goal']>);
                    }
                  }}
                >
                  <SelectTrigger id="goal-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DEFAULT_GOAL_VALUE}>Select goal (Optional)</SelectItem>
                    {goalOptions.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="additional-context" className="block text-sm font-medium text-foreground mb-1.5">📝 Context (optional):</Label>
                <Textarea
                  id="additional-context"
                  placeholder="e.g., We argued last night, now he texted hey"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={2}
                  className="resize-none text-base"
                  aria-label="Additional context"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateReplies} 
              disabled={isLoading || !message.trim()} 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate Replies
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-destructive text-center font-medium p-3 bg-destructive/10 rounded-md">{error}</p>}

        {replies.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-primary">
              Choose Your Vibe
            </h2>
            <div className="grid gap-4 md:gap-6">
              {replies.map((reply, index) => (
                <ReplyCard key={index} replyText={reply} onCopy={handleCopyToClipboard} />
              ))}
            </div>
          </section>
        )}

        {isLoading && replies.length === 0 && (
           <div className="text-center space-y-4 py-8">
             <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
             <p className="text-muted-foreground text-lg">Cooking up some fire replies...</p>
           </div>
        )}

      </main>
      <footer className="text-center py-8 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ReplyCraft. Keepin' it real, one text at a time.</p>
      </footer>
    </div>
  );
};

export default ReplyCraftPage;
