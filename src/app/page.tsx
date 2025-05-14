
"use client";

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const DEFAULT_TONE_ITEM_VALUE = "__replycraft_default_tone__";

const ReplyCraftPage: FC = () => {
  const [message, setMessage] = useState<string>('');
  const [language, setLanguage] = useState<GenerateSmartReplyInput['language']>('en');
  const [selectedTone, setSelectedTone] = useState<GenerateSmartReplyInput['tone']>(undefined);
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
      const input: GenerateSmartReplyInput = { message, language, tone: selectedTone };
      const result: GenerateSmartReplyOutput = await generateSmartReply(input);
      setReplies(result.replies);
      if (result.replies.length === 0) {
        toast({
          title: "No Replies Generated",
          description: "The AI couldn't come up with replies for this one. Try rephrasing!",
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
              rows={4}
              className="resize-none text-base border-2 focus:border-primary focus:ring-primary"
              aria-label="Incoming message"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-auto">
                  <label htmlFor="language-tabs" className="block text-sm font-medium text-foreground mb-1.5">Reply Language:</label>
                  <Tabs defaultValue="en" onValueChange={(value) => setLanguage(value as 'en' | 'hi')} id="language-tabs">
                    <TabsList className="grid w-full grid-cols-2 sm:w-[180px]">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="hi">Hinglish</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="w-full sm:w-auto">
                  <label htmlFor="tone-select" className="block text-sm font-medium text-foreground mb-1.5">Reply Tone:</label>
                  <Select
                    value={selectedTone === undefined ? DEFAULT_TONE_ITEM_VALUE : selectedTone} 
                    onValueChange={(value: string) => {
                      if (value === DEFAULT_TONE_ITEM_VALUE) {
                        setSelectedTone(undefined);
                      } else {
                        setSelectedTone(value as NonNullable<GenerateSmartReplyInput['tone']>);
                      }
                    }}
                  >
                    <SelectTrigger id="tone-select" className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DEFAULT_TONE_ITEM_VALUE}>✨ Witty (Default)</SelectItem>
                      {toneOptions.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleGenerateReplies} 
                disabled={isLoading || !message.trim()} 
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Generate
              </Button>
            </div>
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

