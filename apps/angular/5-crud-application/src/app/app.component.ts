import { Component, DestroyRef, inject, linkedSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { randText } from '@ngneat/falso';
import { Todo } from './interfaces/todo.interface';
import { TodoService } from './services/todo.service';

@Component({
  imports: [],
  selector: 'app-root',
  template: `
    <main class="container">
      @for (todo of todos(); track todo.id) {
        <div class="todo">
          <span>{{ todo.title }}</span>
          <button (click)="update(todo)">Update</button>
          <button (click)="delete(todo)">Delete</button>
        </div>
      }
    </main>
  `,
  styles: [
    `
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
    `,
  ],
})
export class AppComponent {
  private readonly _todoService = inject(TodoService);
  private readonly _destroyRef = inject(DestroyRef);

  todos = linkedSignal<Todo[]>(
    () => this._todoService.todosHttpResource.value() ?? [],
  );

  update(todo: Todo) {
    const todoUpdated: Todo = {
      ...todo,
      title: randText(),
      completed: !todo.completed,
    };
    this._todoService
      .updateTodo(todoUpdated)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((todoUpdated: Todo) => {
        this.todos.set(
          this.todos().map((todo) =>
            todo.id === todoUpdated.id ? todoUpdated : todo,
          ),
        );
      });
  }

  delete(todo: Todo) {
    this._todoService
      .deleteTodo(todo)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.todos.set(this.todos().filter((t) => t.id !== todo.id));
      });
  }
}
