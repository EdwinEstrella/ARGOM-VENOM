# Configurar el scraper de Telegram

El scraper escucha los mensajes nuevos de los grupos y canales en los que está tu cuenta, guarda los que coinciden con tus filtros y los muestra en tiempo real. Funciona dentro de la app de escritorio; no hace falta instalar Python ni nada más.

## 1. Consigue tu API ID y API Hash

1. Entra en <https://my.telegram.org/apps> con tu número de teléfono.
2. Crea una aplicación (el nombre y la descripción dan igual).
3. Copia el **App api_id** (número) y el **App api_hash** (32 caracteres).

> Son credenciales personales: no las compartas ni las subas a un repositorio.

## 2. Configúralo en la app

En **TeleScraper → Configuración de la API**:

- **API ID** y **API Hash** de arriba.
- **Teléfono** en formato internacional, p. ej. `+34600111222`.

Pulsa **Guardar**. El API Hash se cifra con el llavero del sistema y no vuelve a mostrarse; para cambiarlo, escribe uno nuevo.

## 3. Conecta

Pulsa **Conectar con Telegram**. La primera vez:

1. Telegram envía un código a tu app de Telegram. Escríbelo en la app y pulsa **Enviar**.
2. Si tu cuenta tiene verificación en dos pasos, te pedirá esa contraseña.

La sesión queda guardada (cifrada), así que las siguientes veces conecta sin pedir código. Con **Conectar automáticamente al abrir la app** se conecta solo al iniciar sesión.

**Olvidar sesión de Telegram** desconecta y borra la sesión guardada. Al cambiar de teléfono o de API ID la sesión se descarta automáticamente.

## 4. Filtros

- **Grupos**: título del grupo (basta una parte, sin distinguir mayúsculas) o `@usuario` del canal. Sin grupos se escuchan todos los chats.
- **Palabras clave**: el mensaje se guarda si contiene al menos una. Sin palabras clave se guardan todos.

Los cambios de filtros se aplican al momento, sin reconectar.

Además, cada mensaje se etiqueta automáticamente si contiene enlaces de DexScreener, pump.fun, X/Twitter o menciones de Solana o tokens.

## Almacenamiento

Los mensajes se guardan en la base de datos local durante **14 días** y después se borran automáticamente. **Borrar** en el panel de mensajes los elimina todos.

## Problemas frecuentes

| Mensaje | Qué hacer |
|---------|-----------|
| API ID o API Hash no válidos | Revisa los valores en my.telegram.org |
| Número de teléfono no válido | Usa formato internacional con `+` y prefijo del país |
| Código incorrecto | Vuelve a escribirlo; el formulario sigue abierto |
| El código ha caducado | Pulsa **Conectar** otra vez para recibir uno nuevo |
| Telegram limita los intentos | Espera el tiempo indicado antes de reintentar |
