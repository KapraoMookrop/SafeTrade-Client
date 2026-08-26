import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";
import { UserClientData } from "../types/UserClientData";
import { ChatRoomData } from "../types/ChatRoomData";

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(private readonly state: AppStateService) { }

  updateLastMessages(rq: ChatRoomData) {
    this.state.allChatRooms.update(rooms => rooms.map(room => {
      if (room.ChatRoomId === rq.ChatRoomId) {
        return {
          ...room,
          LastMessage: rq.LastMessage,
          LastMessageAt: rq.LastMessageAt,
          CountUnread: (room.CountUnread ?? 0) + 1,
          UserName: rq.UserName,
          UserAvatarUrl: rq.UserAvatarUrl
        };
      }
      return room;
    }));
  }

  setLastMessages(chatRooms: ChatRoomData[]) {
    this.state.allChatRooms.set(chatRooms);
  }
}