# Nombre del Proyecto

SISTEMA DE GESTIÓN DE TALLER MECÁNICO

## Integrantes

`Trabajo individual realizado por Emanuel Chiletti`.

---

# Descripción Técnica

## Propósito del Desarrollo

El propósito de la aplicación es desarrollar un sistema web que permita gestionar de manera eficiente las operaciones de un taller de chapa y pintura automotriz. La herramienta busca centralizar la información relacionada con clientes, vehículos y trabajos realizados, facilitando el seguimiento de cada reparación a lo largo de sus distintas etapas.
El alcance del sistema incluye la gestión de órdenes de trabajo, el control del estado de los vehículos (en espera, en reparación,finalizado), la administración de clientes y vehículos, y la posibilidad de registrar trabajos asociados a compañías de seguros, incluyendo datos relevantes como el número de siniestro, estado de aprobación y monto autorizado.
El sistema está orientado a brindar una solución funcional, clara y accesible, sin contemplar integraciones externas complejas, pero permitiendo una base sólida para futuras ampliaciones.

## Problemática que Resuelve

En muchos talleres de chapa y pintura, la gestión de trabajos se realiza de forma manual o mediante herramientas no especializadas, lo que genera desorganización, pérdida de información y dificultades para realizar un seguimiento preciso del estado de los vehículos.
Además, cuando intervienen compañías de seguros, el proceso se vuelve más complejo debido a la necesidad de gestionar aprobaciones, montos autorizados y estados de los siniestros, lo cual suele manejarse de manera informal o descentralizada.
Esta aplicación busca resolver estas problemáticas mediante la digitalización y centralización de la información, permitiendo:

* Un control claro del estado de cada trabajo
* Mejor organización de los procesos internos del taller
* Registro estructurado de trabajos vinculados a seguros
* Acceso rápido y confiable a la información de clientes y vehículos

## Perfil de Usuario

El sistema está dirigido principalmente a:

* Dueños de talleres de chapa y pintura
* Empleados administrativos del taller
* Personal encargado de la gestión de trabajos y atención al cliente

Los usuarios poseen conocimientos básicos en el uso de computadoras y aplicaciones web, por lo que la interfaz del sistema está diseñada para ser intuitiva, simple y de fácil navegación, permitiendo su uso en entornos de trabajo dinámicos como un taller.
No está orientado a usuarios finales (clientes), sino al uso interno del taller para mejorar la organización y gestión operativa.

---

# Arquitectura del Proyecto

## Estructura General

El proyecto está organizado siguiendo una arquitectura modular basada en componentes reutilizables.

```bash
src/
 ├── assets/           # Recursos estáticos
 ├── components/       # Componentes reutilizables
 ├── pages/            # Vistas principales
 ├── routes/           # Configuración de rutas
 ├── services/         # Lógica de consumo de APIs
 ├── hooks/            # Hooks personalizados
 ├── utils/            # Funciones auxiliares
 ├── styles/           # Estilos globales
 └── main.jsx          # Punto de entrada principal
```

## Organización de Componentes

La aplicación se estructura mediante componentes desacoplados y reutilizables, permitiendo:

* Escalabilidad.
* Mantenimiento simplificado.
* Reutilización de lógica visual y funcional.
* Separación clara de responsabilidades.

El frontend consume servicios mediante una capa dedicada (`services/`) para mantener desacoplada la lógica de negocio de la interfaz.

---

# Objetivos y Tecnologías

## Objetivos Alcanzados

Durante esta etapa del desarrollo se lograron los siguientes objetivos:

* Implementación de la estructura base del proyecto.
* Configuración del entorno de desarrollo.
* Desarrollo de componentes reutilizables.
* Implementación de navegación y rutas.
* Integración de estilos responsivos.
* Organización modular del código.

## Stack Tecnológico

### Frontend

* React
* Vite
* TailwindCSS
* Shadcn/UI
* React Router DOM

### Herramientas de Desarrollo

* Node.js
* npm
* Git
* GitHub
* ESLint
* Prettier

### Diseño y UI

* TailwindCSS para estilos utilitarios.
* Shadcn/UI para componentes reutilizables.
* Diseño responsive adaptable a dispositivos móviles.

---

# Guía de Instalación

## Requisitos Previos

Antes de ejecutar el proyecto, asegurarse de tener instalado:

* Node.js (versión recomendada: 18 o superior)
* npm o yarn
* Git

## Clonar el Repositorio

```bash
git clone https://github.com/emaa95/trabajo-final-tudai.git
```

## Ingresar al Proyecto

```bash
cd trabajo-final-tudai
```

## Instalar Dependencias

```bash
npm install
```

## Ejecutar el Proyecto en Desarrollo

```bash
npm run dev
```

## Compilar para Producción

```bash
npm run build
```

## Vista Previa de Producción

```bash
npm run preview
```

---

# Estado del Proyecto

El proyecto se encuentra actualmente en etapa de desarrollo/implementación del MVP.

Las funcionalidades implementadas corresponden a los requerimientos prioritarios definidos durante la fase de análisis.

---

# Consideraciones Finales

Toda la documentación funcional y técnica solicitada para esta entrega se encuentra centralizada exclusivamente dentro de este archivo `README.md`, cumpliendo con los lineamientos establecidos para la presentación del proyecto.

