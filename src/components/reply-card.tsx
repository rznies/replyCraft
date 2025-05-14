"use client";

import type { FC } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCopy, ThumbsUp, ThumbsDown } from "lucide-react";

interface ReplyCardProps {
  replyText: string;
  onCopy: (text: string) => void;
}

export const ReplyCard: FC<ReplyCardProps> = ({ replyText, onCopy }) => {
  // Upvote/downvote functionality is UI-only for now
  // To make them interactive locally (without persistence):
  // const [upvotes, setUpvotes] = useState(0);
  // const [downvotes, setDownvotes] = useState(0);
  // const handleUpvote = () => setUpvotes(prev => prev + 1);
  // const handleDownvote = () => setDownvotes(prev => prev + 1);

  return (
    <Card className="shadow-lg bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
      <CardContent className="p-4 md:p-6">
        <p className="text-card-foreground text-base md:text-lg">{replyText}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-1 p-3 pt-0">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onCopy(replyText)} 
                aria-label="Copy reply"
                className="text-muted-foreground hover:text-primary"
              >
                <ClipboardCopy className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Upvote reply" 
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                // onClick={handleUpvote}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upvote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Downvote reply" 
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                // onClick={handleDownvote}
              >
                <ThumbsDown className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Downvote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
