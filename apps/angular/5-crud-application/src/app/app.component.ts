import { Component, DestroyRef, inject, linkedSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { randText } from '@ngneat/falso';
import { Todo } from './interfaces/todo.interface';
import { LoadingService } from './services/loading.service';
import { TodoService } from './services/todo.service';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    <main class="container">
      @if (isLoading()) {
        <div class="loading">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      }
      @for (todo of todos(); track todo.id) {
        <div class="todo">
          <span>{{ todo.title }}</span>
          <div class="todo-actions">
            <button (click)="update(todo)">Update</button>
            <button (click)="delete(todo)">Delete</button>
          </div>
        </div>
      }
    </main>
  `,
  styles: [
    `
      .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        display: flex;
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        max-width: 75vw;
        margin: 0 auto;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
      }
      .todo {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .todo-actions {
        display: flex;
        gap: 1rem;
      }
    `,
  ],
})
export class AppComponent {
  private readonly _todoService = inject(TodoService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _loadingService = inject(LoadingService);

  isLoading = linkedSignal(
    () =>
      this._loadingService.isLoading() ||
      this._todoService.todosHttpResource.isLoading(),
  );

  todos = linkedSignal<Todo[]>(
    () => this._todoService.todosHttpResource.value() ?? [],
  );

  update(todo: Todo) {
    this._loadingService.startLoading();
    const todoUpdated: Todo = {
      ...todo,
      title: randText(),
      completed: !todo.completed,
    };
    this._todoService
      .updateTodo(todoUpdated)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((todoUpdated: Todo) => {
        this._todoService.updateLocally(todoUpdated);
        this._loadingService.stopLoading();
      });
  }

  delete(todo: Todo) {
    this._loadingService.startLoading();
    this._todoService
      .deleteTodo(todo)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.todos.set(this.todos().filter((t) => t.id !== todo.id));
        this._loadingService.stopLoading();
      });
  }
}
