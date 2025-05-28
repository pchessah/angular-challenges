import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly _http: HttpClient = inject(HttpClient);

  private readonly _baseUrl: string =
    'https://jsonplaceholder.typicode.com/todos';
  private readonly _httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });

  getTodos(): Observable<Todo[]> {
    return this._http.get<Todo[]>(this._baseUrl);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this._http.put<Todo>(
      `${this._baseUrl}/${todo.id}`,
      JSON.stringify(todo),
      {
        headers: this._httpHeaders,
      },
    );
  }

  todosHttpResource = httpResource<Todo[]>(this._baseUrl, { defaultValue: [] });
}
