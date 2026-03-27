import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BaseComponent } from '../../core/BaseComponent';
import { SocketService } from '../../API/SocketService';
import { ChatAppService } from '../../API/ChatAppService';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatRoomData } from '../../types/ChatRoomData';
import { CommonModule } from '@angular/common';
import { CreateDealDialog } from '../../component/dialog/deal/create-deal-dialog/create-deal-dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [FormsModule, CommonModule]
})
export class Chat extends BaseComponent implements OnInit {

  constructor(private SocketService: SocketService,
    private ChatAppService: ChatAppService) {
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

  async OpenCreateDealDialog() {
    const dialogRef = this.DialogService.open(CreateDealDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('สร้างดีลใหม่:', result);
      }
    });
  }
}