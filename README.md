# Catamarca Pádel Tour

Aplicación web responsive/PWA para la organización del Catamarca Pádel Tour. El diseño inicial toma como referencia la página de Copa Competencia compartida por la organización. Incluye una portada de competencia y los primeros flujos de cuenta individual.

## Tecnología

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth y PostgreSQL (configuración requerida)
- Manifest PWA para instalación en dispositivos móviles

## Ejecutar localmente

Requiere Node.js 20 o posterior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000.

## Configuración de Supabase

1. Crear un proyecto en Supabase.
2. En SQL Editor, ejecutar `supabase/schema.sql`.
3. En Project Settings → API, copiar Project URL y la clave `anon`/publishable al `.env.local`.
4. Configurar Authentication → URL Configuration con la URL local/de producción y redirecciones permitidas.
5. Registrar una cuenta de organización y asignarle rol manualmente desde SQL confiable siguiendo el comentario al final del esquema. No se debe aceptar `organizer` desde los datos de registro.

`.env.local` no debe subirse al repositorio. Nunca exponer la `service_role` key en código de navegador.

## Funcionalidad implementada

- Portada responsive con torneos, partidos y posiciones de demostración.
- Registro/login con Supabase Auth.
- Perfil individual con edición de nombre, teléfono y localidad.
- Protección de `/mi-cuenta` mediante middleware.
- Esquema base para parejas (dos perfiles), torneos, categorías, zonas, partidos, resultados y sponsors; RLS activado.

## Próximos pasos del MVP

- Validar con la organización reglas deportivas y sistema de puntaje.
- Crear flujos y políticas de organización para alta de torneos, aprobación de parejas, armado de zonas y carga de resultados.
- Reemplazar datos de muestra por consultas Supabase y probar RLS con cuentas de jugador/organización.
- Completar manifest/iconos y pruebas en dispositivos antes de publicar.

Las estadísticas que aparecen en la portada son ilustrativas y deben cambiarse por datos verificados al conectar la base.
