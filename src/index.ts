import express from 'express';
import MenusRoutes from './routes/menus-routes';
import UsersRoutes from './routes/users-routes';

const PORT = 3000;

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
    return res.status(200).json('pong');
});

app.use('/menus', MenusRoutes);
app.use('/users', UsersRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
