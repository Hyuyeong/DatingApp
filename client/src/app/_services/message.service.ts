import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_ㅡmodles/pagination';
import { Message } from '../_ㅡmodles/message';
import {
  setPaginatedResponse,
  setPaginationHeaders,
} from './paginationHelpers';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  // private busyService = inject(BusyService);
  // hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  // messageThread = signal<Message[]>([]);

  // createHubConnection(user: User, otherUsername: string) {
  //   this.busyService.busy();
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
  //       accessTokenFactory: () => user.token,
  //     })
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .catch((error) => console.log(error))
  //     .finally(() => this.busyService.idle());

  //   this.hubConnection.on('ReceiveMessageThread', (messages) => {
  //     this.messageThread.set(messages);
  //   });

  //   this.hubConnection.on('NewMessage', (message) => {
  //     this.messageThread.update((messages) => [...messages, message]);
  //   });

  //   this.hubConnection.on('UpdatedGroup', (group: Group) => {
  //     if (group.connections.some((x) => x.username === otherUsername)) {
  //       this.messageThread.update((messages) => {
  //         messages.forEach((message) => {
  //           if (!message.dateRead) {
  //             message.dateRead = new Date(Date.now());
  //           }
  //         });
  //         return messages;
  //       });
  //     }
  //   });
  // }

  // stopHubConnection() {
  //   if (this.hubConnection?.state === HubConnectionState.Connected) {
  //     this.hubConnection.stop().catch((error) => console.log(error));
  //   }
  // }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http
      .get<Message[]>(this.baseUrl + 'message', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'message/thread/' + username
    );
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'message', {
      recipientUsername: username,
      content,
    });
  }

  // async sendMessage(username: string, content: string) {
  //   return this.hubConnection?.invoke('SendMessage', {
  //     recipientUsername: username,
  //     content,
  //   });
  // }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}