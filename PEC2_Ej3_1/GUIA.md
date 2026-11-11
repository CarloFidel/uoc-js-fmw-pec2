# Ejercicio 3 — Todo MVC con TypeScript y Webpack

Guía para hacerlo tú. El objetivo es pasar la app de tareas (ahora JavaScript global) a módulos TypeScript y empaquetarla con Webpack.

La app sigue siendo la misma: añadir, editar, borrar y marcar tareas. Los datos se guardan en `localStorage`.

## Qué hay ahora

`index.html` carga cinco scripts sueltos, en este orden:

1. `models/todo.model.js` — la clase `Todo`
2. `services/todo.service.js` — lista, altas, bajas y `localStorage`
3. `controllers/todo.controller.js` — une servicio y vista
4. `views/todo.views.js` — pinta el HTML
5. `app.js` — arranca todo

Cada archivo declara una clase en el ámbito global. Por eso no hay `import` ni `export`.

Webpack no puede usar eso. Tiene que haber **un punto de entrada** que importe el resto.

## A qué tienes que llegar

```text
PEC2_Ej3/
  src/
    models/todo.model.ts
    services/todo.service.ts
    controllers/todo.controller.ts
    views/todo.views.ts
    app.ts
  dist/
    bundle.js          ← lo genera Webpack
  index.html           ← un solo <script>
  style.css
  package.json
  tsconfig.json
  webpack.config.js
```

`webpack.config.eje3-base.example` ya dice cuál es la entrada: `./src/app.ts`, y la salida: `dist/bundle.js`.

`webpack.config.eje3.example.js` es una config de otra práctica (alias, Babel, HtmlWebpackPlugin). No la copies. Quédate con la base.

Los `.js` originales puedes dejarlos hasta que la versión TypeScript funcione. Cuando cambies `index.html`, el navegador ya no los carga.

## Orden de trabajo

- [ ] 1. Inicializar npm e instalar herramientas
- [ ] 2. Crear `tsconfig.json`
- [ ] 3. Crear `webpack.config.js`
- [ ] 4. Pasar el modelo a TypeScript
- [ ] 5. Pasar el servicio
- [ ] 6. Pasar la vista
- [ ] 7. Pasar el controlador
- [ ] 8. Crear `src/app.ts`
- [ ] 9. Dejar `index.html` con un solo script
- [ ] 10. Compilar, abrir la app y probar las cuatro acciones

Haz los pasos en ese orden. Si saltas a la vista sin tener el modelo exportado, los errores de compilación se mezclan.

---

## 1. Herramientas

Desde la carpeta `PEC2_Ej3`:

```bash
npm init -y
npm install --save-dev typescript webpack webpack-cli ts-loader
```

