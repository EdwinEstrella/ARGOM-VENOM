# Venom Bot - Sistema de Trading Automatizado

Bienvenido a Venom Bot, un sistema avanzado de trading automatizado especializado en memecoins con una interfaz profesional y completa.

## ¿Cómo usar el bot?

### 1. **Interfaz Principal - Layout**

#### **Barra Lateral Izquierda**
- **Logo Argom Venom**: Identificador del bot
- **Botones Rápidos Superiores**:
  - **Buy**: Botón verde para comprar rápidamente
  - **Sell**: Botón rojo para vender rápidamente
- **Menú de Navegación**:
  - **Main**:
    - **Dashboard**: Vista general de tu portfolio
    - **Positions**: Tus posiciones activas
    - **Orders**: Órdenes pendientes
    - **Transactions**: Historial de transacciones
  - **Trading**:
    - **LP Sniper**: Detección de nueva liquidez
    - **Auto-Buy**: Configuración de bots automáticos
    - **Limit Orders**: Órdenes con precio límite
    - **DCA Orders**: Órdenes de promedio ponderado
    - **Copy Trading**: Copiar traders exitosos
    - **Bridge**: Transferencia entre blockchains
    - **Withdraw**: Retirar fondos
  - **Configuración y Ayuda**: Menú de ajustes

#### **Barra Superior**
- Muestra el título de la página actual
- Indicadores de estado de conexión

### 2. **Dashboard - Panel Principal**

#### **Estadísticas del Portfolio**
- **Total Value**: Valor total de tu portfolio
- **24h Change**: Cambio en las últimas 24 horas
- **Win Rate**: Tasa de operaciones ganadoras
- **Total P&L**: Ganancias/pérdidas totales

#### **Botones de Acción Rápida**
- **New Auto-Buy**: Configurar nuevo bot de compra automática
- **Swap Tokens**: Intercambiar tokens manualmente

#### **Tabla de Activos**
- Lista de tus tokens con:
  - Símbolo del token
  - Precio actual
  - Balance disponible
  - Valor 24h (color verde para ganancias, rojo para pérdidas)
- Botones de Buy/Sell para cada token

#### **Actividad Reciente**
- Historial de operaciones recientes con timestamps

### 3. **Auto-Buy - Configuración del Bot**

#### **Panel de Configuración**
- **Monto de Inversión**:
  - Input para el monto (ej: 0.1 SOL)
  - Selector de moneda (SOL, ETH, USDC)
- **Dirección del Contrato**: Campo para pegar la dirección del memecoin
- **Tipo de Disparo** (Trigger Type):
  - **Price Dip**: Comprar cuando el precio caiga X%
  - **Volume Spike**: Comprar cuando el volumen aumente X%
  - **New Liquidity**: Comprar al detectar nueva liquidez

#### **Configuración Avanzada**
- **Slippage**: Porcentaje de deslizamiento permitido (ej: 1-5%)
- **Gas Fees**: Configuración de tarifas de gas
- **Take Profit**: Porcentaje de ganancia para vender automáticamente
- **Stop Loss**: Porcentaje de pérdida para vender automáticamente

#### **Botones de Acción**
- **Start Bot**: Iniciar la estrategia configurada
- **Save Configuration**: Guardar configuración para uso futuro
- **Cancel**: Cancelar configuración actual

### 4. **Modal de Trading (Swap)**

#### **Interfaz de Compra/Venta**
- **From Token**: Token que quieres vender (con balance disponible)
- **To Token**: Token que quieres comprar
- **Amount**: Cantidad a intercambiar
- **Botón de Confirmación**:
  - Color verde para operaciones de Buy
  - Color rojo para operaciones de Sell
  - Muestra el monto total de la operación

### 5. **Tablas de Estrategias Activas**

#### **Estados de Estrategia**
- **Active**: Estrategia corriendo activamente
- **Executing**: Estrategia ejecutando una operación
- **Completed**: Estrategia finalizada
- **Failed**: Estrategia fallida

#### **Acciones sobre Estrategias**
- **Stop**: Detener estrategia
- **Edit**: Modificar configuración
- **Delete**: Eliminar estrategia

### 6. **Configuración de Trading**

#### **Protección MEV**
- Toggle para activar/desactivar protección contra ataques MEV

#### **Configuración de Gas**
- **Gas Mode**: Normal, Fast, Instant
- **Gas Limit**: Límite máximo de gas por transacción

#### **Slippage por Defecto**
- Configuración global de slippage para todas las operaciones

### 7. **Funcionalidades Adicionales**

#### **Limit Orders**
- Configurar precio de compra/venta específico
- Establecer caducidad de la orden

#### **DCA Orders**
- Configurar compras automáticas periódicas
- Promediar el precio de entrada

#### **LP Sniper**
- Monitoreo constante de nuevos pares de liquidez
- Configuración de filtros automática



## Advertencia Importante

⚠️ **Riesgo del Trading de Memecoins**: Las memecoins son extremadamente volátiles y pueden resultar en pérdidas totales. Opera siempre con responsabilidad y nunca inviertas más de lo que estás dispuesto a perder.

*Nota: Este es un proyecto personal privado. La configuración técnica (variables de entorno, API keys, etc.) ya está configurada y no requiere intervención del usuario.*
