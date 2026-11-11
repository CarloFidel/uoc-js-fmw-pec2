import { Todo } from "../models/todo.model";
import { TodoView } from "../views/todo.views";
import { TodoService } from "../services/todo.service";

interface ControllerParams {
  service: TodoService;
  view: TodoView;
}



export class TodoController {
  service: TodoService;
  view: TodoView;

  constructor({ service, view }: ControllerParams) {
    this.service = service;
    this.view = view;

    // Explicit this binding
    this.service.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);

    // Display initial todos
    this.onTodoListChanged(this.service.todos);

  }

  onTodoListChanged = (todos: Todo[]) => {
    this.view.displayTodos(todos);
  };

  handleAddTodo = (todoText: string) => {
    this.service.addTodo(todoText);
  };

  handleEditTodo = (id: string, todoText: string) => {
    this.service.editTodo(id, todoText);
  };

  handleDeleteTodo = (id: string) => {
    this.service.deleteTodo(id);
  };

  handleToggleTodo = (id: string) => {
    this.service.toggleTodo(id);
  };


}