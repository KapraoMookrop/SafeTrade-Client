import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { MessageData } from '../types/MessageData';
import { ChatRoomData } from '../types/ChatRoomData';
import { ChatService } from '../core/ChatService';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket!: Socket;
    constructor(private ChatService: ChatService) { }

    connect() {
        if (this.socket && this.socket.connected) return;

        this.socket = io(environment.socketUrl);

        this.socket.on('connect', () => {
            console.log('Socket Connected:', this.socket.id);
        });

        this.socket.on('new-message-notify', (data: MessageData) => {
            const lastMessage : ChatRoomData = {
                ChatRoomId: data.ChatRoomId,
                LastMessage: data.Content,
                LastMessageAt: data.CreatedAt,
                CountUnread: 1,
                UserName: data.SenderName,
                UserAvatarUrl: ''
            }
            
            this.ChatService.updateLastMessages(lastMessage);
            console.log('New message notification received:', data);
        });
    }

    joinUser(userId: string) {
        if (this.socket) {
            this.socket.emit("join-user", userId);
        }
    }

    joinRoom(roomId: string) {
        this.socket.emit('join-room', roomId);
    }

    leaveRoom(roomId: string) {
        this.socket.emit('leave-room', roomId);
    }

    onNewMessage(callback: (msg: any) => void) {
        this.socket.on('new-message', callback);
    }

    offNewMessage() {
        this.socket.off('new-message');
    }

    isConnected(): boolean {
        return this.socket && this.socket.connected;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    
}