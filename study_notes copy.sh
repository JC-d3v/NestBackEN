#!/bin/bash

# Obtener el hash del último commit
COMMIT_HASH=$(git rev-parse HEAD)

# Obtener el mensaje del último commit
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

# Obtener el diff del último commit
COMMIT_DIFF=$(git diff --staged)

# Preparar el prompt para Gemini
# Puedes ajustar el prompt según el nivel de detalle y formato que desees para tus apuntes.
COMANDO="Basado en el siguiente commit de Git, genera un apunte de estudio en formato Markdown que explique los cambios clave y su importancia para un curso de desarrollo, aplica tabulaciones y saltos de linea a los segmentos de codigo para una facil lectura. Incluye el mensaje del commit y un resumen del código.

Mensaje del Commit:
$COMMIT_MESSAGE

Cambios en el Código (diff):
$COMMIT_DIFF"

# Enviar el prompt a Gemini CLI y guardar la salida
# Asegúrate de que la salida de Gemini no contenga caracteres que rompan el comando.
# Usamos 'grep -v '```' para eliminar bloques de código si Gemini los incluye,
# ajusta según sea necesario para el formato deseado.
GEMINI_RESPONSE=$(npx @google/gemini-cli -p "$COMANDO" | grep -v '```')

# Definir la ruta del archivo de notas
NOTES_DIR="/devel/NestBackEN/NotasDeEstudioDelCurso"
mkdir -p "$NOTES_DIR" # Crea el directorio si no existe

# Generar un nombre de archivo único basado en la fecha y hora
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
NOTE_FILE="$NOTES_DIR/apuntes_${TIMESTAMP}_${COMMIT_HASH:0:7}.md" # Nombre corto del hash

# Escribir la respuesta de Gemini en el archivo de notas
echo "--- Apunte de Estudio del Commit ($COMMIT_HASH) ---" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "$GEMINI_RESPONSE" >> "$NOTE_FILE"
echo "" >> "$NOTE_FILE"
echo "--- Fin del Apunte ---" >> "$NOTE_FILE"

echo "Apunte de estudio guardado en: $NOTE_FILE"
