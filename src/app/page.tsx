
"use client";

import { useState, type FC, useMemo } from 'react';
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

const uiTranslations = {
  en: {
    craftYourReplyTitle: "Craft Your Reply",
    messagePlaceholder: "What did they text you? Spill the tea...",
    replyLanguageLabel: "Reply Language:",
    englishLabel: "English",
    hinglishLabel: "Hinglish",
    replyToneLabel: "Reply Tone:",
    toneDefaultPlaceholder: "✨ Witty (Default)",
    toneFunnyLabel: "😂 Funny",
    toneFlirtyLabel: "😘 Flirty",
    toneSavageLabel: "😈 Savage",
    toneSweetLabel: "😇 Sweet",
    toneSarcasticLabel: "😒 Sarcastic",
    toneFormalLabel: "👔 Formal",
    senderTypeLabel: "👤 Who is this from?",
    senderDefaultPlaceholder: "Select sender (Optional)",
    senderFriendLabel: "🫂 Friend",
    senderCrushLabel: "😍 Crush",
    senderExLabel: "💔 Ex",
    senderParentLabel: "👨‍👩‍👧‍👦 Parent",
    senderStrangerLabel: "❓ Stranger",
    senderBossLabel: "👔 Boss",
    timingLabel: "🕒 Timing of the message:",
    timingDefaultPlaceholder: "Select timing (Optional)",
    timingMorningLabel: "🌞 Morning",
    timingAfternoonLabel: "☀️ Afternoon",
    timingEveningLabel: "🌆 Evening",
    timingLateNightLabel: "🌙 Late Night",
    relationshipVibeLabel: "❤️ What’s the vibe?",
    vibeDefaultPlaceholder: "Select vibe (Optional)",
    vibeJustMetLabel: "🤝 Just Met",
    vibeComplicatedLabel: "🤔 It's Complicated",
    vibeOldFlameLabel: "🔥 Old Flame",
    vibeGhostedMeLabel: "👻 Ghosted Me",
    vibeCloseFriendLabel: "🤗 Close Friend",
    vibeWorkModeLabel: "💼 Work Mode",
    moodLabel: "ემო Mood:",
    moodDefaultPlaceholder: "Select mood (Optional)",
    moodHappyLabel: "😊 Happy",
    moodAnnoyedLabel: "😠 Annoyed",
    moodConfusedLabel: "😕 Confused",
    moodNervousLabel: "😬 Nervous",
    moodHeartbrokenLabel: "💔 Heartbroken",
    moodNeutralLabel: "😐 Neutral",
    goalLabel: "🎯 Goal for Reply:",
    goalDefaultPlaceholder: "Select goal (Optional)",
    goalImpressLabel: "😎 Impress",
    goalTeaseLabel: "😜 Tease",
    goalComfortLabel: "🤗 Comfort",
    goalEndConversationLabel: "👋 End Conversation",
    goalRestartVibeLabel: "🔄 Restart Vibe",
    additionalContextLabel: "📝 Context (optional):",
    additionalContextPlaceholder: "e.g., We argued last night, now he texted hey",
    generateRepliesButton: "Generate Replies",
  },
  hi: {
    craftYourReplyTitle: "Apna Reply Banao",
    messagePlaceholder: "Unhone kya likha? Batao poori baat...",
    replyLanguageLabel: "Reply ki Bhasha:",
    englishLabel: "English",
    hinglishLabel: "Hinglish",
    replyToneLabel: "Mood Chunein:",
    toneDefaultPlaceholder: "✨ Witty (Default)", // Kept English as per common practice for such defaults unless specified
    toneFunnyLabel: "😂 Mazakiya",
    toneFlirtyLabel: "😘 Thoda Flirt Wala",
    toneSavageLabel: "😈 Teda-Meda",
    toneSweetLabel: "😇 Pyara",
    toneSarcasticLabel: "😒 Taane-maarne Wala",
    toneFormalLabel: "👔 Sambhal ke (Formal)",
    senderTypeLabel: "Message Kisne Bheja?:",
    senderDefaultPlaceholder: "Kisne Bheja Ye Chuno (Optional)",
    senderFriendLabel: "🫂 Dost",
    senderCrushLabel: "😍 Crush 😍",
    senderExLabel: "💔 Ex 😬",
    senderParentLabel: "👨‍👩‍👧‍👦 Mummy Papa",
    senderStrangerLabel: "❓ Anjaan",
    senderBossLabel: "👔 Boss",
    timingLabel: "Time Kab Ka Hai?:",
    timingDefaultPlaceholder: "Time Chuno (Optional)",
    timingMorningLabel: "🌞 Subah",
    timingAfternoonLabel: "☀️ Dupahar",
    timingEveningLabel: "🌆 Shaam",
    timingLateNightLabel: "🌙 Raat Ke Late",
    relationshipVibeLabel: "Rishton ka Scene:",
    vibeDefaultPlaceholder: "Scene Chuno (Optional)",
    vibeJustMetLabel: "🤝 Abhi Abhi Mile Hain",
    vibeComplicatedLabel: "🤔 Thoda Confuse Wala",
    vibeOldFlameLabel: "🔥 Purana Pyaar",
    vibeGhostedMeLabel: "👻 Ignore Kiya Gaya",
    vibeCloseFriendLabel: "🤗 Khaas Dost",
    vibeWorkModeLabel: "💼 Kaam Ka Mood",
    moodLabel: "ემო Mood:", // Kept English label as Hinglish version was not in the table
    moodDefaultPlaceholder: "Mood Chuno (Optional)",
    moodHappyLabel: "😊 Happy", // Assuming Hinglish uses same for these, or just the text part
    moodAnnoyedLabel: "😠 Annoyed",
    moodConfusedLabel: "😕 Confused",
    moodNervousLabel: "😬 Nervous",
    moodHeartbrokenLabel: "💔 Heartbroken",
    moodNeutralLabel: "😐 Neutral",
    goalLabel: "🎯 Goal for Reply:", // Kept English label as Hinglish version was not in the table
    goalDefaultPlaceholder: "Goal Chuno (Optional)",
    goalImpressLabel: "😎 Impress",
    goalTeaseLabel: "😜 Tease",
    goalComfortLabel: "🤗 Comfort",
    goalEndConversationLabel: "👋 End Conversation",
    goalRestartVibeLabel: "🔄 Restart Vibe",
    additionalContextLabel: "Aur Kya Scene Hai?:",
    additionalContextPlaceholder: "jaise, Hum kal raat lade, ab usne hey bheja hai",
    generateRepliesButton: "Banayein",
  }
};

