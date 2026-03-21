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

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.html',
  imports: [FormsModule]
})
export class ChatRoom extends BaseComponent implements OnInit, OnDestroy {
  ChatRoomId = '';
  Messages: MessageData[] = [];
  NextCursor?: Date;
  HasMore: boolean = false;
  CurrentUserName: string = '';
  OtherUserName: string = '';
  newMessage = '';

  constructor(private SocketService: SocketService,
    private ChatService: ChatAppService) {
    super();
  }

  ngOnInit() {
    this.Route.paramMap.subscribe(async params => {
      const id = params.get('chatRoomId');
      if (id) {
        this.ChatRoomId = id;
        if (!this.SocketService.isConnected()) {
          this.SocketService.connect();
        }

        this.SocketService.leaveRoom(this.ChatRoomId);
        this.SocketService.joinRoom(this.ChatRoomId);
        this.LoadMessages();

        this.SocketService.offNewMessage();
        this.SocketService.onNewMessage((msg) => {
          this.Messages.push(msg);
          this.RefreshDetectChanges();
        });
      }
    });
  }

  ngOnDestroy() {
    this.SocketService.leaveRoom(this.ChatRoomId);
  }

  async LoadMessages() {
    const request: MessageRequestData = { ChatRoomId: this.ChatRoomId }
    try {
      const result = await this.ChatService.GetMessages(request);
      this.Messages = result.Messages;
      this.NextCursor = result.NextCursor;
      this.HasMore = result.HasMore;
      this.CurrentUserName = result.CurrentUserName;
      this.OtherUserName = result.OtherUserName;
      this.RefreshDetectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อความ');
    }
  }

  async LoadMore() {
    if (!this.NextCursor) return;
    const request: MessageRequestData = { ChatRoomId: this.ChatRoomId, Cursor: this.NextCursor }
    try {
      const result = await this.ChatService.GetMessages(request);
      this.Messages = [...result.Messages, ...this.Messages];
      this.NextCursor = result.NextCursor;
      this.HasMore = result.HasMore;
      this.RefreshDetectChanges();
    }
    catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อความ');
    }
  }

  async SendMessage() {
    if (!this.newMessage.trim()) return;
    const request: SendMessagesRequest = {
      ChatRoomId: this.ChatRoomId,
      Content: this.newMessage,
      ContentType: MessageContentType.TEXT,
      SenderId: this.AppStateService.userId() ?? "",
    }
    try {
      await this.ChatService.SendMessage(request);
      this.newMessage = '';
      this.RefreshDetectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการส่งข้อความ');
    }
  }
}