En `package.json`, añade los scripts:

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "build": "webpack",
  "watch": "webpack --watch"
}
```

- `typecheck` solo comprueba tipos. No genera JavaScript.
- `build` y `watch` los usa Webpack, que es quien escribe `dist/bundle.js`.

## 2. `tsconfig.json`

Créalo en `PEC2_Ej3/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es6",
    "moduleResolution": "node",
    "lib": ["es2015", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "noEmit": true,
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

`lib` tiene que incluir `"dom"`. Si no, `document` y `localStorage` no existen para el compilador.

`noEmit: true` evita que `tsc` y Webpack escriban los dos en `dist/`. Webpack transpila; `tsc` solo avisa de errores de tipos.

## 3. `webpack.config.js`

Copia `webpack.config.eje3-base.example` a `webpack.config.js`. El contenido que debes tener es este:

```js
const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

Qué hace cada bloque:

| Clave | Para qué sirve |
| --- | --- |
| `entry` | Archivo por el que Webpack empieza a seguir los `import` |
| `devtool` | Source maps: en el navegador ves el `.ts`, no el bundle |
| `module.rules` | Los `.ts` pasan por `ts-loader` |
| `resolve.extensions` | Puedes importar sin escribir la extensión |
| `output` | Un único `dist/bundle.js` |

En el ejemplo base también aparece `watch: true`. Si lo dejas, `npm run build` no termina: se queda recompilando. Es más claro quitarlo del archivo y usar `npm run watch` cuando quieras ese modo.

## 4. Modelo — `src/models/todo.model.ts`

Crea la carpeta y el archivo. Parte de `models/todo.model.js` y haz tres cambios.

**Exporta la clase.** Quien la use tendrá que importarla.

**Declara las propiedades.** Con `strict`, TypeScript no admite propiedades que solo aparecen dentro del constructor.

```ts
export class Todo {
  id: string;
  text: string;
  complete: boolean;

  constructor(/* ... */) {
    // ...
  }
}
```

**Tipa el argumento del constructor.** Hoy el parámetro es `{ text, complete } = { complete: false }`. `text` puede llegar vacío (al leer de `localStorage` el objeto ya trae `text` y `complete`). Define un tipo y dale valor por defecto a `complete`:

```ts
export interface TodoData {
  text: string;
  complete?: boolean;
}
```

En el constructor, desestructura ese tipo y asigna `this.id`, `this.text` y `this.complete`.

`uuidv4` tiene que devolver `string`. El callback de `replace` recibe `c` como `string`, y el operador `^` exige un número. Pasa `c` por `Number(c)` antes de operarlo. El método sigue haciendo lo mismo: generar un id.

Comprueba este archivo solo cuando exista `src/app.ts`. Hasta entonces `tsc` no tiene un programa que arrancar, pero el archivo ya puede importarse.

## 5. Servicio — `src/services/todo.service.ts`

```ts
import { Todo } from "../models/todo.model";
```

Cambios respecto al `.js`:

- `export class TodoService`
- Propiedad `todos: Todo[]`
- `onTodoListChanged` es una función `(todos: Todo[]) => void`. Inicialízala a una función vacía para que `_commit` pueda llamarla antes de que el controlador la registre, o asegúrate de que `bindTodoListChanged` se llama antes del primer `_commit` (en esta app el controlador la registra en su constructor, y el primer `_commit` ocurre después, al añadir o editar).
- `addTodo(text: string)`, `editTodo(id: string, updatedText: string)`, `deleteTodo(id: string)`, `toggleTodo(id: string)` y `_commit(todos: Todo[])` llevan esos tipos. El cuerpo se queda igual.
- `JSON.parse` devuelve `any`. Anota el array leído de `localStorage` y vuelve a construir cada elemento con `new Todo(...)`, como ya hace el `.js`. Si no hay nada guardado, el array es `[]`.

`localStorage` solo existe porque `tsconfig` incluye `"dom"`.

## 6. Vista — `src/views/todo.views.ts`

Es el archivo que más errores de tipos va a dar. La lógica (crear el formulario, pintar la lista, enganchar eventos) no cambia.

```ts
import { Todo } from "../models/todo.model";

export class TodoView {
  // ...
}
```

### Elementos del DOM

Anota los campos con el tipo real del nodo:

- contenedor, formulario, título, lista, botón: `HTMLElement` (el formulario puede ser `HTMLFormElement`)
- el campo de texto: `HTMLInputElement`
- `_temporaryTodoText: string`

`document.createElement("input")` para TypeScript es un `HTMLElement` genérico, así que `.type`, `.placeholder`, `.value` y `.checked` no existen hasta que el nodo es un `HTMLInputElement`.

Haz que `createElement` conserve el tipo, o haz un cast en el input y en el checkbox:

```ts
const checkbox = this.createElement("input") as HTMLInputElement;
```

`span.contentEditable = true` en JavaScript funciona por coerción. En TypeScript la propiedad es `string`. Escribe `"true"`.

### `querySelector` puede devolver `null`

`getElement` tiene que devolver un elemento de verdad. Si `document.querySelector(selector)` es `null`, lanza un error. Así `this.app` no es `HTMLElement | null` y el resto del código no se llena de comprobaciones.

### Eventos

`event.target` es `EventTarget | null`. No tiene `className`, `type` ni `parentElement`.

En cada handler, estrecha el target antes de usarlo:

```ts
const target = event.target as HTMLElement;
```

Para el checkbox, el cast es `HTMLInputElement` (necesitas `.type` y, al borrar, el id sigue estando en el padre).

`parentElement` también puede ser `null`. Guarda el id solo si el padre existe:

```ts
const id = target.parentElement?.id;
if (id) handler(id);
```

`displayTodos(todos: Todo[])` se queda como está: lista vacía, checkbox, texto tachado si `complete` es true, botón Delete.

Los cuatro `bind*` reciben el handler que les pasa el controlador:

- añadir: `(text: string) => void`
- editar: `(id: string, text: string) => void`
- borrar y marcar: `(id: string) => void`

## 7. Controlador — `src/controllers/todo.controller.ts`

```ts
import { Todo } from "../models/todo.model";
import { TodoService } from "../services/todo.service";
import { TodoView } from "../views/todo.views";

export class TodoController {
  service: TodoService;
  view: TodoView;

  constructor(service: TodoService, view: TodoView) {
    // el mismo cuerpo que el .js
  }
}
```

Los métodos flecha se quedan en flecha (así `this` no se pierde al pasarlos como callback):

- `onTodoListChanged = (todos: Todo[]) => { ... }`
- `handleAddTodo = (todoText: string) => { ... }`
- `handleEditTodo = (id: string, todoText: string) => { ... }`
- `handleDeleteTodo = (id: string) => { ... }`
- `handleToggleTodo = (id: string) => { ... }`

No añadas comportamiento nuevo. Este archivo solo reenvía.

## 8. Entrada — `src/app.ts`

Sustituye las clases globales de `app.js` por imports:

```ts
import { TodoController } from "./controllers/todo.controller";
import { TodoService } from "./services/todo.service";
import { TodoView } from "./views/todo.views";

new TodoController(new TodoService(), new TodoView());
```

Webpack entra por aquí, sigue cada `import` y mete modelo, servicio, controlador y vista dentro de `dist/bundle.js`.

## 9. `index.html`

Borra las cinco etiquetas `<script>`. Deja una:

```html
<script src="dist/bundle.js"></script>
```

El `<link>` a `style.css` se queda. El CSS no entra en el bundle de esta config, y no hace falta: el HTML lo carga aparte.

## 10. Compilar y probar

En `PEC2_Ej3`:

```bash
npm run typecheck
npm run build
```

`typecheck` tiene que terminar sin errores. `build` crea `dist/bundle.js`.

Sirve la carpeta (abrir el HTML con `file://` a veces falla con `localStorage`):

```bash
npx serve .
```

Abre la URL que imprima y comprueba:

- [ ] Se ve el título, el formulario y, si no hay tareas, el texto de lista vacía
- [ ] Submit con el campo vacío no añade nada
- [ ] Submit con texto añade una fila con checkbox, texto y Delete
- [ ] El checkbox tacha el texto
- [ ] Editar el texto (clic, cambiar, salir del campo) guarda el cambio
- [ ] Delete quita la fila
- [ ] Recargar la página conserva las tareas
- [ ] En las herramientas del navegador, el script cargado es `dist/bundle.js` y no los `.js` viejos

Si cambias un `.ts` mientras desarrollas, `npm run watch` vuelve a generar el bundle. Recarga el navegador.

---

## Errores habituales

**`Cannot find name 'document'` o `'localStorage'`.** Falta `"dom"` en `lib` del `tsconfig`.

**`Property 'value' does not exist on type 'HTMLElement'`.** Ese nodo es un input. Cástalo a `HTMLInputElement`.

**`Object is possibly 'null'`.** Viene de `querySelector`, `event.target` o `parentElement`. Comprueba el null o haz el cast después de asegurarte de que existe.

**`'c' is of type 'string'` dentro de `uuidv4`.** `Number(c)` antes del `^`.

**El bundle no se genera y Webpack dice que no encuentra `./src/app.ts`.** El comando se lanzó fuera de `PEC2_Ej3`, o `app.ts` no está en `src/`.

**La página está en blanco y la consola habla de `Todo is not defined`.** `index.html` sigue cargando los `.js` sueltos, o el bundle no se está cargando. Tiene que quedar un único script: `dist/bundle.js`.

**Salen dos listas.** Están activos a la vez los scripts viejos y el bundle. Quita los cinco `<script>` originales.

**`npm run build` no devuelve el prompt.** `watch: true` sigue dentro de `webpack.config.js`. Quítalo y usa `npm run watch` cuando quieras recompilar solo.

## Qué no hace falta

- No conviertas el CSS a un loader de Webpack.
- No copies alias, Babel ni `awesome-typescript-loader` del otro ejemplo.
- No cambies el diseño ni añadas funciones a la lista de tareas.
- No hace falta un framework. Siguen siendo las cuatro clases, ahora con tipos y módulos.
