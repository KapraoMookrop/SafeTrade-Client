import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../core/BaseComponent';
import { SocketService } from '../../API/SocketService';
import { ChatAppService } from '../../API/ChatAppService';
import { DealAppService } from '../../API/DealAppService';
import { MessageRequestData } from '../../types/MessageRequestData';
import { MessageData } from '../../types/MessageData';
import { SendMessagesRequest } from '../../types/SendMessagesRequest';
import { MessageContentType, UserRole } from '../../types/Enum';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReadMessagesRequest } from '../../types/ReadMessagesRequest';
import { CommonModule } from '@angular/common';
import { CreateDealDialog } from '../../component/dialog/create-deal-dialog/create-deal-dialog';
import { CreateDealRequest } from '../../types/CreateDealRequest';
import { ActiveDealData } from '../../types/MessageDataList';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.html',
  imports: [FormsModule, CommonModule]
})
export class ChatRoom extends BaseComponent implements OnInit, OnDestroy {
  ChatRoomId = '';
  Messages: MessageData[] = [];
  NextCursor?: Date;
  HasMore: boolean = false;
  CurrentUserName: string = '';
  OtherUserName: string = '';
  OtherUserId = '';
  newMessage = '';
  UserRole = UserRole;
  ActiveDeal: ActiveDealData | null = null;

  constructor(private SocketService: SocketService,
    private ChatAppService: ChatAppService,
    private DealAppService: DealAppService) {
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
          if (msg.SenderId == this.AppStateService.userId()) {
            this.IsSended = true;
            return;
          }

          this.Messages.push(msg);
          this.MarkAsRead();
          this.RefreshDetectChanges();
          setTimeout(() => {
            this.scrollToBottom();
          });
        });

        this.MarkAsRead();
      }
    });
  }

  ngOnDestroy() {
    this.SocketService.leaveRoom(this.ChatRoomId);
  }

  scrollToBottom() {
    const chat = document.getElementById("chat-box");
    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  }

  async LoadMessages() {
    const request: MessageRequestData = { ChatRoomId: this.ChatRoomId }
    try {
      const result = await this.ChatAppService.GetMessages(request);
      this.Messages = result.Messages;
      this.NextCursor = result.NextCursor;
      this.HasMore = result.HasMore;
      this.CurrentUserName = result.CurrentUserName;
      this.OtherUserName = result.OtherUserName;
      this.OtherUserId = result.OtherUserId || '';
      this.ActiveDeal = result.ActiveDeal || null;
      this.RefreshDetectChanges();
      setTimeout(() => {
        this.scrollToBottom();
      });
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อความ');
    }
  }

  async LoadMore() {
    const chat = document.getElementById("chat-box") as HTMLDivElement;
    const prevHeight = chat.scrollHeight;
    if (!this.NextCursor && !chat) return;

    const request: MessageRequestData = { ChatRoomId: this.ChatRoomId, Cursor: this.NextCursor }
    try {
      const result = await this.ChatAppService.GetMessages(request);
      this.Messages = [...result.Messages, ...this.Messages];
      this.NextCursor = result.NextCursor;
      this.HasMore = result.HasMore;
      this.RefreshDetectChanges();
      setTimeout(() => {
        const newHeight = chat.scrollHeight;
        chat.scrollTop = newHeight - prevHeight;
      });
    }
    catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อความ');
    }
  }

  IsSended = true;
  async SendMessage() {
    if (!this.newMessage.trim()) return;
    this.IsSended = false;
    const request: SendMessagesRequest = {
      ChatRoomId: this.ChatRoomId,
      Content: this.newMessage,
      ContentType: MessageContentType.TEXT,
      SenderId: this.AppStateService.userId() ?? "",
      SenderName: this.AppStateService.user()?.FullName ?? "Unknown"
    }
    
    this.Messages.push({
      SenderId: request.SenderId,
      SenderName: request.SenderName,
      Content: request.Content, ContentType:
        request.ContentType,
      CreatedAt: new Date(),
      ChatRoomId: request.ChatRoomId
    } as MessageData);
    setTimeout(() => {
      this.scrollToBottom();
    });
    this.newMessage = '';
    try {
      await this.ChatAppService.SendMessage(request);
      this.RefreshDetectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการส่งข้อความ');
    }
  }

  async MarkAsRead() {
    try {
      const request: ReadMessagesRequest = {
        ChatRoomId: this.ChatRoomId,
        UserId: this.AppStateService.userId() ?? "",
      }
      await this.ChatAppService.MarkAsRead(request);
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการทำเครื่องหมายข้อความว่าอ่านแล้ว');
    }
  }

  OpenCreateDealDialog() {
    const dialogRef = this.DialogService.open(CreateDealDialog, {
      data: {
        chatRoomId: this.ChatRoomId,
        buyerId: this.OtherUserId,
        sellerId: this.AppStateService.userId()
      }
    });

    dialogRef.afterClosed().subscribe(async (result: CreateDealRequest | undefined) => {
      if (result) {
        try {
          this.ShowLoading();
          await this.DealAppService.CreateDeal(result);
          this.HideLoading();
          this.SwalSuccess('สำเร็จ', 'สร้างดีลสำเร็จ');
          this.LoadMessages();
        } catch (error: any) {
          this.HideLoading();
          this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'ไม่สามารถสร้างดีลได้');
        }
      }
    });
  }

  async UploadSlip(event: any) {
    const file = event.target.files?.[0];
    if (!file || !this.ActiveDeal) return;

    try {
      this.ShowLoading();
      await this.DealAppService.UploadPaymentSlip(this.ActiveDeal.Id, file);
      this.HideLoading();
      this.SwalSuccess('สำเร็จ', 'อัปโหลดหลักฐานการโอนเงินสำเร็จ');
      this.LoadMessages();
    } catch (err: any) {
      this.HideLoading();
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'ไม่สามารถอัปโหลดหลักฐานได้');
    }
  }
}