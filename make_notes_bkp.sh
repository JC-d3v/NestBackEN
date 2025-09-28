# ---OPCION A Obtener el mensaje del último commit
export COMMIT_MESSAGE=$(git log -1 --pretty=%B)

export COMMIT_DIFF=$(git diff --staged)
# echo "mensaje del commit => $COMMIT_MESSAGE"

# Preparar el prompt para Gemini
export COMANDO="Basado en el siguiente commit de Git, genera un apunte de estudio en formato Markdown que explique los cambios clave y su importancia para un curso de desarrollo,aplica SmartyPants, tabulaciones y saltos de linea a los segmentos de codigo para una facil lectura, omite los cambios del contenido de la carpeta '.study_notes'.

Mensaje del Commit:
# $COMMIT_MESSAGE

Cambios en el Código (diff):
$COMMIT_DIFF"

# --- Inicio de la generación de la respuesta de Gemini ---
# RESPONSE=$(npx @google/gemini-cli -p "$COMANDO" | grep -v '```')
export RESPONSE=$(gemini -p "$COMANDO" | grep -v '```')
