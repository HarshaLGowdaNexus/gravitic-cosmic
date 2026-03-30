"use client";

import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', text: string }[]>([
    { role: 'agent', text: 'I am your hallucination-free context guide. Ask me any follow-ups regarding the uploaded context.' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Simulate WebSocket response
    setTimeout(() => {
         setMessages(prev => [...prev, { 
             role: 'agent', 
             text: 'According to the retrieved context from MCP Search, there is no evidence to support that claim. Would you like me to trigger a deeper search?' 
         }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-500 transition-colors z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 glass-panel backdrop-blur-3xl shadow-2xl z-50 flex flex-col border-l border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-lg text-white">Context Guide</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the context..."
              className="flex-1 bg-slate-800 border border-slate-600 text-white p-2 rounded focus:outline-none focus:border-sky-500"
            />
            <button onClick={handleSend} className="bg-sky-600 text-white p-2 rounded hover:bg-sky-500">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
