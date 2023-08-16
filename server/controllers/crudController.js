const create = async (Model, data) => {
  try {
    const newItem = await Model.create(data);
    return newItem;
  } catch (error) {
    throw new Error(`Erreur lors de la création de l'élément : ${error.message}`);
  }
};

const getById = async (Model, id) => {
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      throw new Error("L'élément n'a pas été trouvé");
    }
    return item;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'élément : ${error.message}`);
  }
};

const updateById = async (Model, id, data) => {
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      throw new Error("L'élément n'a pas été trouvé");
    }
    Object.assign(item, data);
    await item.save();
    return item;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'élément : ${error.message}`);
  }
};

const deleteById = async (Model, id) => {
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      throw new Error("L'élément n'a pas été trouvé");
    }
    await item.destroy();
    return item;
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de l'élément : ${error.message}`);
  }
};

module.exports = { create, getById, updateById, deleteById };