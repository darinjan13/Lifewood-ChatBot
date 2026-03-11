
import React from 'react';
import { TOOLS, MODELS } from '../constants';
import { FileData } from '../types';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  handleSend: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedTool: any;
  setSelectedTool: (tool: any) => void;
  showTools: boolean;
  setShowTools: (show: boolean) => void;
  selectedModel: any;
  setSelectedModel: (model: any) => void;
  showModels: boolean;
  setShowModels: (show: boolean) => void;
  attachments: FileData[];
  setAttachments: (files: FileData[]) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  toolsMenuRef: React.RefObject<HTMLDivElement | null>;
  theme: string;
  getFooterBackground: () => string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input, setInput, isLoading, handleSend, handleKeyPress,
  selectedTool, setSelectedTool, showTools, setShowTools,
  selectedModel, setSelectedModel, showModels, setShowModels,
  attachments, setAttachments, handleFileUpload, fileInputRef, toolsMenuRef, theme, getFooterBackground
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 pt-32 pb-8 px-8 flex justify-center bg-gradient-to-t ${getFooterBackground()} z-[50] pointer-events-none`}>
      <div className="w-full max-w-3xl pointer-events-auto">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 px-2 animate-in slide-in-from-bottom-2">
            {attachments.map((file, idx) => (
              <div key={idx} className="relative group bg-white p-1 rounded-xl shadow-lg border border-[#133020]/5 w-20 h-20">
                <img src={file.data} className="w-full h-full object-cover rounded-lg" alt="Attachment" />
                <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-[#133020] text-white p-1 rounded-full shadow-md scale-75">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={`rounded-[1.8rem] overflow-visible border-none shadow-2xl relative ${theme === 'classic' ? 'bg-white' : 'bg-[#046241]/95 backdrop-blur-2xl border border-white/5'}`}>
          <div className="p-3 flex items-center gap-2 relative">
            <button onClick={() => fileInputRef.current?.click()} className={`p-4 rounded-xl transition-all active:scale-95 ${theme === 'classic' ? 'hover:bg-[#133020]/5 text-[#133020]/20' : 'hover:bg-white/5 text-white/20'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4"/></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
            
            <div className="relative">
              <button onClick={() => { setShowTools(!showTools); setShowModels(false); }} className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-google font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-md border border-[#133020]/10 bg-[#FFB347] text-[#133020]`}>
                <span className="text-sm">{selectedTool.icon}</span>
                <span className="hidden sm:inline">{selectedTool.name}</span>
              </button>
              
              {showTools && (
                <div ref={toolsMenuRef} className="absolute bottom-full left-0 mb-4 w-64 bg-[#0d2116] border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden popover-enter z-[200] p-1.5">
                  <div className="space-y-0.5">
                    {TOOLS.map(t => (
                      <button key={t.id} onClick={() => { setSelectedTool(t); setShowTools(false); }} className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${selectedTool.id === t.id ? 'bg-[#046241] text-white' : 'hover:bg-white/5 text-white/60'}`}>
                        <span className="text-lg opacity-80">{t.icon}</span>
                        <div className="text-[10px] font-google font-black uppercase tracking-widest">{t.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Synthesize new request..." className={`w-full bg-transparent border-none resize-none py-3 px-4 text-[16px] font-google font-bold focus:ring-0 focus:outline-none ring-0 outline-none max-h-40 no-scrollbar ${theme === 'classic' ? 'text-[#133020]' : 'text-white'}`} />
            </div>

            <div className="flex items-center gap-3 pr-3">
               <div className="relative hidden sm:block">
                 <button onClick={() => { setShowModels(!showModels); setShowTools(false); }} className={`px-3 py-2 rounded-lg text-[9px] font-google font-black uppercase tracking-widest transition-all ${theme === 'classic' ? 'text-[#133020]/20 hover:text-[#133020]/40' : 'text-white/20 hover:text-white/40'}`}>
                    {selectedModel.name}
                  </button>
               </div>
               <button disabled={isLoading || (!input.trim() && attachments.length === 0)} onClick={handleSend} className={`p-4 rounded-2xl transition-all active:scale-90 ${(!input.trim() && attachments.length === 0) ? 'bg-black/5 text-black/10' : 'bg-black/5 text-[#133020] hover:bg-black/10 shadow-lg'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
               </button>
            </div>
          </div>
        </div>
        <p className="text-[9px] font-google opacity-20 text-center mt-6 font-black uppercase tracking-[0.4em]">
          Intelligence Authenticated - Lifewood Core
        </p>
      </div>
    </div>
  );
};
