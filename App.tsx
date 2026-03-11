
import React, { useState, useRef, useEffect } from 'react';
import { TOOLS, MODELS, LifewoodLogo } from './constants';
import { Message, SenderType, Conversation, FileData, Folder } from './types';
import { getGeminiResponse } from './services/geminiService';

// Components
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { ConfirmationModal, SettingsModal } from './components/Modals';

const App: React.FC = () => {
  // Persistence states
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('lifewood_v3_conversations');
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
      createdAt: new Date(c.createdAt)
    })) : [];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('lifewood_folders');
    return saved ? JSON.parse(saved).map((f: any) => ({
      ...f,
      createdAt: new Date(f.createdAt)
    })) : [];
  });

  const [systemInstruction, setSystemInstruction] = useState(() => 
    localStorage.getItem('lifewood_system_instruction') || 'You are Lifewood Intelligence, a proactive innovation partner focusing on AI data strategy and global logistics.'
  );

  const [theme, setTheme] = useState(() => localStorage.getItem('lifewood_theme') || 'classic');

  // UI states
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [showTools, setShowTools] = useState(false);
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]); 
  const [showModels, setShowModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  // Menu states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [tempRenameValue, setTempRenameValue] = useState('');

  // Confirmation Modal states
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'conversation' | 'folder';
    id: string;
    title: string;
  }>({ show: false, type: 'conversation', id: '', title: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const currentConversation = conversations.find(c => c.id === activeId);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('lifewood_v3_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('lifewood_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('lifewood_system_instruction', systemInstruction);
  }, [systemInstruction]);

  useEffect(() => {
    localStorage.setItem('lifewood_theme', theme);
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isLoading]);

  // Folder & Conversation Actions
  const createNewFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: 'New Collection',
      createdAt: new Date(),
      isOpen: true
    };
    setFolders(prev => [newFolder, ...prev]);
    setEditingFolderId(newFolder.id);
    setTempRenameValue(newFolder.name);
  };

  const triggerDeleteConfirm = (e: React.MouseEvent, type: 'conversation' | 'folder', id: string, title: string) => {
    e.stopPropagation();
    setConfirmModal({ show: true, type, id, title });
    setActiveMenuId(null);
  };

  const handleConfirmedDelete = () => {
    if (confirmModal.type === 'conversation') {
      setConversations(prev => prev.filter(c => c.id !== confirmModal.id));
      if (activeId === confirmModal.id) setActiveId(null);
    } else {
      setFolders(prev => prev.filter(f => f.id !== confirmModal.id));
      setConversations(prev => prev.map(c => c.folderId === confirmModal.id ? { ...c, folderId: undefined } : c));
    }
    setConfirmModal({ ...confirmModal, show: false });
  };

  const toggleFolder = (folderId: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, isOpen: !f.isOpen } : f));
  };

  const startNewChat = () => {
    setActiveId(null);
    setInput('');
    setAttachments([]);
    setIsSidebarOpen(false);
    setSelectedTool(TOOLS[0]);
  };

  const moveConversation = (convId: string, folderId?: string) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, folderId } : c));
    setActiveMenuId(null);
  };

  const handleRenameConv = (id: string) => {
    if (tempRenameValue.trim()) {
      setConversations(prev => prev.map(c => c.id === id ? { ...c, title: tempRenameValue } : c));
    }
    setEditingConvId(null);
  };

  const handleRenameFolder = (id: string) => {
    if (tempRenameValue.trim()) {
      setFolders(prev => prev.map(f => f.id === id ? { ...f, name: tempRenameValue } : f));
    }
    setEditingFolderId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments(prev => [...prev, {
          data: event.target?.result as string,
          mimeType: file.type,
          fileName: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    let targetConv = currentConversation;
    if (!targetConv) {
      const newId = Date.now().toString();
      targetConv = {
        id: newId,
        title: input.slice(0, 30) || 'New Lifewood Session',
        messages: [],
        personaId: 'default',
        createdAt: new Date(),
      };
      setConversations(prev => [targetConv!, ...prev]);
      setActiveId(newId);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: SenderType.USER,
      timestamp: new Date(),
      attachments: [...attachments],
    };

    setConversations(prev => prev.map(c => 
      c.id === targetConv!.id ? { ...c, messages: [...c.messages, userMsg] } : c
    ));

    setInput('');
    setAttachments([]);
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(
      userMsg.text, 
      userMsg.attachments,
      selectedTool.id,
      selectedModel.id,
      systemInstruction
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.text,
      generatedImageUrl: aiResponse.generatedImageUrl,
      sender: SenderType.AI,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(c => 
      c.id === targetConv!.id ? { ...c, messages: [...c.messages, aiMsg] } : c
    ));
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getThemeClasses = () => {
    switch(theme) {
      case 'dark': return 'bg-[#133020] text-white';
      case 'high-contrast': return 'bg-black text-[#FFB347]';
      default: return 'bg-[#f5eedb] text-[#133020]';
    }
  };

  const getFooterBackground = () => {
    switch(theme) {
      case 'dark': return 'from-[#133020] via-[#133020] to-transparent';
      case 'high-contrast': return 'from-black via-black to-transparent';
      default: return 'from-[#f5eedb] via-[#f5eedb] to-transparent';
    }
  };

  const getNavbarClasses = () => {
    switch(theme) {
      case 'dark': return 'bg-[#133020]/80 border-white/5';
      case 'high-contrast': return 'bg-black/80 border-white/10';
      default: return 'bg-transparent border-transparent';
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${getThemeClasses()}`}>
      
      <ConfirmationModal 
        confirmModal={confirmModal} 
        setConfirmModal={setConfirmModal} 
        handleConfirmedDelete={handleConfirmedDelete} 
      />

      <Sidebar 
        conversations={conversations}
        folders={folders}
        activeId={activeId}
        setActiveId={setActiveId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        startNewChat={startNewChat}
        createNewFolder={createNewFolder}
        toggleFolder={toggleFolder}
        moveConversation={moveConversation}
        editingConvId={editingConvId}
        setEditingConvId={setEditingConvId}
        editingFolderId={editingFolderId}
        setEditingFolderId={setEditingFolderId}
        tempRenameValue={tempRenameValue}
        setTempRenameValue={setTempRenameValue}
        handleRenameConv={handleRenameConv}
        handleRenameFolder={handleRenameFolder}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        triggerDeleteConfirm={triggerDeleteConfirm}
        setShowSettings={setShowSettings}
        menuRef={menuRef}
      />

      <main className={`flex-1 flex flex-col relative h-full transition-all duration-300 ${isSidebarOpen ? 'opacity-20 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
        <header className={`sticky top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-40 transition-all duration-500 ${getNavbarClasses()}`}>
          <div className="flex-1 flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 bg-[#133020] text-white rounded-lg shadow-xl flex items-center justify-center lg:hidden active:scale-95 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M4 6h16M4 12h16m-7 6h7"/></svg>
            </button>
            <div className="hidden lg:flex w-10 h-10 bg-[#133020] text-white rounded-lg shadow-xl items-center justify-center">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M4 6h16M4 12h16m-7 6h7"/></svg>
            </div>
            <LifewoodLogo className="h-6" textClass={theme === 'classic' ? 'text-[#133020]' : 'text-white'} />
          </div>
          <div className="flex-1 flex justify-center">
            {currentConversation && (
              <h1 className="text-[10px] font-google font-black uppercase tracking-[0.4em] opacity-40 truncate max-w-[200px] sm:max-w-md text-center">
                {currentConversation.title}
              </h1>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-black uppercase tracking-widest opacity-20">SECURE INSTANCE</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#046241]"></div>
            </div>
          </div>
        </header>

        <MessageList 
          currentConversation={currentConversation}
          isLoading={isLoading}
          theme={theme}
          setSelectedTool={setSelectedTool}
          setInput={setInput}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput 
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSend={handleSend}
          handleKeyPress={handleKeyPress}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          showTools={showTools}
          setShowTools={setShowTools}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          showModels={showModels}
          setShowModels={setShowModels}
          attachments={attachments}
          setAttachments={setAttachments}
          handleFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          toolsMenuRef={toolsMenuRef}
          theme={theme}
          getFooterBackground={getFooterBackground}
        />
      </main>

      <SettingsModal 
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        systemInstruction={systemInstruction}
        setSystemInstruction={setSystemInstruction}
        theme={theme}
        setTheme={setTheme}
      />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#133020]/40 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default App;
