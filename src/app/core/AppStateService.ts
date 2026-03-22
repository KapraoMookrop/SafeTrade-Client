import { Injectable, signal, computed } from '@angular/core';
import { UserClientData } from '../types/UserClientData';
import { ChatRoomData } from '../types/ChatRoomData';

export interface User {
  id: string;
  username: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AppStateService {

  // ===== GLOBAL STATE =====
  user = signal<UserClientData | null>(null);
  userId = signal<string | null>(null);
  token = signal<string | null>(null);
  isLoading = signal(false);
  walletBalance = signal<number>(0);
  allChatRooms = signal<ChatRoomData[]>([]);

  // ===== COMPUTED =====
  isLoggedIn = computed(() => !!this.user());
}