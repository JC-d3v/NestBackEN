## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S13: Encriptación de Contraseñas

En esta sección, se implementa una de las prácticas de seguridad más importantes en cualquier aplicación: la **encriptación de contraseñas**. Nunca se deben almacenar las contraseñas de los usuarios como texto plano en la base de datos. Para realizar esta tarea, se utiliza la librería `bcrypt`.

### 1. Instalación de Dependencias

El primer paso es añadir `bcrypt` y sus correspondientes tipos de TypeScript al proyecto. Esto se refleja en el archivo `package.json`.

**`package.json`**
{
	// ...
	"dependencies": {
		// ...
		"@nestjs/typeorm": "^11.0.0",
		"bcrypt": "^6.0.0", // <-- Se añade bcrypt
		"class-transformer": "^0.5.1",
		// ...
	},
	"devDependencies": {
		// ...
		"@nestjs/testing": "^10.0.0",
		"@types/bcrypt": "^6.0.0", // <-- Se añaden los tipos para TypeScript
		"@types/express": "^5.0.0",
		// ...
	}
}

*   **`bcrypt`**: Es una librería robusta y popular para realizar el "hashing" de contraseñas. Utiliza un algoritmo de cifrado (Blowfish) que es computacionalmente costoso, dificultando los ataques de fuerza bruta.
*   **`@types/bcrypt`**: Proporciona las definiciones de tipos necesarias para que TypeScript entienda la librería `bcrypt` y ofrezca un mejor autocompletado y seguridad de tipos.

### 2. Lógica de Encriptación en el Servicio

El núcleo de la implementación se encuentra en el `AuthService`, específicamente en el método `create`.

**`04-teslo-shop/src/auth/auth.service.ts`**
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'; // <-- 1. Importamos bcrypt

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

	// ... (constructor)

	async create(createUserDto: CreateUserDto) {

		try {

			// 2. Desestructuramos el DTO para separar el password
			const { password, ...userData } = createUserDto

			const user = this.userRepository.create({
				...userData,
				// 3. Encriptamos la contraseña
				password: bcrypt.hashSync(password, 10)
			});

			await this.userRepository.save(user)

			// 4. Eliminamos el password del objeto de respuesta
			delete user.password;

			return user;
			// TODO: Retornar el JWT de accesso

		} catch (error) {
			this.handleDbExceptions(error)
		}
	}
	// ...
}

#### Puntos Clave del Código:

1.  **Importación**: Se importa la librería `bcrypt`.
2.  **Desestructuración**: Se extrae la `password` del `createUserDto` y se guarda el resto de la información en la variable `userData`. Esto facilita el manejo de los datos.
3.  **Hashing de la Contraseña**:
    *   Se utiliza `bcrypt.hashSync(password, 10)`.
    *   `hashSync` es la versión síncrona de la función de hashing.
    *   El segundo argumento, `10`, se conoce como "salt rounds" (rondas de sal). Define el costo computacional del hashing. Un número mayor implica un hash más seguro pero también un proceso más lento. `10` es un valor estándar y seguro.
4.  **Eliminación de la Contraseña**:
    *   Después de guardar el usuario en la base de datos, la línea `delete user.password;` elimina la propiedad `password` del objeto `user` que se va a retornar en la respuesta de la API.
    *   **¡Esto es crucial!** Nunca se debe exponer ni siquiera la contraseña encriptada en las respuestas de la API. Al eliminarla, nos aseguramos de que esta información sensible no salga del servidor.
