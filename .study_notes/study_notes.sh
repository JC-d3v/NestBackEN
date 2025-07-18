#!/bin/bash

# version modificada Jorge

export HASH1=$1
# HASH1="68002b7"
export HASH2=$2
# HASH2="3052868"

echo "$HASH1 $HASH2"

# Obtener el diff del último commit
# COMMIT_DIFF=$(git diff --staged)
export COMMIT_DIFF=$(git diff $HASH1 $HASH2)

# Obtener el mensaje del último commit
# COMMIT_MESSAGE=$(git log -1 --pretty=%B)
export COMMIT_MESSAGE=$(git log -1 --pretty=format:%s "$HASH1")
export COMMIT_MESSAGE2=$(git log -1 --pretty=format:%s "$HASH2")
echo "COMMIT_MESSAGE => $COMMIT_MESSAGE => $COMMIT_MESSAGE2"


# Preparar el prompt para Gemini
export COMANDO="Basado en el siguiente commit de Git, genera un apunte de estudio en formato Markdown que explique los cambios clave y su importancia para un curso de desarrollo,aplica SmartyPants, tabulaciones y saltos de linea a los segmentos de codigo para una facil lectura, omite los cambios del contenido de la carpeta '.study_notes'.

Mensaje del Commit:
# $COMMIT_MESSAGE

Cambios en el Código (diff):
$COMMIT_DIFF"

# --- Inicio de la generación de la respuesta de Gemini ---
# GEMINI_RESPONSE=$(npx @google/gemini-cli -p "$COMANDO" | grep -v '```')
export RESPONSE=$(gemini -p "$COMANDO" | grep -v '```')

# if [[ -z "$GEMINI_RESPONSE" || "${#GEMINI_RESPONSE}" -lt 20 ]]; then
#     GEMINI_RESPONSE="No se pudo generar un apunte"
# fi
# --- Fin de la generación de la respuesta de Gemini ---

# Definir la ruta relativa al repositorio para guardar las notas

# ROOT_DIR=$(pwd)
# NOTES_DIR="$ROOT_DIR/.study_notes" # Asegúrate de que esta ruta sea la correcta
# mkdir -p "$NOTES_DIR" # Crea el directorio si no existe

# Generar un nombre de archivo único
# TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
# NOTE_FILENAME_SANITIZED=$(echo "$COMMIT_MESSAGE" | sed 's/[^a-zA-Z0-9_-]/_/g' | head -c 50)
# NOTE_FILENAME_SANITIZED=$(echo "Apuntes" | sed 's/[^a-zA-Z0-9_-]/_/g' | head -c 50)
# NOTE_FILE="$NOTES_DIR/${NOTE_FILENAME_SANITIZED}_${TIMESTAMP}.md"
# NOTE_FILE="$NOTES_DIR/${NOTE_FILENAME_SANITIZED}.md"

# Escribir la respuesta de Gemini en el archivo de notas
# echo "" >> "$NOTE_FILE"
# echo "## Mensaje del Commit Original" >> "$NOTE_FILE"
# echo "\`\`\`" >> "$NOTE_FILE"
# echo "$COMMIT_MESSAGE" >> "$NOTE_FILE"
# echo "\`\`\`" >> "$NOTE_FILE"
# echo "" >> "$NOTE_FILE"
# echo "## Resumen de apuntes" >> "$NOTE_FILE"
# echo "$GEMINI_RESPONSE" >> "$NOTE_FILE"
# echo "" >> "$NOTE_FILE"
# echo "---" >> "$NOTE_FILE"
# echo "*Este apunte fue generado automáticamente.*" >> "$NOTE_FILE"
# echo "COMMIT_MESSAGE" >> "$NOTE_FILE"
# echo "$COMMIT_MESSAGE" >> "$NOTE_FILE"

# echo "Apunte de estudio generado en: $NOTE_FILE"

# --- Proceso de comitear y luego deshacer el commit de la nota ---

# Guardar el directorio de trabajo actual
# ORIGINAL_DIR=$(pwd)

# Navegar a la raíz del repositorio
# REPO_ROOT=$(git rev-parse --show-toplevel)
# cd "$REPO_ROOT" || { echo "Error: No se pudo navegar a la raíz del repositorio."; exit 1; }

# Añadir el archivo de la nota al index de Git
# git add "$NOTE_FILE"

# Comprobar si hay cambios en el staging area (además de la nota)
# Si solo está la nota, el siguiente commit será solo para la nota.
# Si hay otros cambios, se comitearán junto con la nota.
# Esto es crucial: el 'git reset --soft HEAD~1' deshará el ÚLTIMO commit,
# que debe ser el de la nota. Si hay otros commits, no funcionará como esperas.

# Crear un directorio temporal para los hooks vacíos para evitar el bucle
# TEMP_HOOKS_DIR=$(mktemp -d)

# Crear un nuevo commit con el archivo de la nota
# echo "Creando commit temporal para la nota..."
# GIT_DIR="$(git rev-parse --git-dir)" \
# GIT_WORK_TREE="$REPO_ROOT" \

# Limpiar el directorio temporal de hooks
# rmdir "$TEMP_HOOKS_DIR"

# echo "Commit temporal creado. Ahora desandando el commit..."

# Deshacer el último commit (el de la nota) pero mantener los cambios en el staging area
# Esto mueve HEAD un commit hacia atrás, pero deja los archivos de ese commit en el índice.
# ¡Asegúrate de que este es el ÚLTIMO commit para que funcione correctamente!
# git reset --soft HEAD~1

# echo "Commit temporal deshecho. Los archivos de la nota están en el staging area."
# echo "Puedes verlos con 'git status'."
# echo "Si no quieres que la nota se incluya en el próximo commit, usa 'git reset HEAD \"$NOTE_FILE\"'."
# echo "Se recomienda añadir '/.study_notes/' a tu .gitignore para evitar tracking futuro."

# Volver al directorio original
# cd "$ORIGINAL_DIR" || { echo "Error: No se pudo volver al directorio original."; exit 1; }

export LARGO=${#RESPONSE}
echo "Largo $LARGO"