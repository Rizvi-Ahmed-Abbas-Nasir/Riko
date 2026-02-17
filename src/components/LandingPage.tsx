import {
  Send,
  PenLine,
  Hash,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Sparkles,
  Zap,
  Brain,
  Rocket,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

type AttachmentType = {
  name: string;
  type: string;
  mimeType: string;
  base64: string;
  preview?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  attachments?: AttachmentType[];
};

// ── FileHintPopover (pure, outside main component) ──────────────
function FileHintPopover({
  onChooseFile,
  popoverRef,
}: {
  onChooseFile: () => void;
  popoverRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2 left-0 z-50 bg-white border border-[#FFEBD3] rounded-2xl shadow-xl p-3.5"
      style={{ minWidth: "210px" }}
    >
      <p className="text-[11px] font-semibold text-[#604F4A] mb-2.5">Attach a file</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] text-[#7a6a65]">
          <ImageIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span>Images — JPG, PNG, GIF, WebP</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#7a6a65]">
          <FileText className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span>Documents — PDF, TXT, DOCX</span>
        </div>
        <p className="text-[10px] text-[#b0a8a4]">Max 10MB per file</p>
      </div>
      <button
        onClick={onChooseFile}
        className="mt-3 w-full py-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs rounded-xl transition font-medium"
      >
        Choose File
      </button>
    </div>
  );
}

// ── ComingSoonButton (pure, outside main component) ──────────────
function ComingSoonButton({ label }: { label: string }) {
  return (
    <div className="relative group">
      <button
        disabled
        className="px-3 py-1 rounded-lg bg-[#E7E5E5] text-[#9a9a9a] cursor-not-allowed text-[10px]"
      >
        {label}
      </button>
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
        Coming soon
      </span>
    </div>
  );
}

// ── MessageAttachments (pure, outside main component) ────────────
function MessageAttachments({ atts }: { atts: AttachmentType[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {atts.map((att, i) =>
        att.type === "image" ? (
          <img
            key={i}
            src={att.preview}
            alt={att.name}
            className="max-w-[150px] max-h-[150px] sm:max-w-[200px] sm:max-h-[200px] rounded-xl object-cover border border-white/30"
          />
        ) : (
          <div key={i} className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-1 text-xs">
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="max-w-[100px] truncate">{att.name}</span>
          </div>
        )
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function RikoHome() {
  const [userPrompt, setUserPrompt] = useState("");
  const [hasChatStarted, setHasChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);
  const [showFileHint, setShowFileHint] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileHintRef = useRef<HTMLDivElement>(null);
  const paperclipRef = useRef<HTMLButtonElement>(null);

  const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const actions = [
    { label: "Write Caption", icon: PenLine, prompt: "Write a social media caption for my post." },
    { label: "Find Hashtags", icon: Hash, prompt: "Suggest relevant hashtags for my post." },
    { label: "What's Trending", icon: TrendingUp, prompt: "What content topics are trending right now on social media?" },
    { label: "Analyze Competitor", icon: BarChart3, prompt: "Analyze my competitor's social media content and strategy." },
    { label: "Create Content Ideas", icon: Lightbulb, prompt: "Generate content ideas for my social media." },
    { label: "Improve My Content", icon: Sparkles, prompt: "Improve my social media content and make it more engaging." },
  ];

  const features = [
    { text: "Speed up your content creation", icon: Zap },
    { text: "Get creative ideas & insights", icon: Brain },
    { text: "Optimize your posts like a pro", icon: Rocket },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fileHintRef.current &&
        !fileHintRef.current.contains(e.target as Node) &&
        paperclipRef.current &&
        !paperclipRef.current.contains(e.target as Node)
      ) {
        setShowFileHint(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePaperclipClick = () => {
    setShowFileHint((prev) => !prev);
  };

  const handleAttachFile = () => {
    setShowFileHint(false);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(`Unsupported file type: ${file.name}`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large (max 10MB): ${file.name}`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64Full = reader.result as string;
        const base64 = base64Full.split(",")[1];
        const isImage = file.type.startsWith("image/");
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: isImage ? "image" : "document",
            mimeType: file.type,
            base64,
            preview: isImage ? base64Full : undefined,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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

  const callAPI = async (messagesToSend: ChatMessage[]) => {
    const response = await fetch("https://r-ik-oapi-8wey.vercel.app/api/RikoChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesToSend }),
    });
    const data = await response.json();
    return data?.response || "No response from Riko AI";
  };

  const handleSend = async (overridePrompt?: string) => {
    const content = (overridePrompt ?? userPrompt).trim();
    if (!content && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      role: "user",
      content,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserPrompt("");
    setAttachments([]);
    setHasChatStarted(true);
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const allMessages = [...messages, userMessage];
      const aiResponse = await callAPI(allMessages);
      setIsLoading(false);
      simulateTyping(
        formatAIResponse(aiResponse),
        (partialText) => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: partialText },
          ]);
        },
        () => {}
      );
    } catch (error) {
      console.error("Riko error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Unable to reach Riko AI." },
      ]);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const lastAIMessage = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAIMessage?.content) return;
    navigator.clipboard.writeText(lastAIMessage.content);
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;
    setUserPrompt(lastUserMessage.content);
  };

  const canSend = userPrompt.trim().length > 0 || attachments.length > 0;

  // ── Shared input box JSX (inlined, NOT a nested component) ───
  const inputBoxJSX = (
    <div className="relative bg-[#FAFAF8] border border-[#FFEBD3] rounded-2xl shadow-md overflow-visible">
      {/* Attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-[#FFF1E0] border border-[#FEDEB8] rounded-lg px-2 py-1 text-xs text-[#604F4A]"
            >
              {att.type === "image" ? (
                <img src={att.preview} alt={att.name} className="w-7 h-7 object-cover rounded" />
              ) : (
                <FileText className="w-4 h-4 text-orange-400 flex-shrink-0" />
              )}
              <span className="max-w-[80px] sm:max-w-[110px] truncate">{att.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="ml-0.5 text-[#9a9a9a] hover:text-red-400 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5">
        {/* Paperclip button + popover */}
        <div className="relative flex-shrink-0">
          <button
            ref={paperclipRef}
            onMouseDown={(e) => e.preventDefault()} // prevent input blur
            onClick={handlePaperclipClick}
            title="Attach file"
            className={`p-1.5 rounded-lg transition ${
              showFileHint
                ? "bg-orange-100 text-orange-600"
                : "text-orange-400 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {showFileHint && (
            <FileHintPopover onChooseFile={handleAttachFile} popoverRef={fileHintRef} />
          )}
        </div>

        {/* Text input */}
        <input
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canSend) {
              handleSend();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none placeholder:text-[#c4bcb9]"
        />

        {/* Send button */}
        <button
          onMouseDown={(e) => e.preventDefault()} // prevent input blur
          onClick={() => handleSend()}
          disabled={!canSend}
          className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition ${
            canSend
              ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F1F2ED]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8EE]/80 via-[#FFEFEA]/60 to-[#FBF5FF]/60">

        {/* Sticky header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-[#f5e6d8] px-4 sm:px-6 py-3">
          <img src="/logo.png" alt="Riko.ai" className="h-7 sm:h-8 w-auto" />
          <div className="flex gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm border border-[#F3A547] text-[#F3A547] rounded-lg hover:bg-orange-50 transition">
              Login
            </button>
            <button className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-[#F3A547] hover:bg-orange-500 rounded-lg text-white transition">
              Sign Up
            </button>
          </div>
        </header>

        {/* ── HOME VIEW ── */}
        {!hasChatStarted && (
          <main className="flex flex-col flex-1">
            <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-10 sm:pt-14 pb-6">
              <img src="/mainLogo.png" alt="Riko" className="h-20 sm:h-28 mb-4 sm:mb-6" />
              <h1 className="text-2xl sm:text-3xl font-semibold mb-5 sm:mb-6">
                Ask <span className="text-orange-500">Riko</span> Anything
              </h1>

              {/* Input bar */}
              <div className="w-full max-w-xl mx-auto">
                {inputBoxJSX}
              </div>

              {/* Quick action pills */}
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center w-full max-w-2xl">
                {actions.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(prompt)}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#FAFAF8] border border-[#FEDEB8] rounded-xl hover:shadow-sm hover:border-orange-300 transition cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* Feature cards */}
            <section className="px-4 sm:px-6 pb-10 sm:pb-14">
              <p className="text-center text-base sm:text-lg mb-5 sm:mb-6 text-[#604F4A]">
                Power up your social game with Riko's AI-driven tools!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch max-w-2xl mx-auto">
                {features.map(({ text, icon: Icon }) => (
                  <div
                    key={text}
                    className="flex-1 bg-[#FBF0EC] border border-[#F5DFD8] rounded-2xl px-5 py-5 shadow-sm text-center flex flex-col items-center gap-3"
                  >
                    <Icon className="w-6 h-6 text-orange-500" />
                    <p className="text-sm text-[#504643]">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* ── CHAT VIEW ── */}
        {hasChatStarted && (
          <main className="flex flex-col flex-1">
            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-36">
              <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[88%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2.5
                        text-sm leading-6 whitespace-pre-wrap break-words
                        ${
                          msg.role === "user"
                            ? "bg-[#F3A547] text-white rounded-br-sm"
                            : "bg-white text-[#2A0E00] rounded-bl-sm shadow-sm border border-[#f0e4d8]"
                        }
                      `}
                    >
                      {msg.attachments && <MessageAttachments atts={msg.attachments} />}
                      {msg.content ? (
                        msg.content
                      ) : isLoading ? (
                        <span className="flex items-center gap-2 text-sm text-[#a08070]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Riko is thinking...
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Action buttons */}
              <div className="max-w-2xl mx-auto w-full mt-3 sm:mt-4 flex flex-wrap gap-2 text-[10px]">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-[#E7E5E5] text-[#434343] hover:bg-[#dadada] cursor-pointer transition"
                >
                  Copy
                </button>
                <ComingSoonButton label="Use in Post" />
                <ComingSoonButton label="Add to Library" />
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 rounded-lg bg-[#E7E5E5] text-[#434343] hover:bg-[#dadada] cursor-pointer transition"
                >
                  Try Again
                </button>
              </div>
            </div>

            {/* Fixed bottom input */}
            <div className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-4 pb-4 pt-2 bg-gradient-to-t from-[#F1F2ED] via-[#F1F2ED]/90 to-transparent">
              <div className="max-w-2xl mx-auto">
                {inputBoxJSX}
              </div>
            </div>
          </main>
        )}

      </div>
    </div>
  );
}