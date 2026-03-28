import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserClientData } from '../../types/UserClientData';
import { BaseComponent } from '../../core/BaseComponent';
import { NotificationData } from '../../types/NotificationData';
import { CoreAppService } from '../../API/CoreAppService';
import { NotificationType } from '../../types/Enum';
import { DealAppService } from '../../API/DealAppService';
import { HttpErrorResponse } from '@angular/common/http';
import { Chat } from '../../pages/chat/chat';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [Chat],
  templateUrl: './navber.html',
})
export class Navbar extends BaseComponent implements OnInit {
  User: UserClientData = {} as UserClientData;
  Notifications: NotificationData[] = [];
  IsOpenNotification: boolean = false;

  constructor(private CoreAppService: CoreAppService, private DealAppService: DealAppService, private ChatComponent: Chat) {
    super();
  }

  ngOnInit() {
    this.LoadNotifications();
  }

  getLogoUser() {
    return this.AppStateService.user()?.FullName.replaceAll("นาย", "").replaceAll("นางสาว", "").replaceAll("นาง", "").charAt(0) || "";
  }

  get countNotReadNotification() {
    return this.Notifications.filter(n => !n.IsRead).length;
  }

  get unreadCount() {
    return this.AppStateService.allChatRooms().reduce((sum, room) => sum + (room.CountUnread ?? 0), 0);
  }

  async LoadNotifications() {
    try {
      const result = await this.CoreAppService.GetNotifications();
      this.Notifications = result;
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'ไม่สามารถโหลดการแจ้งเตือนได้ในขณะนี้');
    }
  }

  getTitleNotification(notification: NotificationType) {
    switch (notification) {
      case NotificationType.CHAT_INVITE:
        return "คำเชิญเข้าร่วมแชท";
      case NotificationType.DEAL_UPDATE:
        return "อัปเดต Deal";
      case NotificationType.SYSTEM_ALERT:
        return "แจ้งเตือนระบบ";
      default:
        return "แจ้งเตือน";
    }
  }

  async MarkAllAsRead() {
    try {
      await this.CoreAppService.MarkAllNotificationsAsRead();
      this.Notifications.forEach(n => n.IsRead = true);
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'ไม่สามารถทำเครื่องหมายว่าอ่านแล้วทั้งหมดได้ในขณะนี้');
    }
  }

  async AcceptInvite(notification: NotificationData) {
    try {
      await this.DealAppService.AcceptInvite(notification.RelatedId);
      await this.SwalSuccess('สำเร็จ', 'คุณได้เข้าร่วมแชทแล้ว');
      this.ChatComponent.LoadChatRooms();
      this.LoadNotifications();
      this.RefreshDetectChanges();
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message || 'เกิดข้อผิดพลาดในการเข้าร่วมแชท');
    }
  }

  async RejectInvite(notification: NotificationData) {
    try {
      await this.DealAppService.RejectInvite(notification.RelatedId);
      await this.SwalSuccess('สำเร็จ', 'คุณได้ปฏิเสธคำเชิญเข้าร่วมแชทแล้ว');
      this.LoadNotifications();
      this.RefreshDetectChanges();
    } catch (err: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'ไม่สามารถปฏิเสธคำเชิญเข้าร่วมแชทได้ในขณะนี้');
    }
  }
}
