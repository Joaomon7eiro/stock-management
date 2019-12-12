module.exports = {
  up: queryInterface => {
    return Promise.all([
      queryInterface.addConstraint('clients', ['user_id'], {
        type: 'foreign key',
        name: 'clients_user_id_fkey',
        references: {
          table: 'users',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
      queryInterface.addConstraint('items', ['product_id'], {
        type: 'foreign key',
        name: 'itens_product_id_fkey',
        references: {
          table: 'products',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
      queryInterface.addConstraint('products', ['provider_id'], {
        type: 'foreign key',
        name: 'products_provider_id_fkey',
        references: {
          table: 'providers',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeConstraint('products', 'products_provider_id_fkey'),
      queryInterface.removeConstraint('items', 'itens_product_id_fkey'),
      queryInterface.removeConstraint('clients', 'clients_user_id_fkey'),
    ]);
  },
};
