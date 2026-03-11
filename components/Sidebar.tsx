
import React from 'react';
import { LifewoodLogo } from '../constants';
import { Conversation, Folder } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  folders: Folder[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  startNewChat: () => void;
  createNewFolder: () => void;
  toggleFolder: (id: string) => void;
  moveConversation: (convId: string, folderId?: string) => void;
  editingConvId: string | null;
  setEditingConvId: (id: string | null) => void;
  editingFolderId: string | null;
  setEditingFolderId: (id: string | null) => void;
  tempRenameValue: string;
  setTempRenameValue: (val: string) => void;
  handleRenameConv: (id: string) => void;
  handleRenameFolder: (id: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  triggerDeleteConfirm: (e: React.MouseEvent, type: 'conversation' | 'folder', id: string, title: string) => void;
  setShowSettings: (show: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations, folders, activeId, setActiveId, isSidebarOpen, setIsSidebarOpen,
  startNewChat, createNewFolder, toggleFolder, moveConversation,
  editingConvId, setEditingConvId, editingFolderId, setEditingFolderId,
  tempRenameValue, setTempRenameValue, handleRenameConv, handleRenameFolder,
  activeMenuId, setActiveMenuId, triggerDeleteConfirm, setShowSettings, menuRef
}) => {
  const renderConvItem = (conv: Conversation) => (
    <div 
      key={conv.id} 
      onClick={() => { setActiveId(conv.id); setIsSidebarOpen(false); }} 
      className={`group relative px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${activeId === conv.id ? 'bg-[#046241] text-white shadow-xl' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
    >
      <div className="flex-1 min-w-0">
        {editingConvId === conv.id ? (
          <input 
            autoFocus
            className="w-full bg-white/10 border-none outline-none text-white px-2 py-0.5 rounded text-[13px] font-semibold"
            value={tempRenameValue}
            onChange={(e) => setTempRenameValue(e.target.value)}
            onBlur={() => handleRenameConv(conv.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleRenameConv(conv.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-[13px] font-semibold truncate leading-tight">{conv.title}</div>
        )}
        <div className="text-[9px] font-black uppercase tracking-tighter opacity-40 mt-0.5">{conv.createdAt.toLocaleDateString()}</div>
      </div>
      
      <div className="relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === conv.id ? null : conv.id); }}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 100-4 2 2 0 000 4zM12 14a2 2 0 100-4 2 2 0 000 4zM12 21a2 2 0 100-4 2 2 0 000 4z"/></svg>
        </button>

        {activeMenuId === conv.id && (
          <div 
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-44 bg-[#133020] border border-white/10 rounded-xl shadow-2xl z-[150] overflow-hidden popover-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setEditingConvId(conv.id); setTempRenameValue(conv.title); setActiveMenuId(null); }}
              className="w-full text-left px-4 py-3 text-[10px] font-google font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Rename
            </button>
            {conv.folderId && (
              <button 
                onClick={() => moveConversation(conv.id, undefined)}
                className="w-full text-left px-4 py-3 text-[10px] font-google font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                Remove from Group
              </button>
            )}
            <button 
              onClick={(e) => triggerDeleteConfirm(e, 'conversation', conv.id, conv.title)}
              className="w-full text-left px-4 py-3 text-[10px] font-google font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#133020] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col shadow-2xl`}>
      <div className="p-8 border-b border-white/5">
        <LifewoodLogo />
        <div className="grid grid-cols-2 gap-2 mt-10">
          <button onClick={startNewChat} className="bg-[#046241] hover:bg-[#057a51] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-google font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4"/></svg>
            Chat
          </button>
          <button onClick={createNewFolder} className="bg-white/5 hover:bg-white/10 text-white/80 py-3.5 rounded-xl flex items-center justify-center gap-2 font-google font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Folder
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 lifewood-scrollbar">
        <div className="space-y-2">
          <h3 className="text-white/20 text-[9px] font-google font-black uppercase tracking-[0.2em] px-4 mb-2">Projects & Groups</h3>
          {folders.map(folder => (
            <div key={folder.id} className="space-y-1">
              <div 
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${folder.isOpen ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white/60'}`}
                onClick={() => toggleFolder(folder.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const convId = e.dataTransfer.getData('convId');
                  if (convId) moveConversation(convId, folder.id);
                }}
              >
                <svg className={`w-4 h-4 transition-transform duration-300 ${folder.isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7"/></svg>
                <div className="flex-1 min-w-0">
                  {editingFolderId === folder.id ? (
                    <input 
                      autoFocus
                      className="w-full bg-white/10 border-none outline-none text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase"
                      value={tempRenameValue}
                      onChange={(e) => setTempRenameValue(e.target.value)}
                      onBlur={() => handleRenameFolder(folder.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="text-[11px] font-bold uppercase tracking-wider truncate">{folder.name}</div>
                  )}
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setTempRenameValue(folder.name); }} className="p-1 hover:bg-white/10 rounded">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button onClick={(e) => triggerDeleteConfirm(e, 'folder', folder.id, folder.name)} className="p-1 hover:bg-red-500/20 rounded text-red-400/60">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              {folder.isOpen && (
                <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {conversations.filter(c => c.folderId === folder.id).map(conv => (
                    <div key={conv.id} draggable onDragStart={(e) => e.dataTransfer.setData('convId', conv.id)}>
                      {renderConvItem(conv)}
                    </div>
                  ))}
                  {conversations.filter(c => c.folderId === folder.id).length === 0 && (
                    <div className="text-[9px] text-white/10 italic px-6 py-2">Empty collection</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <h3 className="text-white/20 text-[9px] font-google font-black uppercase tracking-[0.2em] px-4 mb-2">Uncategorized</h3>
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
            const convId = e.dataTransfer.getData('convId');
            if (convId) moveConversation(convId, undefined);
          }}>
            {conversations.filter(c => !c.folderId).map(conv => (
              <div key={conv.id} draggable onDragStart={(e) => e.dataTransfer.setData('convId', conv.id)}>
                {renderConvItem(conv)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
        <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all text-[10px] font-google font-black uppercase tracking-widest">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Settings
        </button>
      </div>
    </aside>
  );
};
