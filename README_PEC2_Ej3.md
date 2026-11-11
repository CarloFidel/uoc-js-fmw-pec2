# PEC2 Ejercicio 3

Comandos para transpilar y ejecutar la aplicación. Hay que lanzarlos desde la carpeta del ejercicio.

## Instalar

```bash
npm install
```

## Transpilar

Webpack genera `dist/bundle.js` a partir de `src/app.ts`.

```bash
npm run build
```

## Ejecutar

```bash
npx serve .
```

Abre la URL que imprima el comando. `index.html` carga `dist/bundle.js`.
