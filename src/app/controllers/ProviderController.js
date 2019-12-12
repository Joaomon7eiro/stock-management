import * as Yup from 'yup';

import { Op } from 'sequelize';
import Provider from '../models/Provider';

class ProviderController {
  async create(req, res) {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone_number: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required(),
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
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const schema = Yup.object().shape({
      name: Yup.string(),
      phone_number: Yup.string().matches(
        phoneRegExp,
        'Phone number is not valid'
      ),
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
    const { page = 1, query } = req.query;
    const limit = 20;

    const whereObj = query
      ? { name: { [Op.like]: `%${query}%` }, user_id: req.userId }
      : { user_id: req.userId };

    const providers = await Provider.findAndCountAll({
      where: whereObj,
      attributes: ['id', 'name', 'phone_number'],
      limit,
      order: ['id'],
      offset: (page - 1) * limit,
    });

    let pageNumber = 1;

    if (providers.count !== 0) {
      if (providers.count % limit === 0) {
        pageNumber -= 1;
      }
      pageNumber = Math.floor(providers.count / 20) + pageNumber;
    }

    return res.json({
      providers: providers.rows,
      page,
      totalPages: pageNumber,
    });
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
