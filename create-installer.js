import { createWindowsInstaller } from 'electron-winstaller';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createInstaller() {
  try {
    console.log('Creando instalador .exe para ARGOM VENOM...');

    // Asegurarse de que el directorio win-unpacked exista
    const appDirectory = path.join(__dirname, 'release', 'win-unpacked');
    if (!fs.existsSync(appDirectory)) {
      console.error('Error: No se encuentra el directorio win-unpacked. Ejecuta primero npm run pack');
      return;
    }

    // Crear instalador
    const result = await createWindowsInstaller({
      appDirectory: appDirectory,
      outputDirectory: path.join(__dirname, 'release', 'installer'),
      authors: 'Edwin Estrella',
      description: 'ARGOM VENOM - Trading Dashboard',
      exe: 'ARGOM VENOM.exe',
      name: 'ARGOM_VENOM',
      title: 'ARGOM VENOM',
      license: path.join(__dirname, 'LICENSE'),
      noMsi: true,
      setupExe: 'ARGOM-VENOM-Setup.exe',
      setupIcon: path.join(__dirname, 'public', 'venom.ico'),
      iconUrl: 'https://raw.githubusercontent.com/EdwinEstrella/ARGOM-VENOM/main/public/venom.ico',
      skipUpdateIcon: true
    });

    console.log('✅ Instalador creado exitosamente!');
    console.log('📁 Ubicación:', path.join(__dirname, 'release', 'installer', 'ARGOM-VENOM-Setup.exe'));

  } catch (error) {
    console.error('❌ Error al crear el instalador:', error);
  }
}

createInstaller();