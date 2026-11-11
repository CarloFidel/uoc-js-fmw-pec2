/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controllers/todo.controller.ts"
/*!********************************************!*\
  !*** ./src/controllers/todo.controller.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoController: () => (/* binding */ TodoController)
/* harmony export */ });
class TodoController {
    constructor({ service, view }) {
        this.onTodoListChanged = (todos) => {
            this.view.displayTodos(todos);
        };
        this.handleAddTodo = (todoText) => {
            this.service.addTodo(todoText);
        };
        this.handleEditTodo = (id, todoText) => {
            this.service.editTodo(id, todoText);
        };
        this.handleDeleteTodo = (id) => {
            this.service.deleteTodo(id);
        };
        this.handleToggleTodo = (id) => {
            this.service.toggleTodo(id);
        };
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
}


/***/ },

/***/ "./src/models/todo.model.ts"
/*!**********************************!*\
  !*** ./src/models/todo.model.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Todo: () => (/* binding */ Todo)
/* harmony export */ });
class Todo {
    constructor({ text, complete = false }) {
        this.id = this.uuidv4();
        this.text = text;
        this.complete = complete;
    }
    uuidv4() {
        return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, c => (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16));
    }
}


/***/ },

/***/ "./src/services/todo.service.ts"
/*!**************************************!*\
  !*** ./src/services/todo.service.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoService: () => (/* binding */ TodoService)
/* harmony export */ });
/* harmony import */ var _models_todo_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/todo.model */ "./src/models/todo.model.ts");

class TodoService {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem("todos") || "[]").map(todo => new _models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(todo));
        this.onTodoListChanged = () => { };
    }
    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }
    _commit(todos) {
        this.onTodoListChanged(todos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    addTodo(text) {
        this.todos.push(new _models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo({ text }));
        this._commit(this.todos);
    }
    editTodo(id, updatedText) {
        this.todos = this.todos.map((todo) => todo.id === id
            ? new _models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(Object.assign(Object.assign({}, todo), { text: updatedText }))
            : todo);
        this._commit(this.todos);
    }
    deleteTodo(_id) {
        this.todos = this.todos.filter(({ id }) => id !== _id);
        this._commit(this.todos);
    }
    toggleTodo(_id) {
        this.todos = this.todos.map(todo => todo.id === _id ? new _models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(Object.assign(Object.assign({}, todo), { complete: !todo.complete })) : todo);
        this._commit(this.todos);
    }
}


/***/ },

/***/ "./src/views/todo.views.ts"
/*!*********************************!*\
  !*** ./src/views/todo.views.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoView: () => (/* binding */ TodoView)
