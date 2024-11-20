import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_ㅡmodles/member';
import {
  setPaginatedResponse,
  setPaginationHeaders,
} from './paginationHelpers';
import { PaginatedResult } from '../_ㅡmodles/pagination';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  // paginatedResult() {
  //   throw new Error('Method not implemented.');
  // }
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.http
      .get<Member[]>(`${this.baseUrl}likes`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });

    // return this.http.get<Member[]>(
    //   `${this.baseUrl}likes?predicate=${predicate}`
    // );
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: (ids) => this.likeIds.set(ids),
    });
  }
}
