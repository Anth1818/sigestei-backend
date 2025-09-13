// Controlador de autenticación

const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(500).json({ error: 'Usuario no encontrado' });
    }
    // Verificar contraseña (asumiendo password_hash en la base)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Enviar token como cookie httpOnly
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000 // 1 hora
    });
    return res.status(200).json({
      message: 'Login exitoso',
      user: { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id  }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al autenticar usuario' });
  }
};

exports.register = (req, res) => {
  // Aquí iría la lógica real de registro
  // Por ejemplo, crear usuario en la base de datos
  res.json({ message: 'Registro exitoso (mock)' });
};
