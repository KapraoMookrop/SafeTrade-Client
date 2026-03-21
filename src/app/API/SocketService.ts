import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket!: Socket;

    connect() {
        if (this.socket && this.socket.connected) return;
        this.socket = io(environment.apiUrl.replace('/api', ''));
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