# Viajes MX - Plataforma Transaccional

## FASE 1: Modificaciones Completadas ✅
- [x] Pricing: Solo tarjeta "Servicio Personalizado" con botón "Cotizar Ahora" → /cotizar
- [x] Experiencias: Cards con navegación dinámica al catálogo con filtros por categoría
- [x] Header: Mini-Cart con hover, contador de items, link a /carrito

## FASE 2: Nuevas Páginas Completadas ✅
- [x] /experiencias - Catálogo con filtros por categoría y búsqueda
- [x] /experiencias/[id] - Detalle con widget de reserva (fecha, personas, nivel paquete, IVA incluido)
- [x] /carrito - Gestión de items (modificar, eliminar, subtotal, total)
- [x] /checkout - Checkout integrado (datos contacto, facturación, pago simulado)
- [x] /cotizar - Formulario de cotización personalizada
- [x] /admin - Dashboard con reservaciones y cotizaciones pendientes
- [x] /admin/login - Login con credenciales de demo y ruta protegida

## Infraestructura ✅
- [x] CartContext - Estado global del carrito con localStorage
- [x] AuthContext - Autenticación admin con protección de rutas
- [x] Types y Data - Tipos TypeScript y datos mock

## Credenciales Admin Demo
- Email: admin@viajes.mx
- Password: admin123

## Rutas del Proyecto
| Ruta | Descripción |
|------|-------------|
| / | Home |
| /experiencias | Catálogo de experiencias |
| /experiencias/[id] | Detalle de experiencia |
| /carrito | Carrito de compras |
| /checkout | Proceso de pago |
| /cotizar | Formulario de cotización |
| /admin | Dashboard admin (protegido) |
| /admin/login | Login admin |
