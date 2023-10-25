const dbPool = require('../db/pgClient');

/**
 * Controller to serve all ducks in the database.
 * @route `/ducks`
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @response Array of duck objects with joined owner
 */
const getAllDucks = async (req, res) => {
  try {
    const { rows } = await dbPool.query(
      `SELECT duck.id, duck_name, img_src, quote, json_build_object('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner FROM duck JOIN owner ON owner.id=duck.owner_id WHERE active=true;`
    );

    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to serve a single duck based on duck id.
 * @route /ducks/:id
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @response Single duck object with joined owner
 */
const getSingleDuck = async (req, res) => {
  try {
    const { id } = req.params;

    if (!+id) return res.status(400).json({ error: 'Id must be a number' });

    const {
      rows: [oneDuck],
    } = await dbPool.query(
      `SELECT duck.id, duck_name, img_src, quote, json_build_object('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner FROM duck JOIN owner ON owner.id=duck.owner_id WHERE duck.id=$1 AND active=true`,
      [id]
    );

    if (!oneDuck)
      return res.status(404).json({ error: 'Duck could not be found' });

    res.json(oneDuck);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to create a new duck in the database.
 * `duck_name`, `img_src` and `owner_id` are required from req.body
 * @route /duck
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @response Newly created duck row
 */
const createDuck = async (req, res) => {
  try {
    const { duck_name, img_src, quote, owner_id } = req.body;
    if (!duck_name || !img_src || !owner_id)
      return res.status(400).json({ error: 'Missing fields' });

    const defaultQuote = 'Whenever you are ready!';

    const {
      rows: [newDuck],
    } = await dbPool.query(
      'INSERT INTO duck (duck_name, img_src, quote, owner_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [duck_name, img_src, quote || defaultQuote, owner_id]
    );

    return res.status(201).json(newDuck);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to edit a single duck based on duck id.
 * `duck_name`, `img_src`, and `owner_id` are required from req.body
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @response Edited `duck` object
 */
const editDuck = async (req, res) => {
  try {
    const {
      params: { id },
      body: { duck_name, img_src, quote, owner_id },
    } = req;

    if (!+id) return res.status(400).json({ error: 'Id must be a number' });

    if (!duck_name || !img_src || !owner_id)
      return res.status(400).json({ error: 'Missing fields' });

    const defaultQuote = 'Whenever you are ready!';

    const {
      rows: [updatedDuck],
    } = await dbPool.query(
      `UPDATE duck SET duck_name=$1, img_src=$2, quote=$3, owner_id=$4 FROM (SELECT duck.id, duck_name, img_src, quote, json_build_object('id', owner.id, 'first_name', first_name, 'last_name', last_name, 'email', owner.email) as owner FROM duck JOIN owner ON owner.id=duck.owner_id) updatedDuck WHERE updatedDuck.id=$5 RETURNING updatedDuck.id, updatedDuck.duck_name, updatedDuck.img_src, updatedDuck.quote, updatedDuck.owner;`,
      [duck_name, img_src, quote || defaultQuote, owner_id, id]
    );

    return res.json(updatedDuck);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to mark a duck as inactive, based on duck id.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @response 204 status code
 */
const deactivateDuck = async (req, res) => {
  try {
    const { id } = req.params;

    if (!+id) return res.status(400).json({ error: 'Id must be a number' });

    await dbPool.query('UPDATE duck SET active=false WHERE id=$1;', [id]);

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDucks,
  getSingleDuck,
  createDuck,
  editDuck,
  deactivateDuck,
};
