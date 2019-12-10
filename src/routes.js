import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ClientController from './app/controllers/ClientController';
import ItemController from './app/controllers/ItemController';
import ProductController from './app/controllers/ProductController';
import ProviderController from './app/controllers/ProviderController';
import SaleController from './app/controllers/SaleController';

const routes = Router();

routes.post('/users', UserController.create);
routes.post('/sessions', SessionController.create);

routes.use(authMiddleware);

// routes below only can be used with authorization

routes.get('/clients', ClientController.index);
routes.post('/clients', ClientController.create);
routes.put('/clients/:id', ClientController.update);
routes.get('/clients/:id', ClientController.show);
routes.delete('/clients/:id', ClientController.delete);

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.create);
routes.put('/products/:id', ProductController.update);
routes.get('/products/:id', ProductController.show);
routes.delete('/products/:id', ProductController.delete);

routes.get('/providers', ProviderController.index);
routes.post('/providers', ProviderController.create);
routes.put('/providers/:id', ProviderController.update);
routes.get('/providers/:id', ProviderController.show);
routes.delete('/providers/:id', ProviderController.delete);

routes.get('/sales/:saleId/items', ItemController.index);
routes.post('/sales/:saleId/items', ItemController.create);
routes.get('/sales/:saleId/items/:id', ItemController.show);
// routes.put('/sales/:saleId/items/:id', ItemController.update);
// routes.delete('/sales/:saleId/items/:id', ItemController.delete);

routes.get('/sales', SaleController.index);
routes.post('/sales', SaleController.create);
routes.get('/sales/:id', SaleController.show);
// routes.put('/sales/:id', SaleController.update);
// routes.delete('/sales/:id', SaleController.delete);

export default routes;
