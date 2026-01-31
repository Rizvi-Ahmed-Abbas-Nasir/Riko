import { Send, Plus } from "lucide-react";

export default function RikoHome() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[1468px] rounded-xl bg-[#F1F2ED] p-4">
        <div className="relative rounded-xl bg-gradient-to-b from-[#FFF8EE]/80 via-[#FFEFEA]/60 to-[#FBF5FF]/60">
         
          <header className="flex items-center justify-between bg-white rounded-t-xl px-6 py-4">
            <div className="text-xl font-semibold">Riko.ai</div>
            <div className="flex gap-3">
              <button className="px-4 py-1.5 text-sm border border-[#F3A547] text-[#F3A547] rounded-lg">Login</button>
              <button className="px-4 py-1.5 text-sm bg-[#F3A547] rounded-lg">Sign Up</button>
            </div>
          </header>

          <section className="flex flex-col items-center text-center px-6 py-16">
            <div className="mb-6">
              <img src="/logo.png" alt="Riko" className="h-28 mx-auto" />
            </div>
            <h1 className="text-3xl font-semibold mb-6">Ask <span className="text-orange-500">Riko</span> Anything</h1>

            <div className="w-full max-w-xl flex items-center bg-[#FAFAF8] border border-[#FFEBD3] rounded-full px-4 py-2 shadow">
              <Plus className="w-4 h-4 text-orange-500" />
              <input
                placeholder="Ask anything..."
                className="flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none"
              />
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {[
                "Write Caption",
                "Find Hashtags",
                "What's Trending",
                "Analyze Competitor",
                "Create Content Ideas",
                "Improve My Content",
              ].map((item) => (
                <button
                  key={item}
                  className="px-4 py-2 text-sm bg-[#FAFAF8] border border-[#FEDEB8] rounded-xl"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="px-6 pb-10">
            <p className="text-center text-lg mb-6 text-[#604F4A]">
              Power up your social game with Riko’s AI‑driven tools!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {["Speed up your content creation", "Get creative ideas & insights", "Optimize your posts like a pro"].map(
                (text) => (
                  <div
                    key={text}
                    className="bg-[#FBF0EC] border border-[#F5DFD8] rounded-2xl px-6 py-5 shadow-sm text-center max-w-xs"
                  >
                    <p className="text-sm text-[#504643]">{text}</p>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
