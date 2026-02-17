import app from './app';

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
    console.log(`Servidor Express escuchando en http://${HOST}:${PORT}`);
});