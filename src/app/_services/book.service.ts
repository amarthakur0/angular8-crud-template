import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Book } from '../_models';

const apiUrl = `${environment.apiUrl}/book`;

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) { }

  getBooksForListing(paramsObj: any) {
    const { fromDate, toDate, isbnNumber, bookName, pageNum, perPage } = paramsObj;
    return this.http.get(`${apiUrl}/listing`, {
        params: {
          fromDate, toDate, pageNum, perPage, isbnNumber, bookName
        }
      })
      .pipe(map((response: any) => {
        return response.data;
      }));
  }

  getBookDetails(bookId: number): Observable<Book> {
    return this.http.get(`${apiUrl}/get/${bookId}`)
      .pipe(map((response: any) => {
        return response.data.book[0];
      }));
  }

  create(book: Book) {
    return this.http.post(`${apiUrl}/create`, book);
  }

  update(book: Book) {
    return this.http.post(`${apiUrl}/update`, book);
  }

  delete(bookId: number) {
    return this.http.post(`${apiUrl}/delete`, { bookId });
  }
}
