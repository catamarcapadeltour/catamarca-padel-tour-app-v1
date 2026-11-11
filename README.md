# Catamarca Pádel Tour

Aplicación web responsive/PWA para la organización del Catamarca Pádel Tour. El primer scaffold presenta la competencia, torneos, partidos, posiciones y accesos de jugadores, inspirado en la página de Copa Competencia compartida como referencia.

## Tecnología

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (dependencia incluida; conexión pendiente de configurar)
- Manifest PWA para instalación en dispositivos móviles

## Ejecutar localmente

Requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## Configuración pendiente para conectar Supabase

Crear un proyecto Supabase y configurar en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica
```

No guardar claves secretas en el cliente ni subir `.env.local` al repositorio.

## Estado del MVP

La interfaz inicial usa datos de ejemplo. Aún faltan la autenticación real, las tablas y políticas RLS de Supabase, el alta/validación de parejas, la administración de torneos y la persistencia de partidos/resultados. Las reglas de puntuación y los datos deportivos deben validarse con la organización antes de automatizarlos.
