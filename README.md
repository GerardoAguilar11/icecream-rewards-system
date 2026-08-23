# Ice Cream Rewards System

Sistema web de recompensas para una heladería, desarrollado con Django REST Framework, PostgreSQL y React.

El sistema permite gestionar clientes, productos, compras, puntos, recompensas y estadísticas administrativas mediante una API REST.

## Funcionalidades principales

- Autenticación mediante JWT.
- Roles de usuario: administrador, empleado y cliente.
- Gestión de clientes.
- Código único de cliente con prefijo `FC`.
- Gestión de productos.
- Registro de compras.
- Cálculo automático de puntos.
- Cancelación de compras y reversión de puntos.
- Gestión de recompensas.
- Canje de recompensas utilizando puntos.
- Historial de compras y canjes.
- Dashboard administrativo.
- Estadísticas de ventas y productos más vendidos.

## Tecnologías

### Backend

- Python 3.14
- Django 6
- Django REST Framework
- PostgreSQL
- Simple JWT
- django-cors-headers
- Pillow
- python-decouple

### Frontend

- React
- JavaScript
- Node.js

> El frontend se encuentra actualmente en desarrollo.

## Estructura del proyecto

```text
icecream-rewards-system/
│
├── backend/
│   ├── authentication/
│   ├── config/
│   ├── customers/
│   ├── dashboard/
│   ├── permissions/
│   ├── products/
│   ├── purchases/
│   ├── rewards/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── docs/
├── frontend/
├── .gitignore
├── LICENSE
└── README.md
```

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Python 3.14 o compatible
- PostgreSQL
- Git
- Node.js
- npm

## Instalación del backend

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd icecream-rewards-system
cd backend
```

Crear el entorno virtual:

```bash
python -m venv venv
```

### Activar entorno virtual en Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Si PowerShell bloquea la ejecución:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

Y volver a ejecutar:

```powershell
.\venv\Scripts\Activate.ps1
```

## Instalar dependencias

Con el entorno virtual activo:

```bash
pip install -r requirements.txt
```

## Configuración de variables de entorno

Crear el archivo:

```text
backend/.env
```

Tomando como referencia:

```text
backend/.env.example
```

Ejemplo:

```env
SECRET_KEY=your_secret_key_here
DEBUG=True

DB_NAME=icecream_rewards
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
DB_HOST=localhost
DB_PORT=5432
```

El archivo `.env` contiene información local y privada, por lo que no debe subirse al repositorio.

## Base de datos

Crear una base de datos PostgreSQL llamada:

```text
icecream_rewards
```

Posteriormente ejecutar las migraciones:

```bash
python manage.py migrate
```

## Crear usuario administrador

```bash
python manage.py createsuperuser
```

El proyecto utiliza el correo electrónico como campo principal de autenticación.

## Ejecutar el backend

```bash
python manage.py runserver
```

Por defecto estará disponible en:

```text
http://127.0.0.1:8000/
```

El panel administrativo de Django se encuentra en:

```text
http://127.0.0.1:8000/admin/
```

## Roles

El sistema dispone de tres roles.

### ADMIN

Puede:

- Administrar clientes.
- Administrar productos.
- Administrar recompensas.
- Registrar compras.
- Realizar canjes.
- Consultar historiales.
- Consultar el dashboard y estadísticas.

### EMPLOYEE

Puede:

- Consultar clientes.
- Registrar compras.
- Consultar productos.
- Consultar recompensas.
- Realizar canjes.
- Consultar historiales.

No puede modificar la configuración administrativa del negocio.

### CUSTOMER

Representa al cliente registrado dentro del programa de recompensas.

Cada cliente dispone de:

- Datos personales.
- Código único de cliente.
- Puntos acumulados.
- Historial de compras.
- Historial de recompensas.

## Sistema de puntos

La regla actual es:

```text
$50 MXN completos = 1 punto
```

Ejemplos:

| Compra | Puntos |
| -----: | -----: |
|    $49 |      0 |
|    $50 |      1 |
|    $99 |      1 |
|   $100 |      2 |
|   $149 |      2 |
|   $150 |      3 |

Los puntos se calculan utilizando únicamente bloques completos de $50.

Una compra que utilice una recompensa no genera puntos.

Si una compra normal es cancelada, los puntos generados por esa compra son descontados del cliente.

## Código de cliente

Cada cliente recibe automáticamente un código único con el formato:

```text
FC0000
```

Ejemplo:

```text
FC9972
```

Este código puede utilizarse para localizar rápidamente al cliente y posteriormente podrá utilizarse junto con su código QR.

## Endpoints principales

### Authentication

```text
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/logout/
GET  /api/auth/me/
POST /api/auth/register/
```

### Customers

```text
GET    /api/customers/
POST   /api/customers/
GET    /api/customers/<id>/
PATCH  /api/customers/<id>/
DELETE /api/customers/<id>/

GET /api/customers/me/
GET /api/customers/search/?q=<query>
```

### Products

```text
GET    /api/products/
POST   /api/products/
GET    /api/products/<id>/
PATCH  /api/products/<id>/
DELETE /api/products/<id>/
```

### Purchases

```text
GET  /api/purchases/
POST /api/purchases/

GET /api/purchases/<id>/

PATCH /api/purchases/<id>/cancel/

GET /api/purchases/customer/<customer_code>/
```

### Rewards

```text
GET    /api/rewards/
POST   /api/rewards/
GET    /api/rewards/<id>/
PATCH  /api/rewards/<id>/
DELETE /api/rewards/<id>/

POST /api/rewards/redeem/

GET /api/rewards/customer/<customer_code>/history/
```

### Dashboard

Los endpoints del dashboard son exclusivos para administradores.

```text
GET /api/dashboard/summary/

GET /api/dashboard/top-products/

GET /api/dashboard/sales-last-7-days/
```

## Dashboard

Actualmente incluye:

- Ventas del día.
- Número de compras completadas del día.
- Total de clientes registrados.
- Puntos otorgados durante el día.
- Recompensas canjeadas durante el día.
- Productos más vendidos.
- Ventas de los últimos siete días.

Las compras canceladas no son consideradas en las estadísticas de ventas.

## Flujo principal del sistema

```text
Cliente registrado
        ↓
Código de cliente / QR
        ↓
Empleado identifica al cliente
        ↓
Registra productos comprados
        ↓
Se calcula el total
        ↓
Se calculan los puntos
        ↓
Cliente acumula puntos
        ↓
Puede continuar acumulando
        ↓
O canjear una recompensa
        ↓
Se descuentan los puntos
        ↓
Se registra el historial del canje
```

## Estado del proyecto

### Backend

MVP funcional.

Módulos completados:

- [x] Configuración inicial
- [x] Autenticación
- [x] Gestión de clientes
- [x] Gestión de productos
- [x] Sistema de compras
- [x] Sistema de puntos
- [x] Sistema de recompensas
- [x] Dashboard y estadísticas
- [x] Normalización de endpoints REST

### Frontend

En desarrollo.

Próximos pasos:

- [ ] Configuración inicial de React
- [ ] Autenticación frontend
- [ ] Navegación según roles
- [ ] Dashboard administrativo
- [ ] Gestión de clientes
- [ ] Gestión de productos
- [ ] Registro de compras
- [ ] Gestión y canje de recompensas
- [ ] Generación y lectura de código QR
- [ ] Perfil del cliente

## Licencia

Este proyecto se distribuye bajo los términos definidos en el archivo `LICENSE`.
