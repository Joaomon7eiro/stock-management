import * as Yup from 'yup';

import Sale from '../models/Sale';
import Client from '../models/Client';

class SaleController {
  async create(req, res) {
    const schema = Yup.object().shape({
      client_id: Yup.string().required(),
      value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const client = await Client.findOne({ where: { id: req.body.client_id } });

    if (!client) {
      return res.status(400).json({ erro: 'Client does not exists' });
    }

    req.body.user_id = req.userId;

    const { id, value } = await Sale.create(req.body);

    return res.json({ id, value });
  }

  async index(req, res) {
    const sales = await Sale.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'value'],
      include: [{ model: Client, as: 'client', attributes: ['name'] }],
    });

    return res.json(sales);
  }

  async show(req, res) {
    const sale = await Sale.findByPk(req.params.id, {
      attributes: ['id', 'value'],
      include: [{ model: Client, as: 'client', attributes: ['name'] }],
    });

    if (!sale) {
      return res.status(400).json({ error: 'Sale does not exists' });
    }

    return res.json(sale);
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     value: Yup.string().required(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Invalid Request body' });
  //   }

  //   const sale = await Sale.findByPk(req.params.id);

  //   if (!sale) {
  //     return res.status(400).json({ error: 'Sale does not exists' });
  //   }

  //   const { id, value } = await sale.update(req.body);

  //   return res.json({
  //     id,
  //     value,
  //   });
  // }

  // async delete(req, res) {
  //   const { id } = req.params;

  //   const sale = await Sale.findByPk(id);

  //   if (!sale) {
  //     return res.status(400).json({ error: 'Provider not exists' });
  //   }

  //   await sale.destroy({ where: { id } });

  //   return res.status(200);
  // }
}

export default new SaleController();
