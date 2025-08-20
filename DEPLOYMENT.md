# Configuración de Despliegue - PAYFLOW

## Variables de Entorno

### Frontend (.env)
```bash
# URL base de la API - se ajusta automáticamente según el entorno
VITE_API_BASE_URL=http://localhost:57116
VITE_APP_NAME=PAYFLOW
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```bash
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=card_checkout

# Configuración de Payflow
PAYFLOW_PUBLIC_KEY=pub_test_your_public_key_here
PAYFLOW_PRIVATE_KEY=prv_test_your_private_key_here
PAYFLOW_BASE_URL=https://sandbox.payflow.co/v1
PAYFLOW_REDIRECT_URL=http://localhost:5177/payment/callback

# Puerto de la aplicación (0 = puerto dinámico)
PORT=0
```

## Configuración para Producción

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.tudominio.com
      
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB_HOST=postgres
      - PAYFLOW_REDIRECT_URL=https://tudominio.com/payment/callback
```

### Despliegue Individual

#### Frontend
```bash
# Configurar variables de entorno para producción
export VITE_API_BASE_URL=https://api.tudominio.com
npm run build
npm run preview
```

#### Backend
```bash
# Configurar variables de entorno para producción
export PORT=3000
export DB_HOST=tu-servidor-postgres
export PAYFLOW_REDIRECT_URL=https://tudominio.com/payment/callback
npm run build
npm run start:prod
```

## Ventajas de esta Configuración

1. **Flexibilidad de Puertos**: El backend usa `PORT=0` para asignación dinámica en desarrollo
2. **Configuración Centralizada**: Variables de entorno para diferentes ambientes
3. **Sin Hardcoding**: No hay URLs fijas en el código
4. **Docker Ready**: Fácil configuración para contenedores
5. **Escalabilidad**: Se adapta automáticamente a diferentes infraestructuras

## Respuesta a tu Pregunta

**¿Los puertos en producción me afectan?**

**NO**, esta configuración te protege de problemas de puertos porque:

- ✅ **Docker**: Los puertos se mapean externamente (ej: 80:3000)
- ✅ **Despliegue Individual**: Configuras el puerto específico por ambiente
- ✅ **Variables de Entorno**: La URL de la API se configura dinámicamente
- ✅ **Sin Conflictos**: Cada ambiente puede usar puertos diferentes
- ✅ **Escalabilidad**: Load balancers y reverse proxies manejan el enrutamiento

En producción típicamente usarás:
- Frontend: Puerto 80 (HTTP) o 443 (HTTPS)
- Backend: Puerto interno (3000, 8080, etc.) detrás de un proxy
- Base de datos: Puerto estándar (5432 para PostgreSQL)