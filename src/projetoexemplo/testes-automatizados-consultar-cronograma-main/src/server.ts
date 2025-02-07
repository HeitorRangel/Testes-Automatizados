import express from 'express';
import { routerBasico } from './infra/routes/exemplo_router';

const app = express();

app.use(express.json());
app.use(routerBasico);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
