"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage as Message } from "ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send } from "lucide-react";
import { useParams } from "next/navigation";

export function ChatPanel() {
  const params = useParams();
  const lessonId = params.lessonId as string | undefined;
  
  const [input, setInput] = useState("");

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { lessonId: lessonId || "general" },
    })
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const val = input;
    setInput("");
    await sendMessage({ text: val });
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <aside className="w-full md:w-80 h-1/2 md:h-full border-l border-border/40 bg-card flex flex-col shrink-0 flex-1 md:flex-none relative shadow-xl md:shadow-none z-20">
      <div className="p-3 pt-4 border-b border-border/40 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <Bot className="h-5 w-5" />
          <h2 className="font-semibold text-sm">AI Tutor</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/10 mt-10">
            <Bot className="h-8 w-8 mb-2 opacity-50" />
            <p>I am your contextual AI tutor. Ask me to explain concepts, give examples, or quiz you on this lesson.</p>
          </div>
        )}
        
        {messages.map((m: Message) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role !== 'user' && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className={`text-sm py-2 px-3 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.parts.map((part, i: number) => (
                  part.type === 'text' ? <span key={i}>{part.text}</span> : null
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start opacity-60">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
               <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <div className="text-sm py-3 px-3 rounded-lg bg-muted flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-1 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1 h-1 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <Textarea 
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about this lesson..."
            className="min-h-[40px] max-h-[120px] resize-none pr-10 py-3 text-sm flex-1"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="absolute right-1 bottom-1 h-8 w-8 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </aside>
  );
}

