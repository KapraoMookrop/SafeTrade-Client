import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket!: Socket;

    connect() {
        this.socket = io(environment.apiUrl.replace('/api', ''));
    }

    joinRoom(roomId: string) {
        this.socket.emit('join-room', roomId);
    }

    onNewMessage(callback: (msg: any) => void) {
        this.socket.on('new-message', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}