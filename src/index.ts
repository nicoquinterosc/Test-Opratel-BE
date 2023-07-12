import express from 'express';
import MenusRoutes from './routes/menus-routes';

const PORT = 3000;

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
    return res.status(200).json('pong');
})

app.use('/menus', MenusRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
