import * as Yup from 'yup';

import Item from '../models/Item';
import Product from '../models/Product';

class ItemController {
  async create(req, res) {
    const schema = Yup.object().shape({
      quantity: Yup.number().required(),
      product_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const { product_id: productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(400).json({ error: 'Product does not exists' });
    }

    if (quantity > product.quantity) {
      return res.status(401).json({ error: 'Not enough items on stock' });
    }

    const value = quantity * product.price;

    req.body.value = value;

    const { saleId } = req.params;
    req.body.sale_id = saleId;

    const newItem = await Item.create(req.body);

    return res.json({
      newItem,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const limit = 20;

    const items = await Item.findAll({
      where: { sale_id: req.params.saleId },
      attributes: ['id', 'quantity', 'value'],
      include: [
        { model: Product, as: 'product', attributes: ['name', 'price'] },
      ],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(items);
  }

  async show(req, res) {
    const item = await Item.findByPk(req.params.id, {
      attributes: ['id', 'quantity', 'value'],
      include: [
        { model: Product, as: 'product', attributes: ['name', 'price'] },
      ],
    });

    if (!item) {
      return res.status(400).json({ error: 'Item does not exists' });
    }

    return res.json({
      item,
    });
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     name: Yup.number(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Invalid Request body' });
  //   }

  //   const item = await Item.findByPk(req.params.id);

  //   if (!item) {
  //     return res.status(400).json({ error: 'Item does not exists' });
  //   }

  //   const updatedItem = await item.update(req.body, {
  //     include: [
  //       { model: Product, as: 'product', attributes: ['name', 'price'] },
  //     ],
  //   });

  //   return res.json({
  //     updatedItem,
  //   });
  // }

  // async delete(req, res) {
  //   const { id } = req.params;

  //   const item = await Item.findByPk(id);

  //   if (!item) {
  //     return res.status(400).json({ error: 'Item does not exists' });
  //   }

  //   await Item.destroy({ where: { id } });

  //   return res.status(200);
  // }
}

export default new ItemController();
