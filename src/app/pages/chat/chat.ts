import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BaseComponent } from '../../core/BaseComponent';
import { SocketService } from '../../API/SocketService';
import { ChatAppService } from '../../API/ChatAppService';
import { MessageRequestData } from '../../types/MessageRequestData';
import { MessageData } from '../../types/MessageData';
import { SendMessagesRequest } from '../../types/SendMessagesRequest';
import { MessageContentType } from '../../types/Enum';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatRoomData } from '../../types/ChatRoomData';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [FormsModule]
})
export class Chat extends BaseComponent implements OnInit {

  constructor(private SocketService: SocketService,
              private ChatService: ChatAppService) {
    super();
  }

  ChatRooms: ChatRoomData[] = [];
  ngOnInit() {
    this.LoadChatRooms();
  }

  async LoadChatRooms() {
    try {
      const result = await this.ChatService.GetAllChatRooms();
      this.ChatRooms = result;
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'เกิดข้อผิดพลาดในการโหลดห้องแชท');
    }
  }
}