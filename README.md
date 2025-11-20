# 📚 Bibliotecar – Sistema de Gestión de Biblioteca
Proyecto desarrollado para la materia **Metodología de Sistemas / Laboratorio de Computación IV**  
Universidad Tecnológica Nacional – FRMDP  
**Año 2025**

---

## 📌 Descripción
Bibliotecar es un sistema de gestión de biblioteca que permite administrar:

- Libros  
- Préstamos  
- Devoluciones  
- Usuarios  

Incluye operaciones completas CRUD (crear, leer, actualizar, eliminar) y validaciones visuales.

---

## 🎯 Objetivos del proyecto
- Digitalizar la gestión manual de una biblioteca.
- Organizar eficientemente libros, estados y préstamos.
- Reducir errores humanos mediante validaciones.
- Proveer una interfaz web clara, moderna y fácil de usar.

---

## 🛠️ Tecnologías utilizadas
- **Angular 20**
- TypeScript  
- HTML + CSS (custom UI)  
- JSON Server para mock de API  
- Node.js  
- Git + GitHub  

---

## 📂 Estructura del proyecto
```
src/
 └── app/
     ├── auth/
     │   ├── login/
     │   │   ├── login.html
     │   │   ├── login.css
     │   │   └── login.ts
     │   ├── auth-guard.ts
     │   └── auth-service.ts
     │
     ├── books/
     │   ├── book-details/
     │   │   ├── book-details.html
     │   │   ├── book-details.css
     │   │   └── book-details.ts
     │   ├── book-form/
     │   │   ├── book-form.html
     │   │   ├── book-form.css
     │   │   └── book-form.ts
     │   ├── book-list/
     │   │   ├── book-list.html
     │   │   ├── book-list.css
     │   │   └── book-list.ts
     │   ├── unsaved-form-guard.ts
     │   ├── book-client.ts
     │   └── book.ts
     │
     ├── header/
     │   ├── header.html
     │   ├── header.css
     │   └── header.ts
     │
     ├── footer/
     │   ├── footer.html
     │   ├── footer.css
     │   └── footer.ts
     │
     ├── loans/
     │   ├── loan-details/
     │   │   ├── loan-details.html
     │   │   ├── loan-details.css
     │   │   └── loan-details.ts
     │   ├── loan-form/
     │   │   ├── loan-form.html
     │   │   ├── loan-form.css
     │   │   └── loan-form.ts
     │   ├── loan-list/
     │   │   ├── loan-list.html
     │   │   ├── loan-list.css
     │   │   └── loan-list.ts
     │   ├── unsaved-loan-guard.ts
     │   ├── loan-client.ts
     │   └── loan.ts
     │
     ├── bookReturns/
     │   ├── bookReturns-details/
     │   │   ├── bookReturns-details.html
     │   │   ├── bookReturns-details.css
     │   │   └── bookReturns-details.ts
     │   ├── bookReturns-form/
     │   │   ├── bookReturns-form.html
     │   │   ├── bookReturns-form.css
     │   │   └── bookReturns-form.ts
     │   ├── bookReturns-list/
     │   │   ├── bookReturns-list.html
     │   │   ├── bookReturns-list.css
     │   │   └── bookReturns-list.ts
     │   ├── bookReturns-client.ts
     │   └── unsaved-bookReturns-guard.ts
     │
     ├── users/
     │   ├── user-details/
     │   │   ├── user-details.html
     │   │   ├── user-details.css
     │   │   └── user-details.ts
     │   ├── user-form/
     │   │   ├── user-form.html
     │   │   ├── user-form.css
     │   │   └── user-form.ts
     │   ├── user-list/
     │   │   ├── user-list.html
     │   │   ├── user-list.css
     │   │   └── user-list.ts
     │   ├── unsaved-user-guard.ts
     │   ├── user-client.ts
     │   └── user.ts
     │
     ├── landing/
     │   ├── landing.html
     │   ├── landing.css
     │   └── landing.ts
     │
     ├── main-menu/
     │   ├── main-menu.html
     │   ├── main-menu.css
     │   └── main-menu.ts
     │
     ├── app.config.ts
     ├── app.routes.ts
     ├── app.css
     └── app.html
```

---

## 🚀 Instalación y ejecución
Clonar el repositorio
git clone https://github.com/SolSalvia/Bibliotecar.git

cd bibliotecar

npm install

json-server --watch db.json --port 3000

ng serve -o

---

## 🔎 Funcionalidades

### 📘 Libros
- Listado completo de libros  
- Alta, edición y eliminación  
- Detalle con todos los atributos  
- Validaciones de formulario  
- Confirmación antes de borrar  

### 🧾 Préstamos
- Registro de préstamo asociando libro y usuario  
- Listado con filtrado por estado  
- Detalle del préstamo  
- Edición y eliminación  
- Confirmación antes de borrar  

### ↩️ Devoluciones
- Registro de devolución  
- Lista de devoluciones realizadas  
- Vinculación automática al préstamo correspondiente  

### 👤 Usuarios
- Alta, baja y edición de usuarios  
- Listado ordenado  
- Vista detallada del usuario  

---

## 🧭 Rutas del sistema
  /inicio → Pantalla de bienvenida
  /menu → Menú principal
  /login → Iniciar Sesión
  /biblioteca → Lista de libros
  /biblioteca/:id → Detalle de un libro
  /biblioteca/agregar-libro → Alta de un libro
  /prestamos → Lista de préstamos
  /prestamos/agregar-prestamo → Registrar préstamo
  /prestamos/:id → Detalle del préstamo
  /devoluciones → Lista de devoluciones
  /devoluciones/agregar-devolucion → Registrar devolución
  /devoluciones/:id → Detalle de la devolución
  /usuarios → Lista de usuarios
  /usuarios/agregar-usuario → Alta
  /usuarios/:id → Detalle de usuario

---

## 🛡️ Guards
El proyecto utiliza distintos guards para mejorar la experiencia del usuario:

- **auth-guard.ts**  
  Protege rutas que requieren autenticación.

- **unsaved-form-guard.ts**, **unsaved-loan-guard.ts**, **unsaved-user-guard.ts**, **unsaved-bookReturns-guard.ts**  
  Evitan la pérdida de datos si el usuario intenta salir de un formulario con cambios sin guardar.

---

## 🔐 Autenticación
El sistema cuenta con un módulo de login que:

- Valida usuario mediante AuthService  
- Almacena sesión temporal  
- Restringe acceso mediante AuthGuard  
- Redirecciona automáticamente después del login  

---
## Link Proyecto en Jira
https://solsalvia3.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?atlOrigin=eyJpIjoiYjJlYjRiOWJiNDk4NDc3MGE2YjBkMmM1MmJiZTVlZDkiLCJwIjoiaiJ9


## 👥 Autores
- **Sol Aylén Salvia**
- **Stéfano López Auriemma**

---

