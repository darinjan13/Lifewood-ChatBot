
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SparkleIcon, TOOLS } from '../constants';
import { Message, SenderType, Conversation, FileData } from '../types';

interface MessageListProps {
  currentConversation: Conversation | undefined;
  isLoading: boolean;
  theme: string;
  setSelectedTool: (tool: any) => void;
  setInput: (val: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  currentConversation, isLoading, theme, setSelectedTool, setInput, messagesEndRef
}) => {
  const suggestedPrompts = [
    { category: 'Strategic Vision', label: 'ASEAN HUB', text: "Conceptualize a logistics-first AI data hub in ASEAN.", tool: 'chat', icon: '🌐' },
    { category: 'Technical Execution', label: 'RLHF QUALITY', text: "Compare data quality benchmarks for multi-lingual RLHF.", tool: 'research', icon: '📊' },
    { category: 'Brand Value', label: 'ESG GOALS', text: "How does Lifewood's 'Always On' model reduce ESG carbon footprint?", tool: 'chat', icon: '🌱' }
  ];

  const isEmpty = !currentConversation || currentConversation.messages.length === 0;

  return (
    <div className={`flex-1 overflow-y-auto flex flex-col items-center lifewood-scrollbar pb-64 px-6 ${isEmpty ? 'pt-[10vh]' : 'pt-8'}`}>
      <div className="w-full max-w-5xl space-y-6">
        {isEmpty && (
          <div className="space-y-12 animate-in fade-in duration-1000 max-w-2xl mx-auto py-10">
            <div className="text-center space-y-6">
              <h2 className={`text-6xl font-google font-black tracking-tighter leading-tight ${theme === 'classic' ? 'text-[#046241]' : 'text-[#FFB347]'}`}>
                Innovation. <br/> <span className={theme === 'classic' ? 'text-[#FFB347]' : 'text-white'}>Verified.</span>
              </h2>
              <p className="text-[11px] font-google font-black uppercase tracking-[0.6em] opacity-30">
                Enterprise Intelligence Engine
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedPrompts.map((s, i) => (
                <button key={i} onClick={() => { setSelectedTool(TOOLS.find(t => t.id === s.tool) || TOOLS[0]); setInput(s.text); }} className={`group p-6 rounded-[2rem] border transition-all text-left flex flex-col justify-between ${theme === 'classic' ? 'bg-white border-[#133020]/5 hover:border-[#FFB347]' : 'bg-white/5 border-white/10 hover:border-[#FFB347]'}`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme === 'classic' ? 'bg-[#133020]/5 text-[#133020]/60' : 'bg-white/10 text-white/60'}`}>{s.category}</span>
                       <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">{s.icon}</span>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-tighter text-[#FFB347] mb-1">{s.label}</h4>
                    <p className={`text-[13px] font-bold leading-snug ${theme === 'classic' ? 'text-[#133020]' : 'text-white'}`}>{s.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {currentConversation?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === SenderType.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex gap-6 ${msg.sender === SenderType.USER ? 'flex-row-reverse max-w-[80%]' : 'max-w-[85%]'}`}>
               {msg.sender === SenderType.AI && (
                 <div className="mt-1 flex-shrink-0">
                   <div className="w-10 h-10 rounded-full bg-[#133020] flex items-center justify-center shadow-lg border border-white/10">
                      <SparkleIcon className="w-5 h-5 fill-[#FFB347]" />
                   </div>
                 </div>
               )}
               <div className="flex-1">
                  <div className={`
                    ${msg.sender === SenderType.USER 
                      ? 'bg-[#FFB347] text-[#133020] px-6 py-4 rounded-3xl rounded-tr-none font-google font-bold text-[14px] shadow-lg border border-[#133020]/10 whitespace-pre-wrap' 
                      : `font-serif text-[19px] leading-relaxed tracking-wide opacity-90 py-1 markdown-content ${theme === 'classic' ? 'text-[#133020]' : 'text-white/90'}`
                    }
                  `}>
                    {msg.sender === SenderType.AI ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                    
                    {msg.generatedImageUrl && (
                      <div className="mt-8 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-black/10 p-2 max-w-xl">
                        <img src={msg.generatedImageUrl} className="w-full h-auto rounded-[1.8rem]" alt="AI Generated" />
                      </div>
                    )}
                  </div>
                  <div className={`mt-1 text-[9px] font-google font-black uppercase tracking-widest opacity-20 ${msg.sender === SenderType.USER ? 'text-right' : ''}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-6 w-full animate-pulse justify-start">
            <div className="w-10 h-10 rounded-full bg-black/10" />
            <div className="flex-1 space-y-4 pt-3">
              <div className={`h-2.5 rounded-full w-3/4 ${theme === 'classic' ? 'bg-[#133020]/5' : 'bg-white/10'}`}></div>
              <div className={`h-2.5 rounded-full w-1/2 ${theme === 'classic' ? 'bg-[#133020]/5' : 'bg-white/10'}`}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
