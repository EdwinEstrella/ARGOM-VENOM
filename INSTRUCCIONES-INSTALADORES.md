# Instrucciones para Generar Instaladores de ARGOM VENOM

## Estado Actual
✅ **Windows**: Instalador .exe generado exitosamente
📁 **Instalador**: `release/installer/ARGOM-VENOM-Setup.exe` (134 MB)
📁 **Portable ZIP**: `release/ARGOM-VENOM-Portable.zip` (138 MB)
📁 **Ejecutable directo**: `release/win-unpacked/ARGOM VENOM.exe`

## Comandos para Generar Instaladores

### 1. Instalador para Windows (.exe) ✅
```bash
npm run build:installer
```
Genera:
- `release/installer/ARGOM-VENOM-Setup.exe` (instalador completo)

### 2. Aplicación Portable Windows ✅
```bash
npm run pack
```
Genera:
- `release/win-unpacked/ARGOM VENOM.exe` (aplicación portable)
```bash
# O para crear ZIP portable:
cd release && powershell "Compress-Archive -Path win-unpacked\\* -DestinationPath ARGOM-VENOM-Portable.zip -Force"
```
Genera:
- `release/ARGOM-VENOM-Portable.zip` (aplicación portable)

### 3. Instalador para macOS (.dmg)
Para generar el instalador .dmg para macOS, necesitas ejecutar en una Mac:
```bash
# En macOS:
npm run build:electron -- --mac

# O con target específico:
npx electron-builder --mac --publish=never
```
Genera:
- `release/ARGOM VENOM-1.0.0.dmg`

### 4. Instalador para Linux (.AppImage y .deb)
Para generar los instaladores de Linux, necesitas ejecutar en Linux:
```bash
# En Linux:
npm run build:electron -- --linux

# O con targets específicos:
npx electron-builder --linux AppImage deb --publish=never
```
Genera:
- `release/ARGOM-VENOM-1.0.0.AppImage`
- `release/argom-venom_1.0.0_amd64.deb`

## Configuración Actual

### package.json (build section)
```json
{
  "build": {
    "appId": "com.argom.venom",
    "productName": "ARGOM VENOM",
    "directories": {
      "output": "release",
      "buildResources": "public"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "package.json"
    ],
    "win": {
      "target": ["portable", "zip"],
      "icon": "public/icon.png"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "public/icon.icns",
      "category": "public.app-category.productivity"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "public/icon.png",
      "category": "Utility"
    }
  }
}
```

## Archivos Generados

### Windows ✅
- **Portable ZIP**: `release/ARGOM-VENOM-Portable.zip` (~138 MB)
- **Ejecutable directo**: `release/win-unpacked/ARGOM VENOM.exe`
- **Uso**: Descomprimir el ZIP y ejecutar `ARGOM VENOM.exe`

### macOS (requiere Mac)
- **DMG Installer**: `release/ARGOM VENOM-1.0.0.dmg`
- **Uso**: Montar el DMG y arrastrar la aplicación a Applications

### Linux (requiere Linux)
- **AppImage**: `release/ARGOM-VENOM-1.0.0.AppImage`
  - **Uso**: Hacer ejecutable y correr directamente
- **DEB Package**: `release/argom-venom_1.0.0_amd64.deb`
  - **Uso**: `sudo dpkg -i argom-venom_1.0.0_amd64.deb`

## Solución de Problemas

### Problema de Firma de Código
Si tienes problemas con la firma de código en Windows:
```bash
# Desactivar firma de código
set CSC_LINK=
set CSC_KEY_PASSWORD=
npm run build:electron
```

### Permisos de Símbolos del Sistema
En Windows, si tienes errores de permisos:
1. Ejecutar como administrador
2. O usar targets que no requieren firma (portable, zip)

### Iconos Personalizados
Para agregar iconos personalizados:
1. Windows: `public/icon.png` (256x256)
2. macOS: `public/icon.icns` (512x512)
3. Linux: `public/icon.png` (256x256)

## Scripts de Construcción

```json
{
  "scripts": {
    "build:electron": "tsc -p electron && npm run build && ren dist-electron\\main.js main.cjs && electron-builder",
    "build:installer": "tsc -p electron && npm run build && ren dist-electron\\main.js main.cjs && npm run pack && cp LICENSE release/win-unpacked/ && node create-installer.js",
    "build:frontend": "vite build",
    "build:backend": "tsc -p electron",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  }
}
```

## Archivos Generados

### Windows ✅
- **Instalador EXE**: `release/installer/ARGOM-VENOM-Setup.exe` (~134 MB)
  - **Uso**: Ejecutar y seguir el asistente de instalación
- **Portable ZIP**: `release/ARGOM-VENOM-Portable.zip` (~138 MB)
  - **Uso**: Descomprimir y ejecutar `ARGOM VENOM.exe`
- **Ejecutable directo**: `release/win-unpacked/ARGOM VENOM.exe`
  - **Uso**: Ejecutar directamente desde la carpeta

### macOS (requiere Mac)
- **DMG Installer**: `release/ARGOM VENOM-1.0.0.dmg`
  - **Uso**: Montar el DMG y arrastrar la aplicación a Applications

### Linux (requiere Linux)
- **AppImage**: `release/ARGOM-VENOM-1.0.0.AppImage`
  - **Uso**: Hacer ejecutable y correr directamente
- **DEB Package**: `release/argom-venom_1.0.0_amd64.deb`
  - **Uso**: `sudo dpkg -i argom-venom_1.0.0_amd64.deb`

## Recomendaciones

1. **Para Desarrollo**: Usa `npm run pack` para generar solo la aplicación sin instalador
2. **Para Producción**: Usa `npm run build:installer` para generar el instalador .exe completo
3. **Multiplataforma**: Configura GitHub Actions para generar instaladores automáticamente para todas las plataformas

## Iconos Personalizados

Tu icono `venom.ico` está listo para ser usado en futuras versiones. Para configurarlo:
1. **Windows**: El archivo está en `public/venom.ico`
2. **macOS**: Necesita formato `.icns` (convertir desde .ico)
3. **Linux**: Puede usar el mismo `venom.ico` o convertir a .png