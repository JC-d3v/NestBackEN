#!/bin/bash

# Script orquestador para generar una nota a partir de dos hashes de commit.

# 1. Validar que se recibieron los dos hashes como argumentos.
if [ "$#" -ne 2 ]; then
    echo "Error: Se requieren dos hashes de commit como argumentos."
    echo "Uso: $0 <hash1> <hash2>"
    exit 1
fi

# Obtener la ruta del directorio donde se encuentra este script.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 2. Cargar las variables desde crea_notas.sh en el entorno actual usando 'source'.
source "$SCRIPT_DIR/crea_notas.sh" "$1" "$2"

# 3. Ejecutar graba_notas.sh, que ahora tendrá acceso a las variables.
"$SCRIPT_DIR/guarda_notas.sh"