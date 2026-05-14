# Lab 8 - Phishing y Evil Twin Awareness Simulation

## Arquitectura

### Flujo de simulación

Correo ficticio -> /phishing -> log evento -> /awareness -> /legitimo

La ruta raíz redirige automáticamente a `/phishing` y la página de concienciación usa un contador para llevar al portal legítimo, configurable con `NEXT_PUBLIC_LEGITIMATE_PORTAL`.

### Componentes

| Componente       | Puerto      | Descripción                              |
| ---------------- | ----------- | ---------------------------------------- |
| Next.js Frontend | 3000        | Portal simulado, página educativa, admin |
| NestJS Backend   | 3001        | API REST, registro de metadatos, email   |
| PostgreSQL       | 5432        | Base de datos de eventos e interacciones |
| MailHog (SMTP)   | 1025 / 8025 | Captura correos localmente sin enviarlos |

### Páginas del front

- `/` - Redirección directa al portal de phishing simulado
- `/phishing` - Portal de login simulado (evil twin) con registro de `PAGE_VISIT`, `FORM_SUBMIT` y `LINK_CLICK`
- `/awareness` - Página educativa con checklist y countdown de redirección
- `/legitimo` - Página legítima simulada
- `/admin` - Dashboard con logs, stats, purga segura y envío de correos cebo / formativos

## Inicio rápido (desarrollo local)

Ejecutar en terminal desde el root del repositorio:

```bash
docker-compose up --build
```

Luego acceder a:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MailHog UI: http://localhost:8025
- PostgreSQL: http://localhost:5432

## API Endpoints

| Método   | Ruta                  | Descripción                              |
| -------- | --------------------- | ---------------------------------------- |
| `POST`   | `/interactions`       | Registrar evento de interacción          |
| `GET`    | `/interactions`       | Listar todos los eventos                 |
| `GET`    | `/interactions/stats` | Estadísticas agregadas                   |
| `DELETE` | `/interactions/purge` | Eliminar todos los registros             |
| `POST`   | `/email/lure`         | Enviar correo de cebo al portal phishing |
| `POST`   | `/email/followup`     | Enviar correo educativo                  |

El envío de correo formativo también se dispara automáticamente cuando se registra un `FORM_SUBMIT` con correo válido.

### Ejemplo: registrar evento

```json
POST /interactions
{
  "sessionId": "uuid-generado-en-cliente",
  "action": "FORM_SUBMIT",
  "email": "usuario@lab.local"
}
```

Esto ocurre automáticamente desde la página evil twin.

### Ejemplo: enviar correo formativo

```json
POST /email/followup
{
  "to": "usuario@lab.local",
  "sessionId": "uuid-de-referencia"
}
```

También se puede hacer desde el panel del administrador.

## Mecanismo de privacidad

- La contraseña se descarta en el cliente antes de cualquier petición al backend, solo se registra el correo del participante si se necesita para el seguimiento educativo.
- IP y User-Agent se almacenan únicamente como hash SHA-256 irreversible
- El identificador de sesión se genera en el cliente y se guarda en `sessionStorage` como `sim_session_id`
- Endpoint `DELETE /interactions/purge` para eliminación segura de todos los registros
- MailHog captura correos localmente — nunca salen a internet

## Reflexión sobre el uso de IA en nuestro desarrollo

Como estudiantes, utilizamos IA para acelerar la implementación de este laboratorio, generando el andamiaje técnico (código de servidor, plantillas de correo, páginas web). Esto nos ha permitido reflexionar sobre cómo estas herramientas pueden tanto potenciar como limitar nuestro aprendizaje.

**Lo que nos resultó útil:**

- Acelerar la construcción de prototipos educativos complejos sin quedar atrapados en detalles de infraestructura
- Tener plantillas de código bien estructuradas que podemos analizar, entender y modificar
- Contar con buenas prácticas incorporadas desde el inicio (no almacenar credenciales, hash de datos sensibles)

**Lo que hemos aprendido como desafío:**

- No podemos simplemente entregar código generado por IA sin comprenderlo profundamente. Cada línea requiere auditoría y validación
- Hay riesgo real de aprendizaje superficial si dejamos que la IA resuelva todos los problemas cognitivos
- La IA reproduce patrones según sus restricciones; si no le damos instrucciones claras sobre seguridad, puede generar código vulnerable
- En un ejercicio sobre phishing, es crítico que la IA se vea como una herramienta de conciencia, nunca como un facilitador de ataques reales

**Lo que sacamos de esto:**

Entendemos que el verdadero valor no está en que el código "funcione", sino en saber por qué funciona. La IA es una herramienta para amplificar nuestras capacidades, no para reemplazar el pensamiento crítico. En ciberseguridad especialmente, la comprensión profunda es indispensable.
