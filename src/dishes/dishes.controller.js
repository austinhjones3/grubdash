const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

/**
 * CRUD
 */

function list(req, res, next) {
  res.json({ data: dishes });
}

function create(req, res, next) {
  const { name, desc, price, image } = res.locals;
  res.status(201).json({ data: { name, desc, price, image, id: nextId() } });
}

function read(req, res, next) {
  const { dish } = res.locals;
  res.json({ data: dish });
}

function update(req, res, next) {
  const { name, description, price, image_url } = req.body.data;
  const { dish } = res.locals;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  res.json({ data: dish });
}

/**
 * MIDDLEWARE
 */

function dishExists(req, res, next) {
  const foundDish = dishes.find((dish) => dish.id === req.params.dishId);
  if (!foundDish) {
    return next({ status: 404, message: "Dish does not exist" });
  }
  res.locals.dish = foundDish;
  return next();
}

function hasDishProps(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: "Please include a request body with the dish's attributes.",
    });
  }

  if (!data.name || data.name.trim().length === 0) {
    return next({ status: 400, message: "Dish must include a name" });
  }

  if (!data.description || data.description.trim().length === 0) {
    return next({ status: 400, message: "Dish must include a description" });
  }

  if (!data.price) {
    return next({ status: 400, message: "Dish must include a price" });
  }

  if (
    typeof data.price !== "number" ||
    data.price - Math.floor(data.price) !== 0 ||
    data.price <= 0
  ) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }

  if (!data.image_url || data.image_url.trim().length === 0) {
    return next({ status: 400, message: "Dish must include a image_url" });
  }

  return next();
}

// let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

module.exports = {
  list,
  create: [hasDishProps, create],
  read: [dishExists, read],
  update: [dishExists, hasDishProps, update],
};
