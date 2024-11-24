import {
  Component,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../_services/message.service';
import { Message } from '../_ㅡmodles/message';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss',
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  // @ViewChild('scrollMe') scrollContainer?: any;
  private messageService = inject(MessageService);
  username = input.required<string>();
  messages: Message[] = [];
  messageContent = '';
  loading = false;
  updateMessages = output<Message>();

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessageThread(this.username()).subscribe({
      next: (messages) => (this.messages = messages),
    });
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .subscribe({
        next: (message) => {
          this.updateMessages.emit(message);
          this.messageForm?.reset();
        },
      });
  }

  // sendMessage() {
  //   this.loading = true;
  //   this.messageService
  //     .sendMessage(this.username(), this.messageContent)
  //     .then(() => {
  //       this.messageForm?.reset();
  //       this.scrollToBottom();
  //     })
  //     .finally(() => (this.loading = false));
  // }

  // ngAfterViewChecked(): void {
  //   this.scrollToBottom();
  // }

  // private scrollToBottom() {
  //   if (this.scrollContainer) {
  //     this.scrollContainer.nativeElement.scrollTop =
  //       this.scrollContainer.nativeElement.scrollHeight;
  //   }
  // }
}