const DEFAULT_TONE_VALUE = "__replycraft_default_tone__";
const DEFAULT_TIMING_VALUE = "__replycraft_default_timing__";
const DEFAULT_SENDER_TYPE_VALUE = "__replycraft_default_sender_type__";
const DEFAULT_RELATIONSHIP_VIBE_VALUE = "__replycraft_default_relationship_vibe__";
const DEFAULT_MOOD_VALUE = "__replycraft_default_mood__";
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

  const T = useMemo(() => uiTranslations[language], [language]);

  const toneOptions = useMemo(() => [
    { value: "funny", label: T.toneFunnyLabel },
    { value: "flirty", label: T.toneFlirtyLabel },
    { value: "savage", label: T.toneSavageLabel },
    { value: "sweet", label: T.toneSweetLabel },
    { value: "sarcastic", label: T.toneSarcasticLabel },
    { value: "formal", label: T.toneFormalLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['tone']>; label: string }[], [T]);

  const timingOptions = useMemo(() => [
    { value: 'morning', label: T.timingMorningLabel },
    { value: 'afternoon', label: T.timingAfternoonLabel },
    { value: 'evening', label: T.timingEveningLabel },
    { value: 'lateNight', label: T.timingLateNightLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['timing']>; label: string }[], [T]);

  const senderTypeOptions = useMemo(() => [
    { value: 'friend', label: T.senderFriendLabel },
    { value: 'crush', label: T.senderCrushLabel },
    { value: 'ex', label: T.senderExLabel },
    { value: 'parent', label: T.senderParentLabel },
    { value: 'stranger', label: T.senderStrangerLabel },
    { value: 'boss', label: T.senderBossLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['senderType']>; label: string }[], [T]);

  const relationshipVibeOptions = useMemo(() => [
    { value: 'justMet', label: T.vibeJustMetLabel },
    { value: 'complicated', label: T.vibeComplicatedLabel },
    { value: 'oldFlame', label: T.vibeOldFlameLabel },
    { value: 'ghostedMe', label: T.vibeGhostedMeLabel },
    { value: 'closeFriend', label: T.vibeCloseFriendLabel },
    { value: 'workMode', label: T.vibeWorkModeLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['relationshipVibe']>; label: string }[], [T]);

  const moodOptions = useMemo(() => [
      { value: 'happy', label: T.moodHappyLabel },
      { value: 'annoyed', label: T.moodAnnoyedLabel },
      { value: 'confused', label: T.moodConfusedLabel },
      { value: 'nervous', label: T.moodNervousLabel },
      { value: 'heartbroken', label: T.moodHeartbrokenLabel },
      { value: 'neutral', label: T.moodNeutralLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['mood']>; label: string }[], [T]);

  const goalOptions = useMemo(() => [
      { value: 'impress', label: T.goalImpressLabel },
      { value: 'tease', label: T.goalTeaseLabel },
      { value: 'comfort', label: T.goalComfortLabel },
      { value: 'endConversation', label: T.goalEndConversationLabel },
      { value: 'restartVibe', label: T.goalRestartVibeLabel },
  ] as { value: NonNullable<GenerateSmartReplyInput['goal']>; label: string }[], [T]);

  const handleGenerateReplies = async () => {
    if (!message.trim()) {
      setError("Please enter a message to get replies for."); // TODO: Localize
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
        toast({ // TODO: Localize
          title: "No Replies Generated",
          description: "The AI couldn't come up with replies for this one. Try rephrasing or adding more context!",
        });
      }
    } catch (e) {
      console.error("Error generating replies:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate replies: ${errorMessage}`); // TODO: Localize
      toast({ // TODO: Localize
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
        toast({ // TODO: Localize
          title: "Copied!",
          description: "Reply copied to clipboard.",
        });
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({ // TODO: Localize
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
              <span>{T.craftYourReplyTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <Textarea
              placeholder={T.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none text-base border-2 focus:border-primary focus:ring-primary"
              aria-label="Incoming message"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language-tabs" className="block text-sm font-medium text-foreground mb-1.5">{T.replyLanguageLabel}</Label>
                <Tabs defaultValue="en" onValueChange={(value) => setLanguage(value as 'en' | 'hi')} id="language-tabs">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">{T.englishLabel}</TabsTrigger>
                    <TabsTrigger value="hi">{T.hinglishLabel}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <Label htmlFor="tone-select" className="block text-sm font-medium text-foreground mb-1.5">{T.replyToneLabel}</Label>
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
                    <SelectItem value={DEFAULT_TONE_VALUE}>{T.toneDefaultPlaceholder}</SelectItem>
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
                  <Label htmlFor="sender-type-select" className="block text-sm font-medium text-foreground mb-1.5">{T.senderTypeLabel}</Label>
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
                      <SelectItem value={DEFAULT_SENDER_TYPE_VALUE}>{T.senderDefaultPlaceholder}</SelectItem>
                      {senderTypeOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="relationship-vibe-select" className="block text-sm font-medium text-foreground mb-1.5">{T.relationshipVibeLabel}</Label>
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
                      <SelectItem value={DEFAULT_RELATIONSHIP_VIBE_VALUE}>{T.vibeDefaultPlaceholder}</SelectItem>
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
                  <Label htmlFor="timing-select" className="block text-sm font-medium text-foreground mb-1.5">{T.timingLabel}</Label>
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
                      <SelectItem value={DEFAULT_TIMING_VALUE}>{T.timingDefaultPlaceholder}</SelectItem>
                      {timingOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="mood-select" className="block text-sm font-medium text-foreground mb-1.5">{T.moodLabel}</Label>
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
                      <SelectItem value={DEFAULT_MOOD_VALUE}>{T.moodDefaultPlaceholder}</SelectItem>
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
                <Label htmlFor="goal-select" className="block text-sm font-medium text-foreground mb-1.5">{T.goalLabel}</Label>
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
                    <SelectItem value={DEFAULT_GOAL_VALUE}>{T.goalDefaultPlaceholder}</SelectItem>
                    {goalOptions.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="additional-context" className="block text-sm font-medium text-foreground mb-1.5">{T.additionalContextLabel}</Label>
                <Textarea
                  id="additional-context"
                  placeholder={T.additionalContextPlaceholder}
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
              {T.generateRepliesButton}
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

    