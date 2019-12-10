import * as Yup from 'yup';

import Provider from '../models/Provider';

class ProviderController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone_number: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const { name, phone_number: phoneNumber } = req.body;

    const provider = await Provider.findOne({
      where: { name },
    });

    if (provider) {
      return res.status(400).json({ error: 'Provider already exists' });
    }

    req.body.user_id = req.userId;

    await Provider.create(req.body);

    return res.json({
      name,
      phoneNumber,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      phone_number: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid Request body' });
    }

    const provider = await Provider.findByPk(req.params.id);

    if (!provider) {
      return res.status(400).json({ error: 'Provider not exists' });
    }

    const { name, phone_number: phoneNumber } = await provider.update(req.body);

    return res.json({
      name,
      phoneNumber,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(400).json({ error: 'Provider not exists' });
    }

    await Provider.destroy({ where: { id } });

    return res.status(200);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const limit = 20;

    const providers = await Provider.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'name', 'phone_number'],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(providers);
  }

  async show(req, res) {
    const provider = await Provider.findByPk(req.params.id);

    if (!provider) {
      return res.status(400).json({ error: 'Provider not exists' });
    }

    const { id, name, phone_number: phoneNumber } = provider;

    return res.json({
      id,
      name,
      phoneNumber,
    });
  }
}

export default new ProviderController();
