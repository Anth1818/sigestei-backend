# Troubleshooting: Cookies no se generan en Producción

## Cambios realizados en el Backend

### 1. Controlador de Autenticación (`auth.controller.ts`)
- ✅ Configuración de `sameSite: 'none'` en producción
- ✅ `secure: true` en producción (requiere HTTPS)
- ✅ `path: '/'` explícito
- ✅ Token también enviado en respuesta JSON como fallback
- ✅ Logs de debugging para verificar configuración

### 2. Configuración CORS (`app.ts`)
- ✅ `credentials: true` habilitado
- ✅ `exposedHeaders: ['set-cookie']` agregado
- ✅ Logs para debugging de origins

## Verificaciones Necesarias

### Backend (Railway/Servidor)

1. **Variable de entorno `NODE_ENV`**
   ```bash
   NODE_ENV=production
   ```
   ⚠️ Debe estar en PRODUCCIÓN para que `secure: true` y `sameSite: 'none'` se activen

2. **HTTPS activo**
   - ✅ Railway proporciona HTTPS automáticamente
   - Verifica que tu URL sea `https://`

3. **ALLOWED_ORIGINS correcto**
   ```bash
   ALLOWED_ORIGINS="https://sigestei.vercel.app,https://tu-dominio.com"
   ```
   ⚠️ NO incluir slash al final, NO mezclar http/https

### Frontend (Vercel)

1. **Fetch/Axios con credentials**
   
   **Con Fetch:**
   ```javascript
   fetch('https://tu-api-railway.up.railway.app/api/auth/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     credentials: 'include', // ⚠️ CRÍTICO
     body: JSON.stringify({ email, password })
   })
   ```

   **Con Axios:**
   ```javascript
   // Configuración global (en el archivo principal)
   axios.defaults.withCredentials = true;

   // O en cada request
   axios.post('https://tu-api-railway.up.railway.app/api/auth/login', 
     { email, password },
     { withCredentials: true }
   )
   ```

2. **NextJS específico**
   
   Si usas Next.js, configura en `next.config.js`:
   ```javascript
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'https://tu-api-railway.up.railway.app/api/:path*',
         },
       ]
     },
   }
   ```

   Y usa:
   ```javascript
   fetch('/api/auth/login', {
     method: 'POST',
     credentials: 'include',
     // ...
   })
   ```

## Debugging en Producción

### Ver logs del backend
Los logs mostrarán:
```
🌐 Allowed Origins: [ 'https://sigestei.vercel.app' ]
🔍 Checking origin: https://sigestei.vercel.app
✅ Origin allowed: https://sigestei.vercel.app
🍪 Setting cookie with options: { httpOnly: true, secure: true, ... }
🌍 NODE_ENV: production
🔒 Secure: true
🔗 SameSite: none
```

### Verificar en el navegador (DevTools)

1. **Network Tab**
   - Busca la petición de login
   - En la respuesta, verifica el header `Set-Cookie`
   - Debe verse algo como:
     ```
     Set-Cookie: auth-token=eyJhbG...; Path=/; HttpOnly; Secure; SameSite=None
     ```

2. **Application/Storage Tab**
   - Ve a "Cookies"
   - Busca el dominio de tu API
   - Debe aparecer `auth-token`

3. **Console Tab**
   - Verifica que no haya errores de CORS
   - No debe haber: "blocked by CORS policy"

## Solución Alternativa: localStorage

Si las cookies siguen sin funcionar (restricciones del navegador, etc.), usa el token del response:

```javascript
// Login
const response = await fetch('https://api.../login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('auth-token', data.token); // Guardar en localStorage

// Luego en cada request protegido
fetch('https://api.../users', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
  }
})
```

**Y modifica el middleware de auth para aceptar ambos:**

```typescript
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Intentar obtener de cookie primero
  let token = req.cookies['auth-token'];
  
  // Si no hay cookie, intentar del header Authorization
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
```

## Checklist Final

- [ ] `NODE_ENV=production` en Railway
- [ ] Backend en HTTPS
- [ ] `ALLOWED_ORIGINS` incluye el dominio exacto del frontend
- [ ] Frontend usa `credentials: 'include'` o `withCredentials: true`
- [ ] Revisar logs del backend para confirmar configuración
- [ ] Verificar DevTools que el header `Set-Cookie` se está enviando
- [ ] Probar con la solución alternativa de localStorage si todo falla

## Contacto

Si sigues teniendo problemas, comparte:
1. Logs del backend (los que empiezan con 🍪 🌐 🔍)
2. Screenshot del Network tab mostrando los headers de respuesta
3. URL del backend y frontend