/* harmony export */ });
class TodoView {
    constructor() {
        this.app = this.getElement("#root");
        this.form = this.createElement("form");
        this.input = this.createElement("input");
        this.input.type = "text";
        this.input.placeholder = "Add todo";
        this.input.name = "todo";
        this.submitButton = this.createElement("button");
        this.submitButton.textContent = "Submit";
        this.form.append(this.input, this.submitButton);
        this.title = this.createElement("h1");
        this.title.textContent = "Todos";
        this.todoList = this.createElement("ul", "todo-list");
        this.app.append(this.title, this.form, this.todoList);
        this._temporaryTodoText = "";
        this._initLocalListeners();
    }
    get _todoText() {
        return this.input.value;
    }
    _resetInput() {
        this.input.value = "";
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className)
            element.classList.add(className);
        return element;
    }
    getElement(selector) {
        const element = document.querySelector(selector);
        return element;
    }
    displayTodos(todos) {
        // Delete all nodes
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild);
        }
        // Show default message
        if (todos.length === 0) {
            const p = this.createElement("p");
            p.textContent = "Nothing to do! Add a task?";
            this.todoList.append(p);
        }
        else {
            // Create nodes
            todos.forEach(todo => {
                const li = this.createElement("li");
                if (todo.id) {
                    li.id = todo.id;
                }
                const checkbox = this.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = todo.complete;
                const span = this.createElement("span");
                span.contentEditable = 'true';
                span.classList.add("editable");
                if (todo.complete) {
                    const strike = this.createElement("s");
                    strike.textContent = todo.text;
                    span.append(strike);
                }
                else {
                    span.textContent = todo.text;
                }
                const deleteButton = this.createElement("button", "delete");
                deleteButton.textContent = "Delete";
                li.append(checkbox, span, deleteButton);
                // Append nodes
                this.todoList.append(li);
            });
        }
    }
    _initLocalListeners() {
        this.todoList.addEventListener("input", event => {
            const target = event.target;
            if (target.className === "editable") {
                this._temporaryTodoText = target.innerText;
            }
        });
    }
    bindAddTodo(handler) {
        this.form.addEventListener("submit", event => {
            event.preventDefault();
            if (this._todoText) {
                handler(this._todoText);
                this._resetInput();
            }
        });
    }
    bindDeleteTodo(handler) {
        this.todoList.addEventListener("click", event => {
            var _a;
            const target = event.target;
            if (target.className === "delete") {
                const id = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.id;
                if (id) {
                    handler(id);
                }
            }
        });
    }
    bindEditTodo(handler) {
        this.todoList.addEventListener("focusout", event => {
            var _a;
            const target = event.target;
            if (this._temporaryTodoText) {
                const id = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.id;
                if (id) {
                    handler(id, this._temporaryTodoText);
                }
                this._temporaryTodoText = "";
            }
        });
    }
    bindToggleTodo(handler) {
        this.todoList.addEventListener("change", event => {
            var _a;
            const target = event.target;
            if (target.type === "checkbox") {
                const id = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.id;
                if (id) {
                    handler(id);
                }
            }
        });
    }
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controllers_todo_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers/todo.controller */ "./src/controllers/todo.controller.ts");
/* harmony import */ var _services_todo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/todo.service */ "./src/services/todo.service.ts");
/* harmony import */ var _views_todo_views__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/todo.views */ "./src/views/todo.views.ts");



