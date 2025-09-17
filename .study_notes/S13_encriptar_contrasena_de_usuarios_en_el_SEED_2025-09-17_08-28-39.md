## Resumen de avance
Claro, aquí tienes el apunte de estudio basado en el commit.

# S13: Encriptar Contraseñas de Usuarios en el SEED

En esta sección, se implementa una mejora de seguridad crucial en nuestros datos de prueba (seed data): la encriptación de las contraseñas de los usuarios.

Almacenar contraseñas en texto plano es una vulnerabilidad de seguridad grave. Si la base de datos se viera comprometida, las credenciales de los usuarios quedarían expuestas. Para mitigar este riesgo, utilizamos la librería `bcrypt` para generar un “hash” de cada contraseña antes de guardarla.

### Cambios Clave en el Código

**1. Importación de `bcrypt`**

Primero, se importa la librería `bcrypt` en el archivo de datos iniciales para tener acceso a sus funciones de encriptación.

import * as bcrypt from 'bcrypt';

**2. Hashing de Contraseñas**

Se actualiza el objeto `initialData` para reemplazar las contraseñas en texto plano por su versión hasheada.

**Antes:** Las contraseñas estaban visibles como texto simple.

{
    email: 'jorge1@gmail.com',
    fullName: 'User One',
    password: 'pass123',
    roles: ['ADMIN']
},

**Después:** Se utiliza `bcrypt.hashSync()` para encriptar la contraseña de forma síncrona.

{
    email: 'jorge1@gmail.com',
    fullName: 'User One',
    password: bcrypt.hashSync('Pass123.', 10),
    roles: ['ADMIN']
},

### ¿Qué hace `bcrypt.hashSync()`?

-   **`'Pass123.'`**: Es la contraseña en texto plano que se va a encriptar.
-   **`10`**: Representa las "rondas de sal" (salt rounds). Este número define la complejidad computacional del hash. Un valor más alto incrementa el tiempo necesario para calcular el hash, haciendo que los ataques de fuerza bruta sean significativamente más difíciles y costosos.

### Importancia

Este cambio asegura que, desde el momento de la inserción, las contraseñas en la base de datos no son legibles por humanos. Es un paso fundamental para proteger la integridad y seguridad de las cuentas de usuario en cualquier aplicación.
