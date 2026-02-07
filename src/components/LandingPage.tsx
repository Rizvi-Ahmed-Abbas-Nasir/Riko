import {
  Send,
  Plus,
  PenLine,
  Hash,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Sparkles,
  Zap,
  Brain,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function RikoHome() {
  const [userPrompt, setUserPrompt] = useState("");
  const [hasChatStarted, setHasChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const actions = [
    {
      label: "Write Caption",
      icon: PenLine,
      prompt: "Write a social media caption for my post.",
    },
    {
      label: "Find Hashtags",
      icon: Hash,
      prompt: "Suggest relevant hashtags for my post.",
    },
    {
      label: "What's Trending",
      icon: TrendingUp,
      prompt: "What content topics are trending right now on social media?",
    },
    {
      label: "Analyze Competitor",
      icon: BarChart3,
      prompt: "Analyze my competitor's social media content and strategy.",
    },
    {
      label: "Create Content Ideas",
      icon: Lightbulb,
      prompt: "Generate content ideas for my social media.",
    },
    {
      label: "Improve My Content",
      icon: Sparkles,
      prompt: "Improve my social media content and make it more engaging.",
    },
  ];

  const features = [
    { text: "Speed up your content creation", icon: Zap },
    { text: "Get creative ideas & insights", icon: Brain },
    { text: "Optimize your posts like a pro", icon: Rocket },
  ];

  const handleQuickAction = (prompt: string) => {
    setUserPrompt("");
    
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setHasChatStarted(true);
    
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    
    sendActionMessage(prompt);
  };

  const sendActionMessage = async (prompt: string) => {
    try {
      const response = await fetch("https://r-ik-oapi.vercel.app/api/RikoChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const aiResponse = data?.response || "No response from Riko AI";
      
      setIsLoading(false);

      simulateTyping(
        formatAIResponse(aiResponse),
        (partialText) => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: partialText },
          ]);
        },
        () => {
          console.log("Typing complete");
        }
      );
    } catch (error) {
      console.error("Riko error:", error);
      
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Unable to reach Riko AI.",
        },
      ]);
      
      setIsLoading(false);
    }
  };

  const formatAIResponse = (text: string) => {
    if (!text) return "";
    
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^\s*[\*\-•]\s+/gm, "")
      .replace(/^#+\s?/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const simulateTyping = (
    fullText: string,
    onUpdate: (text: string) => void,
    onComplete: () => void
  ) => {
    let index = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      onUpdate(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        onComplete();
      }
    }, 20);
  };

  const sendMessage = async () => {
    if (!userPrompt.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: userPrompt.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserPrompt("");
    setHasChatStarted(true);
    setIsLoading(true);
    
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("http://82.112.235.182:3001/api/RikoChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      const aiResponse = data?.response || "No response from Riko AI";
      
      setIsLoading(false);

      simulateTyping(
        formatAIResponse(aiResponse),
        (partialText) => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: partialText },
          ]);
        },
        () => {
          console.log("Typing complete");
        }
      );
    } catch (error) {
      console.error("Riko error:", error);
      
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Unable to reach Riko AI.",
        },
      ]);
      
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMessage) return;

    setUserPrompt(lastUserMessage.content);
    sendMessage();
  };

  const ComingSoonButton = ({ label }: { label: string }) => (
    <div className="relative group">
      <button
        disabled
        className="px-3 py-1 rounded bg-[#E7E5E5] text-[#9a9a9a] cursor-not-allowed"
      >
        {label}
      </button>
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-black text-white text-[10px] px-2 py-1 rounded">
        Coming soon
      </span>
    </div>
  );

  const handleCopy = () => {
    const lastAIMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");

    if (!lastAIMessage?.content) return;

    navigator.clipboard.writeText(lastAIMessage.content);
  };

  return (
    <div className="min-h-screen bg-[#F1F2ED]">
      <div className="w-full">
        <div className="relative w-full rounded-xl bg-gradient-to-b from-[#FFF8EE]/80 via-[#FFEFEA]/60 to-[#FBF5FF]/60">
          <header className="flex items-center justify-between bg-white rounded-t-xl px-6 py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Riko.ai" className="h-8 w-auto" />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-1.5 text-sm border border-[#F3A547] text-[#F3A547] rounded-lg">
                Login
              </button>
              <button className="px-4 py-1.5 text-sm bg-[#F3A547] rounded-lg text-white">
                Sign Up
              </button>
            </div>
          </header>

          {!hasChatStarted ? (
            <>
              <section className="flex flex-col items-center text-center px-6 py-16">
                <img src="/mainLogo.png" alt="Riko" className="h-28 mb-6" />
                <h1 className="text-3xl font-semibold mb-6">
                  Ask <span className="text-orange-500">Riko</span> Anything
                </h1>

                <div className="w-full max-w-xl flex items-center bg-[#FAFAF8] border border-[#FFEBD3] rounded-full px-4 py-2 shadow">
                  <Plus className="w-4 h-4 text-orange-500" />
                  <input
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && userPrompt.trim()) {
                        sendMessage();
                      }
                    }}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!userPrompt.trim()}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      userPrompt.trim() 
                        ? "bg-orange-500 cursor-pointer" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {actions.map(({ label, icon: Icon, prompt }) => (
                    <button
                      key={label}
                      onClick={() => handleQuickAction(prompt)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-[#FAFAF8] border border-[#FEDEB8] rounded-xl hover:shadow-sm transition cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-orange-500" />
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="px-6 pb-10">
                <p className="text-center text-lg mb-6 text-[#604F4A]">
                  Power up your social game with Riko's AI-driven tools!
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  {features.map(({ text, icon: Icon }) => (
                    <div
                      key={text}
                      className="bg-[#FBF0EC] border border-[#F5DFD8] rounded-2xl px-6 py-5 shadow-sm text-center max-w-xs flex flex-col items-center gap-3"
                    >
                      <Icon className="w-6 h-6 text-orange-500" />
                      <p className="text-sm text-[#504643]">{text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="relative h-[100%] flex flex-col items-center pt-14 pb-36">
              <div className="w-full max-w-[804px] rounded-2xl space-y-4">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-6 whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-[#F3A547] text-white rounded-br-sm"
                            : "bg-[#FFF6EE] text-[#2A0E00] rounded-bl-sm"
                        }`}
                      >
                        {msg.content ? (
                          msg.content
                        ) : isLoading ? (
                          <span className="flex items-center gap-2 text-sm text-[#2A0E00]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Riko is thinking...
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 text-[10px]">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 rounded bg-[#E7E5E5] text-[#434343] hover:bg-[#dadada] cursor-pointer"
                  >
                    Copy
                  </button>
                  <ComingSoonButton label="Use in Post" />
                  <ComingSoonButton label="Add to Library" />
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 rounded bg-[#E7E5E5] text-[#434343] hover:bg-[#dadada] cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>

              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[804px] bg-[#FAFAF8] border border-[#FFEBD3] rounded-2xl shadow px-4 py-3 flex items-center gap-3">
                <Plus className="w-4 h-4 text-orange-500" />
                <input
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && userPrompt.trim()) {
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!userPrompt.trim()}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userPrompt.trim() 
                      ? "bg-orange-500 cursor-pointer" 
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}