# ---OPCION A Obtener el mensaje del último commit
export COMMIT_MESSAGE=$(git log -1 --pretty=%B)

export COMMIT_DIFF=$(git diff --staged)
# echo "mensaje del commit => $COMMIT_MESSAGE"

# Preparar el prompt para Gemini
export COMANDO="Analiza el siguiente commit de Git y genera exclusivamente el contenido en formato Markdown para un apunte de estudio. El apunte debe explicar los cambios clave y su importancia. En los segmentos de código, aplica tabulaciones y saltos de línea para una fácil lectura. Omite cualquier cambio relacionado con la carpeta '.study_notes'. No intentes escribir un archivo, solo devuelve el texto del apunte.

Mensaje del Commit:
# $COMMIT_MESSAGE

Cambios en el Código (diff):
$COMMIT_DIFF"

# --- Inicio de la generación de la respuesta de Gemini ---
# Al hacer el prompt más específico, es posible que el `grep` ya no sea necesario.
# Prueba sin él primero para ver la salida completa de Gemini.
export RESPONSE=$(gemini -p "$COMANDO")

