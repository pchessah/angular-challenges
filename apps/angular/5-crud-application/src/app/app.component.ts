import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from './interfaces/todo.interface';
import { TodoService } from './services/todo.service';

@Component({
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <div *ngFor="let todo of todos">
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  private readonly _todoService: TodoService = inject(TodoService);
  todos!: Todo[];

  ngOnInit(): void {
    this._todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  update(todo: Todo) {
    const todoUpdated: Todo = {
      ...todo,
      title: randText(),
      completed: !todo.completed,
    };
    this._todoService.updateTodo(todoUpdated).subscribe((todoUpdated: Todo) => {
      this.todos[todoUpdated.id - 1] = todoUpdated;
    });
  }
}
