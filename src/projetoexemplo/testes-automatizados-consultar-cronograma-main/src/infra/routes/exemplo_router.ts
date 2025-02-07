import { Router } from "express";
import { factoryConsultarCronograma } from "../factories/ConsultarCronogramaFactory";

const routerBasico = Router();

const objeto = factoryConsultarCronograma();

routerBasico.get('/vivo', (req, res) => {
  res.status(200).json({ message: 'Estou vivo!' });
});

routerBasico.get('/cronograma/:disciplinaId', (req, res) => {
  objeto.handle(req, res);
});

export { routerBasico };