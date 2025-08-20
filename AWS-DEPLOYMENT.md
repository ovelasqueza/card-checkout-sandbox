# 🚀 Despliegue GRATUITO en AWS - PAYFLOW

## 🎯 Arquitectura AWS (100% Free Tier)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AWS Amplify   │────│  Elastic Beanstalk │────│   RDS PostgreSQL│
│   (Frontend)    │    │    (Backend)       │    │   (Free Tier)   │
│   React + Vite  │    │    NestJS API      │    │   20GB Storage  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Servicios AWS Utilizados (GRATIS)

### 🌐 Frontend - AWS Amplify
- ✅ **Hosting gratuito** para aplicaciones React
- ✅ **CI/CD automático** desde GitHub
- ✅ **SSL/HTTPS** incluido
- ✅ **CDN global** con CloudFront
- ✅ **Dominio personalizado** disponible

### ⚙️ Backend - AWS Elastic Beanstalk
- ✅ **750 horas/mes** de instancia t3.micro (Free Tier)
- ✅ **Despliegue automático** desde código
- ✅ **Load balancer** incluido
- ✅ **Monitoreo** con CloudWatch
- ✅ **Auto-scaling** configurado

### 🗄️ Base de Datos - Amazon RDS PostgreSQL
- ✅ **750 horas/mes** de instancia db.t3.micro
- ✅ **20GB** de almacenamiento SSD
- ✅ **Backups automáticos** (7 días)
- ✅ **Multi-AZ** para alta disponibilidad

---

## 🛠️ PASO 1: Configurar RDS PostgreSQL

### 1.1 Crear Base de Datos
```bash
# En AWS Console > RDS > Create Database
- Engine: PostgreSQL
- Version: 15.x (latest)
- Template: Free tier
- Instance: db.t3.micro
- Storage: 20 GB (gp2)
- Multi-AZ: No (para Free Tier)
- VPC: Default
- Public access: Yes
- Security group: Create new (puerto 5432)
```

### 1.2 Configurar Security Group
```bash
# Reglas de entrada:
- Type: PostgreSQL
- Port: 5432
- Source: 0.0.0.0/0 (para desarrollo)
# En producción usar IP específica de Elastic Beanstalk
```

### 1.3 Obtener Endpoint
```bash
# Ejemplo de endpoint:
DB_HOST=payflow-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=payflow_production
```

---

## 🛠️ PASO 2: Preparar Backend para Elastic Beanstalk

### 2.1 Crear archivo de configuración
```yaml
# .ebextensions/01-environment.config
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm run start:prod"
```

### 2.2 Actualizar package.json del backend
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 2.3 Variables de entorno para producción
```bash
# En Elastic Beanstalk Configuration > Environment properties:
NODE_ENV=production
PORT=8080
DB_HOST=payflow-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=payflow_production
PAYFLOW_PUBLIC_KEY=pub_prod_key
PAYFLOW_PRIVATE_KEY=prv_prod_key
PAYFLOW_BASE_URL=https://api.payflow.co/v1
PAYFLOW_REDIRECT_URL=https://tu-app.amplifyapp.com/payment/callback
```

---

## 🛠️ PASO 3: Configurar Frontend para Amplify

### 3.1 Crear archivo de build
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 3.2 Variables de entorno para Amplify
```bash
# En Amplify Console > Environment variables:
VITE_API_BASE_URL=https://tu-backend.elasticbeanstalk.com
VITE_APP_NAME=PAYFLOW
VITE_APP_VERSION=1.0.0
```

---

## 🚀 PASO 4: Proceso de Despliegue

### 4.1 Desplegar Backend (Elastic Beanstalk)
```bash
# 1. Instalar EB CLI
npm install -g @aws-amplify/cli
pip install awsebcli

# 2. Inicializar en carpeta backend
cd backend
eb init
# Seleccionar región: us-east-1
# Seleccionar plataforma: Node.js
# Crear nueva aplicación: payflow-backend

# 3. Crear ambiente
eb create production
# Tipo de instancia: t3.micro (Free Tier)
# Load balancer: Application Load Balancer

# 4. Configurar variables de entorno
eb setenv NODE_ENV=production PORT=8080 DB_HOST=tu-rds-endpoint

# 5. Desplegar
eb deploy
```

### 4.2 Desplegar Frontend (Amplify)
```bash
# 1. En AWS Console > Amplify > New App
# 2. Connect to GitHub
# 3. Seleccionar tu repositorio
# 4. Branch: main
# 5. Build settings: Detecta automáticamente React
# 6. Advanced settings > Environment variables:
#    VITE_API_BASE_URL=https://tu-backend.elasticbeanstalk.com
# 7. Deploy
```

---

## 🔧 PASO 5: Configuraciones Adicionales

### 5.1 CORS en Backend
```typescript
// main.ts
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://tu-app.amplifyapp.com'
  ],
  credentials: true
});
```

### 5.2 Health Check
```typescript
// app.controller.ts
@Get('/health')
getHealth() {
  return { status: 'OK', timestamp: new Date().toISOString() };
}
```

---

## 💰 Costos Estimados (Free Tier)

| Servicio | Límite Free Tier | Costo después |
|----------|------------------|---------------|
| **Amplify** | 1000 build minutes/mes | $0.01/min |
| **Elastic Beanstalk** | 750 horas t3.micro/mes | $0.0116/hora |
| **RDS PostgreSQL** | 750 horas db.t3.micro/mes | $0.017/hora |
| **Total mensual** | **$0.00** (primeros 12 meses) | ~$25/mes |

---

## 🎯 URLs Finales

```bash
# Frontend (Amplify)
https://main.xxxxxxxxx.amplifyapp.com

# Backend (Elastic Beanstalk)
https://payflow-backend.us-east-1.elasticbeanstalk.com

# Base de Datos (RDS)
payflow-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:5432
```

---

## 🏆 Habilidades AWS Demostradas

✅ **Compute**: Elastic Beanstalk, EC2 (t3.micro)
✅ **Storage**: RDS PostgreSQL, S3 (via Amplify)
✅ **Networking**: VPC, Security Groups, Load Balancers
✅ **CI/CD**: Amplify Build, EB Deploy
✅ **Monitoring**: CloudWatch, Health Checks
✅ **Security**: IAM, Environment Variables
✅ **CDN**: CloudFront (via Amplify)
✅ **DNS**: Route 53 (opcional)

---

## 🔍 Monitoreo y Logs

### CloudWatch Logs
```bash
# Backend logs
aws logs describe-log-groups --log-group-name-prefix "/aws/elasticbeanstalk"

# Frontend logs
# Disponibles en Amplify Console > Monitoring
```

### Métricas importantes
- **Response Time**: < 200ms
- **Error Rate**: < 1%
- **Availability**: > 99.9%
- **Database Connections**: < 80% del límite

---

## 🚨 Troubleshooting

### Problemas comunes
1. **CORS Error**: Verificar configuración en main.ts
2. **Database Connection**: Revisar Security Groups
3. **Build Fails**: Verificar Node.js version en package.json
4. **Environment Variables**: Confirmar en Amplify/EB Console

### Comandos útiles
```bash
# Ver logs del backend
eb logs

# Estado del ambiente
eb status

# Reiniciar aplicación
eb restart
```

---

## 🎉 ¡Listo!

