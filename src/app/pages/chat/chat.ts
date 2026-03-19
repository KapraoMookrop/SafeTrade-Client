import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BaseComponent } from '../../core/BaseComponent';
import { SocketService } from './SocketService';
import { ChatAppService } from '../../API/ChatAppService';
import { MessageRequestData } from '../../types/MessageRequestData';
import { MessageData } from '../../types/MessageData';
import { SendMessagesRequest } from '../../types/SendMessagesRequest';
import { MessageContentType } from '../../types/Enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [FormsModule]
})
export class Chat extends BaseComponent implements OnInit, OnDestroy {
  ChatRoomId = '';
  Messages: MessageData[] = [];
  NextCursor?: Date;
  HasMore: boolean = false;
  CurrentUserName: string = '';
  OtherUserName: string = '';
  newMessage = '';

  constructor(private SocketService: SocketService,
    private ChatService: ChatAppService,
    private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.Route.paramMap.subscribe(async params => {
      const id = params.get('chatRoomId');
      if (id) {
        this.ChatRoomId = id;
        this.SocketService.connect();
        this.SocketService.joinRoom(this.ChatRoomId);
        this.LoadMessages();

        this.SocketService.onNewMessage((msg) => {
          this.Messages.push(msg);
          this.RefreshDetectChanges();
        });
      }
    });
  }

  ngOnDestroy() {
    this.SocketService.disconnect();
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
    } catch (error) {
      this.SwalError('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อความได้');
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
    catch (error) {
      this.SwalError('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อความได้');
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
    } catch (error) {
      this.SwalError('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อความได้');
    }
  }
}