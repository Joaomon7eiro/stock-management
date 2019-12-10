import * as Yup from 'yup';

import Product from '../models/Product';
import Provider from '../models/Provider';

class ProductController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      quantity: Yup.number().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const { name, price, quantity, provider_id: providerId } = req.body;

    const product = await Product.findOne({
      where: { name, price, provider_id: providerId },
    });

    if (product) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    req.body.user_id = req.userId;

    await Product.create(req.body);

    return res.json({
      name,
      price,
      quantity,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      quantity: Yup.number(),
      provider_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(400).json({ error: 'Product does not exists' });
    }

    const { name, price, quantity } = await product.update(req.body);

    return res.json({
      name,
      price,
      quantity,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product not exists' });
    }

    await Product.destroy({ where: { id } });

    return res.status(200);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const limit = 20;

    const products = await Product.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'name', 'price', 'quantity'],
      include: [{ model: Provider, as: 'provider', attributes: ['name'] }],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(products);
  }

  async show(req, res) {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'name', 'price', 'quantity'],
      include: [{ model: Provider, as: 'provider', attributes: ['name'] }],
    });

    if (!product) {
      return res.status(400).json({ error: 'Product not exists' });
    }

    return res.json(product);
  }
}

export default new ProductController();
