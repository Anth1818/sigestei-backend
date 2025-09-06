const PORT = 3001;

const app = require('./app');

app.listen(PORT, () => {
	console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