const app = new _controllers_todo_controller__WEBPACK_IMPORTED_MODULE_0__.TodoController({ service: new _services_todo_service__WEBPACK_IMPORTED_MODULE_1__.TodoService(), view: new _views_todo_views__WEBPACK_IMPORTED_MODULE_2__.TodoView() });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBRWpDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFOztZQUMvQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBMEIsQ0FBQztZQUNoRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sRUFBRSxHQUFHLFlBQU0sQ0FBQyxhQUFhLDBDQUFFLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLEVBQUUsQ0FBQztvQkFDUCxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztZQUVILENBQUM7UUFFSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FJRjs7Ozs7OztVQ3JLRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDNUJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0EsRTs7O1VDUEEseUY7OztVQ0FBO1VBQ0E7VUFDQSxzREFBc0QsaUJBQWlCO1VBQ3ZFLGdEQUFnRCxhQUFhO1VBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNKK0Q7QUFDVDtBQUNSO0FBRTlDLE1BQU0sR0FBRyxHQUFHLElBQUksd0VBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLCtEQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx1REFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGVjMl9lajNfMS8uL3NyYy9jb250cm9sbGVycy90b2RvLmNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vcGVjMl9lajNfMS8uL3NyYy9tb2RlbHMvdG9kby5tb2RlbC50cyIsIndlYnBhY2s6Ly9wZWMyX2VqM18xLy4vc3JjL3NlcnZpY2VzL3RvZG8uc2VydmljZS50cyIsIndlYnBhY2s6Ly9wZWMyX2VqM18xLy4vc3JjL3ZpZXdzL3RvZG8udmlld3MudHMiLCJ3ZWJwYWNrOi8vcGVjMl9lajNfMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wZWMyX2VqM18xL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wZWMyX2VqM18xL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGVjMl9lajNfMS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BlYzJfZWozXzEvLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvZG8gfSBmcm9tIFwiLi4vbW9kZWxzL3RvZG8ubW9kZWxcIjtcbmltcG9ydCB7IFRvZG9WaWV3IH0gZnJvbSBcIi4uL3ZpZXdzL3RvZG8udmlld3NcIjtcbmltcG9ydCB7IFRvZG9TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3RvZG8uc2VydmljZVwiO1xuXG5pbnRlcmZhY2UgQ29udHJvbGxlclBhcmFtcyB7XG4gIHNlcnZpY2U6IFRvZG9TZXJ2aWNlO1xuICB2aWV3OiBUb2RvVmlldztcbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBUb2RvQ29udHJvbGxlciB7XG4gIHNlcnZpY2U6IFRvZG9TZXJ2aWNlO1xuICB2aWV3OiBUb2RvVmlldztcblxuICBjb25zdHJ1Y3Rvcih7IHNlcnZpY2UsIHZpZXcgfTogQ29udHJvbGxlclBhcmFtcykge1xuICAgIHRoaXMuc2VydmljZSA9IHNlcnZpY2U7XG4gICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgIC8vIEV4cGxpY2l0IHRoaXMgYmluZGluZ1xuICAgIHRoaXMuc2VydmljZS5iaW5kVG9kb0xpc3RDaGFuZ2VkKHRoaXMub25Ub2RvTGlzdENoYW5nZWQpO1xuICAgIHRoaXMudmlldy5iaW5kQWRkVG9kbyh0aGlzLmhhbmRsZUFkZFRvZG8pO1xuICAgIHRoaXMudmlldy5iaW5kRWRpdFRvZG8odGhpcy5oYW5kbGVFZGl0VG9kbyk7XG4gICAgdGhpcy52aWV3LmJpbmREZWxldGVUb2RvKHRoaXMuaGFuZGxlRGVsZXRlVG9kbyk7XG4gICAgdGhpcy52aWV3LmJpbmRUb2dnbGVUb2RvKHRoaXMuaGFuZGxlVG9nZ2xlVG9kbyk7XG5cbiAgICAvLyBEaXNwbGF5IGluaXRpYWwgdG9kb3NcbiAgICB0aGlzLm9uVG9kb0xpc3RDaGFuZ2VkKHRoaXMuc2VydmljZS50b2Rvcyk7XG5cbiAgfVxuXG4gIG9uVG9kb0xpc3RDaGFuZ2VkID0gKHRvZG9zOiBUb2RvW10pID0+IHtcbiAgICB0aGlzLnZpZXcuZGlzcGxheVRvZG9zKHRvZG9zKTtcbiAgfTtcblxuICBoYW5kbGVBZGRUb2RvID0gKHRvZG9UZXh0OiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLnNlcnZpY2UuYWRkVG9kbyh0b2RvVGV4dCk7XG4gIH07XG5cbiAgaGFuZGxlRWRpdFRvZG8gPSAoaWQ6IHN0cmluZywgdG9kb1RleHQ6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuc2VydmljZS5lZGl0VG9kbyhpZCwgdG9kb1RleHQpO1xuICB9O1xuXG4gIGhhbmRsZURlbGV0ZVRvZG8gPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuc2VydmljZS5kZWxldGVUb2RvKGlkKTtcbiAgfTtcblxuICBoYW5kbGVUb2dnbGVUb2RvID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLnNlcnZpY2UudG9nZ2xlVG9kbyhpZCk7XG4gIH07XG5cblxufSIsImludGVyZmFjZSBBdHRyaWJ1dGVzIHtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gICAgY29tcGxldGU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgVG9kbyB7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIGNvbXBsZXRlOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoeyB0ZXh0LCBjb21wbGV0ZSA9IGZhbHNlIH06IEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhpcy5pZCA9IHRoaXMudXVpZHY0KCk7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuY29tcGxldGUgPSBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICB1dWlkdjQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChTdHJpbmcoMWU3KSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS50b1N0cmluZygpLnJlcGxhY2UoL1swMThdL2csIGMgPT5cbiAgICAgICAgICAgIChOdW1iZXIoYykgXiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAoMTUgPj4gKE51bWJlcihjKSAvIDQpKSkpLnRvU3RyaW5nKDE2KVxuICAgICAgICApO1xuICAgIH1cblxufSIsImltcG9ydCB7IFRvZG8gfSBmcm9tIFwiLi4vbW9kZWxzL3RvZG8ubW9kZWxcIjtcblxuaW50ZXJmYWNlIENhbGxiYWNrIHtcbiAgICAodG9kb3M6IFRvZG9bXSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2RvU2VydmljZSB7XG4gICAgIHRvZG9zOiBUb2RvW107XG4gICAgIG9uVG9kb0xpc3RDaGFuZ2VkOiBDYWxsYmFjazsgICAgXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50b2RvcyA9IChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9kb3NcIikgfHwgXCJbXVwiKSBhcyBUb2RvW10pLm1hcChcbiAgICAgICAgICB0b2RvID0+IG5ldyBUb2RvKHRvZG8pXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub25Ub2RvTGlzdENoYW5nZWQgPSAoKSA9PiB7fTtcbiAgICAgIH1cbiAgICAgIGJpbmRUb2RvTGlzdENoYW5nZWQoY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMub25Ub2RvTGlzdENoYW5nZWQgPSBjYWxsYmFjaztcbiAgICAgIH1cbiAgICBcbiAgICAgIF9jb21taXQodG9kb3M6IFRvZG9bXSkge1xuICAgICAgICB0aGlzLm9uVG9kb0xpc3RDaGFuZ2VkKHRvZG9zKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2Rvc1wiLCBKU09OLnN0cmluZ2lmeSh0b2RvcykpO1xuICAgICAgfVxuICAgIFxuICAgICAgYWRkVG9kbyh0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKG5ldyBUb2RvKHsgdGV4dCB9KSk7XG4gICAgXG4gICAgICAgIHRoaXMuX2NvbW1pdCh0aGlzLnRvZG9zKTtcbiAgICAgIH1cblxuICAgICAgZWRpdFRvZG8oaWQ6IHN0cmluZywgdXBkYXRlZFRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnRvZG9zID0gdGhpcy50b2Rvcy5tYXAoKHRvZG86IFRvZG8pID0+XG4gICAgICAgICAgdG9kby5pZCA9PT0gaWRcbiAgICAgICAgICAgID8gbmV3IFRvZG8oe1xuICAgICAgICAgICAgICAgIC4uLnRvZG8sXG4gICAgICAgICAgICAgICAgdGV4dDogdXBkYXRlZFRleHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdG9kb1xuICAgICAgICApO1xuICAgIFxuICAgICAgICB0aGlzLl9jb21taXQodGhpcy50b2Rvcyk7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZVRvZG8oX2lkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50b2RvcyA9IHRoaXMudG9kb3MuZmlsdGVyKCh7IGlkIH0pID0+IGlkICE9PSBfaWQpO1xuICAgIFxuICAgICAgICB0aGlzLl9jb21taXQodGhpcy50b2Rvcyk7XG4gICAgICB9XG5cbiAgICAgIHRvZ2dsZVRvZG8oX2lkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50b2RvcyA9IHRoaXMudG9kb3MubWFwKHRvZG8gPT5cbiAgICAgICAgICB0b2RvLmlkID09PSBfaWQgPyBuZXcgVG9kbyh7IC4uLnRvZG8sIGNvbXBsZXRlOiAhdG9kby5jb21wbGV0ZSB9KSA6IHRvZG9cbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgdGhpcy5fY29tbWl0KHRoaXMudG9kb3MpO1xuICAgICAgfVxuICAgIFxuICAgIFxufSIsImltcG9ydCB7IFRvZG8gfSBmcm9tIFwiLi4vbW9kZWxzL3RvZG8ubW9kZWxcIlxuXG50eXBlIGJpbmdIYW5kbGVyID0gKGhhbmRsZXJJdGVtOiBzdHJpbmcpID0+IHZvaWRcbnR5cGUgZWRpdEhhbmRsZXIgPSAoaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSA9PiB2b2lkXG5cbmV4cG9ydCBjbGFzcyBUb2RvVmlldyB7XG4gIGFwcDogSFRNTEVsZW1lbnQ7XG4gIGZvcm06IEhUTUxGb3JtRWxlbWVudDtcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHN1Ym1pdEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIHRpdGxlOiBIVE1MSGVhZGluZ0VsZW1lbnQ7XG4gIHRvZG9MaXN0OiBIVE1MVUxpc3RFbGVtZW50O1xuICBfdGVtcG9yYXJ5VG9kb1RleHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgKSB7XG4gICAgdGhpcy5hcHAgPSB0aGlzLmdldEVsZW1lbnQoXCIjcm9vdFwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICB0aGlzLmZvcm0gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gdGhpcy5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICB0aGlzLmlucHV0LnR5cGUgPSBcInRleHRcIjtcbiAgICB0aGlzLmlucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgdG9kb1wiO1xuICAgIHRoaXMuaW5wdXQubmFtZSA9IFwidG9kb1wiO1xuICAgIHRoaXMuc3VibWl0QnV0dG9uID0gdGhpcy5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdWJtaXRcIjtcbiAgICB0aGlzLmZvcm0uYXBwZW5kKHRoaXMuaW5wdXQsIHRoaXMuc3VibWl0QnV0dG9uKTtcbiAgICB0aGlzLnRpdGxlID0gdGhpcy5jcmVhdGVFbGVtZW50KFwiaDFcIikgYXMgSFRNTEhlYWRpbmdFbGVtZW50O1xuICAgIHRoaXMudGl0bGUudGV4dENvbnRlbnQgPSBcIlRvZG9zXCI7XG4gICAgdGhpcy50b2RvTGlzdCA9IHRoaXMuY3JlYXRlRWxlbWVudChcInVsXCIsIFwidG9kby1saXN0XCIpIGFzIEhUTUxVTGlzdEVsZW1lbnQ7XG4gICAgdGhpcy5hcHAuYXBwZW5kKHRoaXMudGl0bGUsIHRoaXMuZm9ybSwgdGhpcy50b2RvTGlzdCk7XG5cbiAgICB0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCA9IFwiXCI7XG4gICAgdGhpcy5faW5pdExvY2FsTGlzdGVuZXJzKCk7XG5cbiAgfVxuXG4gIGdldCBfdG9kb1RleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQudmFsdWU7XG4gIH1cblxuICBfcmVzZXRJbnB1dCgpIHtcbiAgICB0aGlzLmlucHV0LnZhbHVlID0gXCJcIjtcbiAgfVxuXG4gIGNyZWF0ZUVsZW1lbnQodGFnOiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgICBpZiAoY2xhc3NOYW1lKSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0RWxlbWVudChzZWxlY3Rvcjogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBkaXNwbGF5VG9kb3ModG9kb3M6IFRvZG9bXSkge1xuICAgIC8vIERlbGV0ZSBhbGwgbm9kZXNcbiAgICB3aGlsZSAodGhpcy50b2RvTGlzdC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLnRvZG9MaXN0LnJlbW92ZUNoaWxkKHRoaXMudG9kb0xpc3QuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gU2hvdyBkZWZhdWx0IG1lc3NhZ2VcbiAgICBpZiAodG9kb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBwID0gdGhpcy5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgIHAudGV4dENvbnRlbnQgPSBcIk5vdGhpbmcgdG8gZG8hIEFkZCBhIHRhc2s/XCI7XG4gICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZChwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ3JlYXRlIG5vZGVzXG4gICAgICB0b2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICBjb25zdCBsaSA9IHRoaXMuY3JlYXRlRWxlbWVudChcImxpXCIpIGFzIEhUTUxMSUVsZW1lbnQ7XG4gICAgICAgIGlmICh0b2RvLmlkKSB7XG4gICAgICAgICAgbGkuaWQgPSB0b2RvLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBjaGVja2JveC50eXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICBjaGVja2JveC5jaGVja2VkID0gdG9kby5jb21wbGV0ZTtcblxuICAgICAgICBjb25zdCBzcGFuID0gdGhpcy5jcmVhdGVFbGVtZW50KFwic3BhblwiKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgICAgIHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xuICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoXCJlZGl0YWJsZVwiKTtcblxuICAgICAgICBpZiAodG9kby5jb21wbGV0ZSkge1xuICAgICAgICAgIGNvbnN0IHN0cmlrZSA9IHRoaXMuY3JlYXRlRWxlbWVudChcInNcIik7XG4gICAgICAgICAgc3RyaWtlLnRleHRDb250ZW50ID0gdG9kby50ZXh0O1xuICAgICAgICAgIHNwYW4uYXBwZW5kKHN0cmlrZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHRvZG8udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IHRoaXMuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCBcImRlbGV0ZVwiKTtcbiAgICAgICAgZGVsZXRlQnV0dG9uLnRleHRDb250ZW50ID0gXCJEZWxldGVcIjtcbiAgICAgICAgbGkuYXBwZW5kKGNoZWNrYm94LCBzcGFuLCBkZWxldGVCdXR0b24pO1xuXG4gICAgICAgIC8vIEFwcGVuZCBub2Rlc1xuICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZChsaSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIF9pbml0TG9jYWxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy50b2RvTGlzdC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT09IFwiZWRpdGFibGVcIikge1xuICAgICAgICB0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCA9IHRhcmdldC5pbm5lclRleHQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBiaW5kQWRkVG9kbyhoYW5kbGVyOiBiaW5nSGFuZGxlcikge1xuICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmICh0aGlzLl90b2RvVGV4dCkge1xuICAgICAgICBoYW5kbGVyKHRoaXMuX3RvZG9UZXh0KTtcbiAgICAgICAgdGhpcy5fcmVzZXRJbnB1dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYmluZERlbGV0ZVRvZG8oaGFuZGxlcjogYmluZ0hhbmRsZXIpIHtcbiAgICB0aGlzLnRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJkZWxldGVcIikge1xuICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5wYXJlbnRFbGVtZW50Py5pZDtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgaGFuZGxlcihpZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJpbmRFZGl0VG9kbyhoYW5kbGVyOiBlZGl0SGFuZGxlcikge1xuICAgIHRoaXMudG9kb0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGlmICh0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCkge1xuICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5wYXJlbnRFbGVtZW50Py5pZDtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgaGFuZGxlcihpZCwgdGhpcy5fdGVtcG9yYXJ5VG9kb1RleHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RlbXBvcmFyeVRvZG9UZXh0ID0gXCJcIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJpbmRUb2dnbGVUb2RvKGhhbmRsZXI6IGJpbmdIYW5kbGVyKSB7XG5cbiAgICB0aGlzLnRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBpZiAodGFyZ2V0LnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5wYXJlbnRFbGVtZW50Py5pZDtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgaGFuZGxlcihpZCk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuXG5cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIvdmFsdWUgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSk7IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRvZG9Db250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvdG9kby5jb250cm9sbGVyXCI7XG5pbXBvcnQgeyBUb2RvU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL3RvZG8uc2VydmljZVwiO1xuaW1wb3J0IHsgVG9kb1ZpZXcgfSBmcm9tIFwiLi92aWV3cy90b2RvLnZpZXdzXCI7XG5cbmNvbnN0IGFwcCA9IG5ldyBUb2RvQ29udHJvbGxlcih7IHNlcnZpY2U6IG5ldyBUb2RvU2VydmljZSgpLCB2aWV3OiBuZXcgVG9kb1ZpZXcoKSB9KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==