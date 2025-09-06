const userRepository = require('../repositories/userRepository');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
