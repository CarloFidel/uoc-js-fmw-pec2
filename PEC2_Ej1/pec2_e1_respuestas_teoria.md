# Ejercicio 1. Error de tipo en el IDE

En `code1.ts` se ha cambiado la propiedad `apple` para que deje de guardar el número `a` y pase a guardar el texto `'a'`:

```ts
const c = {
  apple: 'a',
  banana: b
};
const d = c.apple * 4;
```

El editor marca en rojo la multiplicación:

![Captura del error en code1](<Captura de pantalla 2026-11-10 a les 0.26.49.png>)

El mensaje es: *The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.*

## Por qué se produce

TypeScript deduce el tipo de cada variable a partir del valor asignado.

- `a` es `number`, porque `1 + 2` da un número.
- `b` es `number`, porque suma ese resultado con `3`.
- `c.apple` es `string`, porque ahora vale `'a'`.
- `c.banana` sigue siendo `number`.

El operador `*` solo acepta un número, un `bigint` o un enum numérico. El operando izquierdo es un `string`, así que la operación no está permitida y el editor de código la subraya sin llegar a ejecutar el archivo.

## Qué ventaja tiene

El error aparece en el momento de escribir el código, no cuando la aplicación ya está en marcha. No hace falta ejecutarlo ni preparar una prueba para descubrir que `d` no es un número. El tipo de `apple` queda explícito, es un string, y cualquier uso aritmético se señala en todos los sitios donde ocurra.

## 1. Tipos inferidos en `code2.ts`

TypeScript parte del valor de la derecha y decide el tipo. Con `const`, un primitivo se queda en su tipo literal, porque esa variable no va a cambiar. En un array o en una propiedad de un objeto el valor sí puede cambiar después, y entonces el tipo se ensancha al tipo general.

| Variable | Tipo inferido | Explicación |
| --- | --- | --- |
| `a` | `1042` | Es un `const` con un número concreto. No se ensancha a `number`. |
| `b` | `"apples and oranges"` | Igual que `a`: el texto no se puede reasignar, así que se conserva el literal. |
| `c` | `"pineapples"` | Mismo caso que `b`. |
| `d` | `boolean[]` | Los tres elementos son booleanos. El array se puede modificar (`push`, cambiar un índice), así que el tipo es un array de `boolean`, no la tupla `[true, true, false]`. |
| `e` | `{ type: string }` | La variable `e` no se reasigna, pero `e.type` sí puede cambiar. `'ficus'` se ensancha a `string`. |
| `f` | `(number \| boolean)[]` | Hay un número y un booleano. El tipo común de los elementos es esa unión, dentro de un array mutable. |
| `g` | `number[]` | El único elemento es un número. Al ser un array mutable, el tipo es `number[]`, no el literal `3` ni la tupla `[3]`. |
| `h` | `null` | El `const` se inicializa a `null` y no admite otra asignación, así que el tipo se queda en `null`. |

## 2. Por qué falla cada línea de `code3.ts`

**`i = 4` — TS2588.** `i` está declarada con `const` y con el tipo literal `3`. Una constante solo se asigna al declararla. La línea `i = 4` intenta asignarla otra vez, y typescript lo rechaza: *Cannot assign to 'i' because it is a constant*.

**`j.push('5')` — TS2345.** `j` se inicializa con `[1, 2, 3]`, así que TypeScript infiere `number[]`. `push(4)` es válido porque `4` es un número. `'5'` es un `string`, y un `string` no se puede guardar en un array de números.

**`let k: never = 4` — TS2322.** `never` es el tipo vacío: no existe ningún valor que pertenezca a `never`. `4` es un número, así que no es asignable a `never`.

**`let m = l * 2` — TS2571.** `l` está anotada como `unknown`. Ese tipo indica que ahí hay un valor, pero el compilador no sabe cuál es. Hasta que no se compruebe (por ejemplo con `typeof l === "number"`), no se puede usar en una operación. Multiplicarlo dispara *Object is of type 'unknown'*.

## 3. Diferencia entre una clase y una interface

Una **interface** describe la forma de un objeto: qué propiedades y métodos tiene, y de qué tipo. Solo existe mientras TypeScript compila. En el JavaScript resultante no queda nada de ella, no se puede instanciar y no lleva código que se ejecute.

Una **clase** también describe una forma, y además existe en ejecución. El compilador la convierte en una función constructora. Puede tener constructor, valores iniciales y métodos con cuerpo, se crea con `new` y puede heredar de otra clase con `extends`.

Una clase puede declarar que cumple una interface con `implements`. La interface obliga a tener esa forma. La clase aporta el código que se ejecuta. 