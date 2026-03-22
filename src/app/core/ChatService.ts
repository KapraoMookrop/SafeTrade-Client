import { Injectable } from "@angular/core";
import { AppStateService } from "./AppStateService";
import { UserClientData } from "../types/UserClientData";
import { ChatRoomData } from "../types/ChatRoomData";

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(private readonly state: AppStateService) { }

  updateLastMessages(rq: ChatRoomData, IspushNewMessage: boolean = false) {
    const currentRooms = this.state.allChatRooms().find(r => r.ChatRoomId == rq.ChatRoomId);
    if (currentRooms) {
      currentRooms.LastMessage = rq.LastMessage;
      currentRooms.LastMessageAt = rq.LastMessageAt;
      if (IspushNewMessage){
        currentRooms.CountUnread = currentRooms.CountUnread + 1;
      }else{
        currentRooms.CountUnread = rq.CountUnread;
      }
      this.state.allChatRooms.set([...this.state.allChatRooms()]);
    }
  }
}