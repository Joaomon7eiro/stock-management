import * as Yup from 'yup';

import { Op } from 'sequelize';

import Client from '../models/Client';

class ClientController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone_number: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const { email, name, phone_number: phoneNumber } = req.body;

    const client = await Client.findOne({
      where: { email },
    });

    if (client) {
      return res.status(400).json({ error: 'Client already exists' });
    }

    req.body.user_id = req.userId;

    await Client.create(req.body);

    return res.json({
      email,
      name,
      phoneNumber,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      phone_number: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(400).json({ error: 'Client does not exists' });
    }

    const { name, email, phone_number: phoneNumber } = await client.update(
      req.body
    );

    return res.json({
      email,
      name,
      phoneNumber,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(400).json({ error: 'Client not exists' });
    }

    await Client.destroy({ where: { id } });

    return res.status(200);
  }

  async index(req, res) {
    const { page = 1, query } = req.query;
    const limit = 20;

    const whereObj = query
      ? { name: { [Op.like]: `%${query}%` }, user_id: req.userId }
      : { user_id: req.userId };

    const clients = await Client.findAndCountAll({
      where: whereObj,
      attributes: ['id', 'name', 'email', 'phone_number'],
      limit,
      order: ['id'],
      offset: (page - 1) * limit,
    });

    let pageNumber = 1;

    if (clients.count !== 0) {
      if (clients.count % limit === 0) {
        pageNumber -= 1;
      }
      pageNumber = Math.floor(clients.count / 20) + pageNumber;
    }

    return res.json({
      clients: clients.rows,
      page,
      totalPages: pageNumber,
    });
  }

  async show(req, res) {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(400).json({ error: 'Client not exists' });
    }

    const { id, name, email, phone_number: phoneNumber } = client;

    return res.json({
      id,
      name,
      email,
      phoneNumber,
    });
  }
}

export default new ClientController();
