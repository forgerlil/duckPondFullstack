const express = require('express');
const app = express();
const {
  getAllDucks,
  getSingleDuck,
  createDuck,
  editDuck,
  deactivateDuck,
} = require('./controllers/duckControllers');

const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to the Duck Pond API!'));

app.route('/ducks').get(getAllDucks).post(createDuck);
app.route('/ducks/:id').get(getSingleDuck).put(editDuck).delete(deactivateDuck);

app.listen(port, () => console.log(`Server up on port ${port}`));
