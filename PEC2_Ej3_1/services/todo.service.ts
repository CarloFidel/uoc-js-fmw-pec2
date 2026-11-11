import { Todo } from "../models/todo.model";

interface Callback {
    (todos: Todo[]): void;
}

export class TodoService {
     todos: Todo[];
     onTodoListChanged: Callback;    

    constructor() {
        this.todos = (JSON.parse(localStorage.getItem("todos") || "[]") as Todo[]).map(
          todo => new Todo(todo)
        );
        this.onTodoListChanged = () => {};
      }
      bindTodoListChanged(callback: Callback) {
        this.onTodoListChanged = callback;
      }
    
      _commit(todos: Todo[]) {
        this.onTodoListChanged(todos);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    
      addTodo(text: string) {
        this.todos.push(new Todo({ text }));
    
        this._commit(this.todos);
      }

      editTodo(id: string, updatedText: string) {
        this.todos = this.todos.map((todo: Todo) =>
          todo.id === id
            ? new Todo({
                ...todo,
                text: updatedText
              })
            : todo
        );
    
        this._commit(this.todos);
      }

      deleteTodo(_id: string) {
        this.todos = this.todos.filter(({ id }) => id !== _id);
    
        this._commit(this.todos);
      }

      toggleTodo(_id: string) {
        this.todos = this.todos.map(todo =>
          todo.id === _id ? new Todo({ ...todo, complete: !todo.complete }) : todo
        );
    
        this._commit(this.todos);
      }
    
    
}