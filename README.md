# Lab 8 - Phishing y Evil Twin Awareness Simulation

## Arquitectura

### Flujo de simulación

Correo ficticio -> /phishing -> log evento -> /awareness -> portal legítimo

### Componentes

| Componente       | Puerto      | Descripción                              |
| ---------------- | ----------- | ---------------------------------------- |
| Next.js Frontend | 3000        | Portal simulado, página educativa, admin |
| NestJS Backend   | 3001        | API REST, registro de metadatos, email   |
| MailHog (SMTP)   | 1025 / 8025 | Captura correos localmente sin enviarlos |

### Páginas del front

- `/phishing` - Portal de login simulado (evil twin)
- `/awareness` - Página educativa + countdown de redirección
- `/legitimo` - Página legítima simulada
- `/admin` - Dashboard con logs, stats y envío de correos

## Inicio rápido (desarrollo local)

Ejecutar en terminal desde el root del repositorio:

```bash
docker-compose up --build
```

Luego acceder a:

- Frontend: http://localhost:3000
- MailHog UI: http://localhost:8025
- API: http://localhost:3001

## API Endpoints

| Método   | Ruta                  | Descripción                     |
| -------- | --------------------- | ------------------------------- |
| `POST`   | `/interactions`       | Registrar evento de interacción |
| `GET`    | `/interactions`       | Listar todos los eventos        |
| `GET`    | `/interactions/stats` | Estadísticas agregadas          |
| `DELETE` | `/interactions/purge` | Eliminar todos los registros    |
| `POST`   | `/email/followup`     | Enviar correo educativo         |

### Ejemplo: registrar evento

```json
POST /interactions
{
  "sessionId": "uuid-generado-en-cliente",
  "action": "FORM_SUBMIT"
}
```

### Ejemplo: enviar correo formativo

```json
POST /email/followup
{
  "to": "usuario@lab.local",
  "sessionId": "uuid-de-referencia"
}
```

## Mecanismo de privacidad

- Las credenciales son **descartadas en el cliente** antes de cualquier petición al backend
- IP y User-Agent se almacenan únicamente como **hash SHA-256 irreversible**
- Endpoint `DELETE /interactions/purge` para eliminación segura de todos los registros
- MailHog captura correos **localmente** — nunca salen a internet

## Reflexión sobre el uso de IA en contextos académicos

El uso de modelos de lenguaje en contextos académicos presenta tanto oportunidades como responsabilidades. En este laboratorio, la IA fue utilizada para generar el andamiaje técnico (código de servidor, plantillas de correo, páginas web).

**Oportunidades:**

- Acelerar la implementación de prototipos educativos complejos
- Generar plantillas de código que el estudiante puede analizar, modificar y aprender de ellas
- Asegurar buenas prácticas (no almacenar contraseñas, hashing de datos) por defecto

**Responsabilidades y riesgos:**

- El estudiante debe comprender y auditar el código generado, no simplemente entregarlo
- Existe el riesgo de aprendizaje superficial si la IA hace todo el trabajo cognitivo
- Los modelos pueden reproducir patrones inseguros si no se les dan restricciones claras
- En ejercicios de seguridad, la IA debe operar bajo el principio de "herramienta de concientización", nunca de "herramienta de ataque"

**Principio rector:** La IA en academia debe amplificar la comprensión del estudiante, no reemplazarla. El valor está en saber _por qué_ funciona el código, no solo en que funcione.
