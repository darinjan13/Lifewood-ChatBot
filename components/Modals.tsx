
import React, { useState } from 'react';

interface ModalsProps {
  confirmModal: { show: boolean; type: string; id: string; title: string };
  setConfirmModal: (val: any) => void;
  handleConfirmedDelete: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  systemInstruction: string;
  setSystemInstruction: (val: string) => void;
  theme?: string;
  setTheme?: (val: string) => void;
}

// Using Pick to specify only relevant props for ConfirmationModal
export const ConfirmationModal: React.FC<Pick<ModalsProps, 'confirmModal' | 'setConfirmModal' | 'handleConfirmedDelete'>> = ({
  confirmModal, setConfirmModal, handleConfirmedDelete
}) => {
  if (!confirmModal.show) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#133020] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 text-white p-8 space-y-6">
        <h3 className="text-lg font-google font-black uppercase tracking-widest text-[#FFB347]">Confirm Delete</h3>
        <p className="text-xs text-white/60 leading-relaxed font-google">
          Are you sure you want to permanently delete <span className="text-white font-bold">"{confirmModal.title}"</span>? This action is irreversible.
        </p>
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => setConfirmModal({ ...confirmModal, show: false })}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all text-[10px] font-google font-black uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmedDelete}
            className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-all text-[10px] font-google font-black uppercase tracking-widest shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Fixed: Using Pick to specify only relevant props for SettingsModal to avoid unnecessary prop requirements in parent components
export const SettingsModal: React.FC<Pick<ModalsProps, 'showSettings' | 'setShowSettings' | 'systemInstruction' | 'setSystemInstruction' | 'theme' | 'setTheme'>> = ({
  showSettings, setShowSettings, systemInstruction, setSystemInstruction, theme, setTheme
}) => {
  const [activeTab, setActiveTab] = useState<'directives' | 'appearance'>('directives');

  if (!showSettings) return null;

  const themes = [
    { id: 'classic', name: 'Classic Beige', preview: 'bg-[#f5eedb]' },
    { id: 'dark', name: 'Deep Forest', preview: 'bg-[#133020]' },
    { id: 'high-contrast', name: 'Castleton Gold', preview: 'bg-black' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#133020] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 text-white animate-in slide-in-from-bottom-4">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-google font-black uppercase tracking-tighter mr-4">Settings</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('directives')}
                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'directives' ? 'border-[#FFB347] text-white' : 'border-transparent text-white/40'}`}
              >
                Directives
              </button>
              <button 
                onClick={() => setActiveTab('appearance')}
                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'appearance' ? 'border-[#FFB347] text-white' : 'border-transparent text-white/40'}`}
              >
                Appearance
              </button>
            </div>
          </div>
          <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-8 h-[400px] overflow-y-auto lifewood-scrollbar">
          {activeTab === 'directives' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">System Directives</label>
              <textarea 
                value={systemInstruction} 
                onChange={(e) => setSystemInstruction(e.target.value)} 
                placeholder="Define how Lifewood Intelligence should behave..." 
                className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-xs font-medium leading-relaxed resize-none focus:border-[#FFB347] transition-all focus:ring-0" 
              />
              <p className="text-[9px] opacity-20 italic">Changes take effect on your next interaction.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Interface Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme?.(t.id)}
                      className={`relative p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 ${theme === t.id ? 'bg-[#046241] border-[#FFB347] shadow-xl' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className={`w-full h-20 rounded-xl ${t.preview} border border-white/10 shadow-inner`} />
                      <div className="text-[10px] font-black uppercase tracking-widest">{t.name}</div>
                      {theme === t.id && (
                        <div className="absolute top-3 right-3 w-4 h-4 bg-[#FFB347] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#133020]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/20 flex justify-end">
          <button onClick={() => setShowSettings(false)} className="bg-[#FFB347] text-[#133020] px-10 py-4 rounded-xl font-google font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:bg-[#ffc26b]">
            Sync Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
