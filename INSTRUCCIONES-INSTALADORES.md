# Generar instaladores de ARGOM VENOM

Los instaladores se generan con [electron-builder](https://www.electron.build/) a partir de la configuración `build` de `package.json`. Cada sistema operativo debe compilarse en ese mismo sistema (o en CI, ver más abajo).

## Requisitos

- Node.js 22 o superior
- `npm install` ejecutado en la raíz del proyecto

No hace falta Python: el scraper de Telegram está escrito en Node (GramJS) y va dentro de la app.

## Comandos

```bash
npm run dist   # instalador para el sistema actual
npm run pack   # app sin instalador (carpeta release/<plataforma>-unpacked), útil para probar
```

| Sistema | Resultado en `release/` |
|---------|-------------------------|
| Windows | `ARGOM VENOM Setup <versión>.exe` (NSIS, permite elegir carpeta) |
| macOS   | `ARGOM VENOM-<versión>.dmg` |
| Linux   | `ARGOM VENOM-<versión>.AppImage` |

## CI

`.github/workflows/release.yml` ejecuta typecheck, tests y build en cada push o PR a `master`, y genera los instaladores de los tres sistemas. Al publicar una *release* en GitHub los adjunta automáticamente.

## Windows SmartScreen / Defender

El instalador no está firmado con un certificado de código, así que Windows puede mostrar el aviso "Windows protegió su PC". Pulsa **Más información → Ejecutar de todas formas**. Para eliminar el aviso hay que firmar el ejecutable (configurar `win.signtoolOptions` o las variables `CSC_LINK` / `CSC_KEY_PASSWORD` de electron-builder).

## Datos del usuario

La app guarda su base de datos (`argom-venom.db`) en la carpeta de datos de la aplicación:

- Windows: `%APPDATA%\argom-venom`
- macOS: `~/Library/Application Support/argom-venom`
- Linux: `~/.config/argom-venom`

Desinstalar la app no borra esa carpeta.
