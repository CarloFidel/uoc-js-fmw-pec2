Login UOC: cftaboada

Nombre y apellidos: Carlo Fidel Taboada Petersson

Descripción de la PEC

Ejercicio 1. En `PEC2_Ej1/code1.ts` se cambia `apple` de número a string (`'a'`) para que el IDE marque la multiplicación `c.apple * 4`. La captura y la explicación están en `PEC2_Ej1/pec2_e1_respuestas_teoria.md`, junto con los tipos inferidos de `code2.ts`, la causa de cada error de `code3.ts` y la diferencia entre clase e interface.

Ejercicio 2. En `PEC2_Ej2/src` se completan los tres archivos TypeScript: métodos de array (`ejercicio1.ts`), el tipo índice del hangar (`ejercicio2.ts`) y las clases `Animal`, `Dog` y `Cat` (`ejercicio3.ts`). Para comprobarlo, desde `PEC2_Ej2`: `npx tsc` y ejecutar el JavaScript generado.

Ejercicio 3. La aplicación de tareas pasa de scripts JavaScript globales a módulos TypeScript y se empaqueta con Webpack para renderizar con serve.
Para corregir o ejecutar el ejercicio 3, hay que situarse en `PEC2_Ej3_1` y ejecutar los comandos:

```bash
npm install
npm run build
npx serve .
```

`node_modules`, `package-lock.json` y `dist` no están en el repositorio. Sin `npm run build` el HTML no tiene bundle y la página no arranca. 
