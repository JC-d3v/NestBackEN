#!/bin/bash

# Este script guarda en un archivo las notas generadas por crea_notas.sh

# 1. Verificar que las variables necesarias existen (pasadas por 'source')
if [ -z "$COMMIT_MESSAGE" ] || [ -z "$RESPONSE" ] || [ -z "$COMMIT_DIFF" ]; then
    echo "Error: Las variables necesarias no están definidas."
    echo "Asegúrate de ejecutar este script a través de 'generar_nota.sh'."
    exit 1
fi

echo "Guardando notas para el commit con mensaje: $COMMIT_MESSAGE"

# 2. Determinar el directorio raíz del repositorio Git dinámicamente
ROOT_DIR=$(git rev-parse --show-toplevel)
if [ -z "$ROOT_DIR" ]; then
    echo "Error: No se está dentro de un repositorio de Git."
    exit 1
fi

NOTES_DIR="$ROOT_DIR/.study_notes" 
mkdir -p "$NOTES_DIR"

# Generar un nombre de archivo único
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
NOTE_FILENAME_SANITIZED=$(echo "${COMMIT_MESSAGE}" | head -n 1 | sed 's/[^a-zA-Z0-9_-]/_/g' | head -c 50)
echo "NOTE_FILENAME_SANITIZED => $NOTE_FILENAME_SANITIZED"

NOTE_FILE="$NOTES_DIR/${NOTE_FILENAME_SANITIZED}_${TIMESTAMP}.md"

# 3. Escribir la nota en el archivo con formato Markdown
echo "# Apunte de Estudio: ${NOTE_FILENAME_SANITIZED}" > "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "## Resumen" >> "$NOTE_FILE"
echo "${RESPONSE}" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "## Diff del Commit" >> "$NOTE_FILE"
echo '```diff' >> "$NOTE_FILE"
echo "${COMMIT_DIFF}" >> "$NOTE_FILE"
echo '```' >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "---" >> "$NOTE_FILE"
echo "*Este apunte fue generado automáticamente.*" >> "$NOTE_FILE"

echo "Apunte de estudio generado en: $NOTE_FILE"
