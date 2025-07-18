#!/bin/bash

# Asegúrate de que este script se ejecute con bash para la expansión de parámetros
# como ${COMMIT_HASH:0:7}
# Si no estás seguro, puedes llamarlo con 'bash /ruta/a/tu/script.sh' desde el hook.

# Obtener el hash del último commit
COMMIT_HASH=$(git rev-parse HEAD)

# Obtener el mensaje del último commit
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

# Obtener el diff del último commit
# IMPORTANTE: Obtener el diff del commit que ACABA de ocurrir
COMMIT_DIFF=$(git diff HEAD~1 HEAD)

# Preparar el prompt para Gemini
# Puedes ajustar el prompt según el nivel de detalle y formato que desees para tus apuntes.
COMANDO="Basado en el siguiente commit de Git, genera un apunte de estudio en formato Markdown que explique los cambios clave y su importancia para un curso de desarrollo, aplica tabulaciones y saltos de linea a los segmentos de codigo para una facil lectura. Incluye el mensaje del commit y un resumen del código.

Mensaje del Commit:
$COMMIT_MESSAGE

Cambios en el Código (diff):
$COMMIT_DIFF"

# --- Inicio de la generación de la respuesta de Gemini ---
# Envía el prompt a Gemini CLI y guarda la salida
# npx @google/gemini-cli -p "$COMANDO" podría requerir autenticación
# Asegúrate de que GEMINI_API_KEY esté configurada en tu entorno o en un archivo .env
# Usamos 'grep -v '```' para eliminar bloques de código que Gemini podría incluir por error fuera de un bloque de código Markdown
GEMINI_RESPONSE=$(npx @google/gemini-cli -p "$COMANDO" | grep -v '```')

# Si la respuesta de Gemini es vacía o muy corta, puedes añadir un mensaje predeterminado
if [[ -z "$GEMINI_RESPONSE" || "${#GEMINI_RESPONSE}" -lt 20 ]]; then
    GEMINI_RESPONSE="No se pudo generar un apunte detallado para este commit. Revisar el contenido del commit: $COMMIT_MESSAGE"
fi
# --- Fin de la generación de la respuesta de Gemini ---

# Definir la ruta relativa al repositorio para guardar las notas
# Vamos a usar un directorio oculto para mantenerlo un poco más organizado, revisar cambios de ruta
NOTES_DIR="/devel/NestBackEN/.study_notes"
mkdir -p "$NOTES_DIR" # Crea el directorio si no existe dentro del repositorio

# Generar un nombre de archivo único basado en el hash del commit original
# Esto vincula directamente la nota con el commit de origen
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SHORT_COMMIT_HASH=${COMMIT_HASH:0:7}
NOTE_FILE="$NOTES_DIR/${COMMIT_MESSAGE}_${TIMESTAMP}_${SHORT_COMMIT_HASH}.md"

# Escribir la respuesta de Gemini en el archivo de notas
# Puedes personalizar el encabezado de la nota
echo "# Apunte de Estudio para Commit: \`$SHORT_COMMIT_HASH\`" > "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "## Mensaje del Commit Original" >> "$NOTE_FILE"
echo "\`\`\`" >> "$NOTE_FILE"
echo "$COMMIT_MESSAGE" >> "$NOTE_FILE"
echo "\`\`\`" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "## Resumen de Gemini" >> "$NOTE_FILE"
echo "$GEMINI_RESPONSE" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "---" >> "$NOTE_FILE"
echo "*Este apunte fue generado automáticamente por Gemini CLI.*" >> "$NOTE_FILE"

echo "Apunte de estudio generado en: $NOTE_FILE"

# --- Comitear la nota ---
# Guardar el directorio de trabajo actual
ORIGINAL_DIR=$(pwd)

# Navegar a la raíz del repositorio
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT" || { echo "Error: No se pudo navegar a la raíz del repositorio."; exit 1; }

# Guardar la rama actual para volver a ella después
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Crear o cambiar a la rama de notas
git checkout -B study-notes # -B crea la rama si no existe o la reinicia si ya existe

# Añadir el archivo de la nota al index de Git
git add "$NOTE_FILE"

# Crear un directorio temporal para los hooks vacíos (para este commit en esta rama)
TEMP_HOOKS_DIR=$(mktemp -d)

# Crear un nuevo commit con el archivo de la nota en la rama 'study-notes'
GIT_DIR="$(git rev-parse --git-dir)" \
GIT_WORK_TREE="$REPO_ROOT" \
GIT_COMMITTER_DATE="$(git log -1 --format=%cd)" \
git -c core.hooksPath="$TEMP_HOOKS_DIR" commit -m "docs: Add study notes for commit $SHORT_COMMIT_HASH" --allow-empty

# Limpiar el directorio temporal de hooks
rmdir "$TEMP_HOOKS_DIR"

echo "Apunte de estudio comiteado en la rama 'study-notes'."

# Volver a la rama original
git checkout "$CURRENT_BRANCH"

# Volver al directorio original
cd "$ORIGINAL_DIR" || { echo "Error: No se pudo volver al directorio original."; exit 1; }
