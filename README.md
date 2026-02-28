# Hotel Management Admin Panel

Un panel de administración moderno construido con **Angular 21** y **DaisyUI**,
diseñado para la gestión completa de hoteles, habitaciones y reservas.

## 🎯 Características Principales

- **Gestión de Hoteles**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Gestión de Habitaciones**: Administración de habitaciones por hotel
- **Gestión de Reservas**: Listado con vista detallada de reservaciones
- **Interface Moderna**: UI responsiva con DaisyUI y Tailwind CSS

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | Angular | 21 |
| Lenguaje | TypeScript | Strict Mode |
| Styling | TailwindCSS + DaisyUI | Última |
| State Management | Signals API | Angular 17+ |
| Formularios | FormsModule (Two-way Binding) | Angular 21 |
| Testing | Jasmine | Incluido |
| Build Tool | Angular CLI | Vite |

### Decisiones Arquitectónicas

#### 1. **Standalone Components**

Angular ha marcado una tendencia hacia componentes standalone, eliminando la necesidad de NgModules. Esto simplifica la arquitectura y reduce el boilerplate.

```typescript
@Component({
  selector: 'app-hotels-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Beneficios:**

- Código más limpio y modular
- Mejor tree-shaking en builds
- Facilita lazy loading de rutas

#### 2. **Signals para State Management**

Se utiliza la Signals API de Angular para gestionar el estado local de la aplicación, reemplazando las necesidades de RxJS en casos simples.

```typescript
private hotels = signal<Hotel[]>([]);
readonly hotelsList = computed(() => this.hotels());

// Actualización inmutable
this.hotels.update(h => [...h, newHotel]);
```

**Ventajas:**

- Fine-grained reactivity
- Performance optimizado (solo re-renderiza lo necesario)
- Evita memory leaks comunes con subscripciones
- Síntaxis más intuitiva que Observables

#### 3. **Change Detection OnPush**

Todos los componentes utilizan `ChangeDetectionStrategy.OnPush` para optimizar el rendimiento.

```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

**Impacto:**

- Reducción de ciclos de detección de cambios
- Solo detecta cambios cuando hay nuevas referencias en inputs
- Mejora significativa en apps con muchos componentes

#### 4. **Separación Template-Logic**

Los templates se extraen a archivos `.html` separados para mejorar legibilidad y mantenibilidad.

```
hotels-page/
├── hotels-page.ts       (lógica)
├── hotels-page.html     (presentación)
└── hotels-page.spec.ts  (tests)
```

**Razón:**

- Claridad en la separación de responsabilidades
- Facilita el work en paralelo (dev + designer)
- Archivos más pequeños y navegables

#### 5. **Mock Data Service**

Se implementa un servicio que simula una API REST con:

- Delay simulado (500ms) para realismo
- Validaciones en servidor
- Manejo de errores completo

## 📁 Estructura de Carpetas

```
src/app/
├── admin/
│   ├── components/
│   │   └── admin-sidebar/       # Menú lateral
│   ├── layouts/
│   │   └── admin-layout/        # Layout principal
│   ├── pages/
│   │   ├── hotels-page/         # CRUD Hoteles
│   │   ├── rooms-page/          # CRUD Habitaciones
│   │   └── reservations-page/   # Listado Reservas
│   ├── interfaces/
│   │   └── admin.interface.ts  # TypeScript types
│   ├── services/
│   │   ├── admin.service.ts    # Mock API
│   │   └── admin.service.spec.ts # Tests
│   └── admin.routes.ts          # Routing config
├── guest/                       # Módulo viajero
├── shared/                      # Utilidades compartidas
└── app.routes.ts               # Rutas principales
```

## 🚀 Escalabilidad

### 1. **Integración con API Real**

Actualmente el servicio simula llamadas HTTP. Para integrar una API real:

### 2. **State Management Avanzado**

Para aplicaciones más complejas, considerar:

- **Angular Signals Store**: Próxima generación de NgRx

### 3. **Caché y Optimización**

Agregar caching de datos para reducir llamadas API:

### 4. **Librería de Componentes**

Extraer componentes reutilizables en una librería compartida:

### 5. **e2e Testing y CI/CD**

Implementar:

- Tests unitarios (Jasmine)
- Tests e2e (Cypress/Playwright)
- GitHub Actions para CI/CD

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

Cobertura incluida:

- ✅ Validación de campos requeridos
- ✅ Rechazo de datos inválidos
- ✅ Operaciones CRUD completas
- ✅ Estados de carga y error
- ✅ Cálculos de precios con impuestos

### Futuro

- [ ] JWT Authentication
- [ ] Role-Based Access Control (RBAC)
- [ ] API key rotation
- [ ] Rate limiting

## 💻 Desarrollo Local

### Instalación

```bash
npm install
```

### Development Server

```bash
npm run start
```

Navega a `http://localhost:4200/`

### Build Producción

```bash
npm run build
```

### Ejecutar Tests

```bash
npm run test
```

## 🚀 Próximos Pasos

1. **Autenticación**: Implementar JWT + Login page
2. **Permisos**: RBAC (Admin, Manager, Staff)
3. **Reportes**: Exportar a PDF/Excel
4. **Analytics**: Gráficos de ocupación y revenue
5. **Mobile**: Aplicación nativa con Ionic
