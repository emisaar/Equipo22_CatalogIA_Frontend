# CatalogIA Frontend

Frontend de e-commerce desarrollado con React + TypeScript + Material UI.

## Cómo ejecutar el proyecto

### 1. Instalar dependencias
```bash
yarn install
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Iniciar en modo desarrollo
```bash
yarn start
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 4. Build para producción
```bash
yarn build
```

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/          # Header, Layout, Footer
│   └── products/        # ProductCard
├── pages/               # Home, Login, Register, Wishlist
├── services/            # Clientes API (auth, products, wishlist)
├── contexts/            # Context API (AuthContext, WishlistContext)
├── types/               # Interfaces TypeScript
└── theme.ts             # Configuración de Material UI
```

## Tecnologías

- **React 19** + **TypeScript**
- **Material UI 7** - Componentes UI
- **React Router 7** - Navegación
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado

## Backend

Este frontend se conecta con el backend FastAPI en `http://localhost:8000`

Endpoints principales:
- `/api/v1/users/` - Autenticación y usuarios
- `/api/v1/products/` - Productos
- `/api/v1/products/search/semantic` - Búsqueda semántica con IA
- `/api/v1/wishlist/` - Lista de deseos

## Páginas

- `/` - Home con productos destacados
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/wishlist` - Lista de favoritos
