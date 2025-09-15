import app from './app';

const PORT = 3001;

app.listen(PORT, () => {
	console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
