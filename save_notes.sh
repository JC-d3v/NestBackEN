#!/bin/bash

# version modificada Jorge part II
# Asegúrate de que este script se ejecute con bash para la expansión de parámetros

# echo " HASHES => $HASH1 $HASH2"

# export COMMIT_MESSAGE=$(git log -1 --pretty=format:%s "$HASH1")
# echo $COMMIT_MESSAGE

export ROOT_DIR="/devel/NestBackEN"

# Asegúrate de que esta ruta sea la correcta
export NOTES_DIR="$ROOT_DIR/.study_notes" 

# Generar un nombre de archivo único
export TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# NOTE_FILENAME_SANITIZED=$(echo "TEMPO" | sed 's/[^a-zA-Z0-9_-]/_/g' | head -c 50)
export NOTE_FILENAME_SANITIZED=$(echo "${COMMIT_MESSAGE}" | sed 's/[^a-zA-Z0-9_-]/_/g' | head -c 50)
# echo "NOTE_FILENAME_SANITIZED => $NOTE_FILENAME_SANITIZED"

export NOTE_FILE="$NOTES_DIR/${NOTE_FILENAME_SANITIZED}_${TIMESTAMP}.md"

# echo $RESPONSE

# Escribir la respuesta de Gemini en el archivo de notas
echo "## Resumen de avance" >> "$NOTE_FILE"
echo "${RESPONSE}" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "---" >> "$NOTE_FILE"
echo "*Este apunte fue generado automáticamente.*" >> "$NOTE_FILE"

echo "Apunte de estudio generado en: $NOTE_FILE"

# --- Proceso de comitear y luego deshacer el commit de la nota ---

# Añadir el archivo de la nota al index de Git
git add "$NOTE_FILE"
