
export enum SenderType {
  USER = 'user',
  AI = 'ai'
}

export interface FileData {
  data: string;
  mimeType: string;
  fileName: string;
}

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: Date;
  attachments?: FileData[];
  generatedImageUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  personaId: string;
  createdAt: Date;
  folderId?: string; // Links to a folder
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  isOpen?: boolean; // UI state for sidebar
}
