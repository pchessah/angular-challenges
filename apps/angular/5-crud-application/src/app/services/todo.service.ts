import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';
import { LoadingService } from './loading.service';
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _loadingService = inject(LoadingService);

  private readonly _baseUrl: string =
    'https://jsonplaceholder.typicode.com/todos';
  private readonly _httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });

  updateTodo(todo: Todo): Observable<Todo> {
    return this._http.put<Todo>(
      `${this._baseUrl}/${todo.id}`,
      JSON.stringify(todo),
      {
        headers: this._httpHeaders,
      },
    );
  }

  deleteTodo(todo: Todo): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${todo.id}`);
  }

  todosHttpResource = httpResource<Todo[]>(
    () => ({
      url: this._baseUrl,
      method: 'GET',
      headers: this._httpHeaders,
      reportProgress: true,
      withCredentials: true,
      transferCache: true,
    }),
    { defaultValue: [] },
  );

  updateLocally(todo: Todo) {
    this.todosHttpResource.update((todos) =>
      todos.map((t) => (t.id === todo.id ? todo : t)),
    );
  }

  todosResourceError = computed(() => {
    const error = this.todosHttpResource.error() as Error;
    if (!error) {
      return null;
    }
    return error.message;
  });
}
