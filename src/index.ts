import express from 'express';
import LoginRoutes from './routes/auth-routes';
import MenusRoutes from './routes/menus-routes';
import UsersRoutes from './routes/users-routes';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/ping', (_req, res) => {
    return res.status(200).json('pong');
});

app.use('/', LoginRoutes);
app.use('/menus', MenusRoutes);
app.use('/users', UsersRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
