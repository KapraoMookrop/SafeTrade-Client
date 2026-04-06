import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BaseComponent } from '../../core/BaseComponent';
import { SocketService } from '../../API/SocketService';
import { ChatAppService } from '../../API/ChatAppService';
import { DealAppService } from '../../API/DealAppService';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatRoomData } from '../../types/ChatRoomData';
import { CommonModule } from '@angular/common';
import { CreateChatDialog } from '../../component/dialog/create-chat-dialog/create-chat-dialog';
import { CreateChatRoomRequest } from '../../types/CreateChatRoomRequest';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [FormsModule, CommonModule]
})
export class Chat extends BaseComponent implements OnInit {

  constructor(private SocketService: SocketService,
    private ChatAppService: ChatAppService,
    private DealAppService: DealAppService,) {
    super();
  }

  ChatRooms: ChatRoomData[] = [];
  ngOnInit() {
    this.LoadChatRooms();
  }

  async LoadChatRooms() {
    try {
      const result = await this.ChatAppService.GetAllChatRooms();
      this.ChatRooms = result;
      this.ChatService.setLastMessages(result);
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'เกิดข้อผิดพลาดในการโหลดห้องแชท');
    }
  }

  async OpenCreateChatDialog() {
    const dialogRef = this.DialogService.open(CreateChatDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('สร้างห้องแชทใหม่:', result);
        const rq: CreateChatRoomRequest = {
          CreatorId: this.AppStateService.userId() ?? "",
          InviteeId: result.userId,
        } as CreateChatRoomRequest;
        this.CreateChatRoom(rq);
      }
    });
  }

  async CreateChatRoom(rq: CreateChatRoomRequest) {
    try {
      await this.DealAppService.CreateChatRoom(rq);
      this.SwalSuccess('สำเร็จ', 'สร้างห้องแชทสำเร็จ');
      this.LoadChatRooms();
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อความ');
    }
  }
}