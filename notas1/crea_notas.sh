#!/bin/bash

# Este script prepara las variables necesarias para crear una nota de estudio
# basada en la diferencia entre dos commits.

# Validar que se recibieron dos argumentos (protección si se ejecuta directamente)
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Error: Se requieren dos hashes de commit como argumentos."
  echo "Este script debe ser llamado por 'generar_nota.sh' o usando 'source'."
  exit 1
fi

export HASH1=$1
export HASH2=$2

# Obtiene el mensaje del primer commit usando el HASH1
export COMMIT_MESSAGE=$(git log -1 --pretty=%B "$HASH1")

# Obtiene la diferencia entre los dos commits
export COMMIT_DIFF=$(git diff "$HASH1" "$HASH2")

echo "mensaje del commit => $COMMIT_MESSAGE"
export RESPONSE="Resumen autogenerado para el commit: ${COMMIT_MESSAGE}" # Simulación de una respuesta