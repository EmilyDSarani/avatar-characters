const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/avatar', async(req, res) => {
  try {
    const data = await client.query(`SELECT 
    avatar.id,
    avatar.name,
    avatar.element_id,
    avatar.img,
    avatar.title,
    avatar.owner_id
    FROM avatar
    JOIN elements
    ON avatar.element_id = elements.element_id`);
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/avatar/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT 
    avatar.id,
    avatar.name,
    avatar.element_id,
    avatar.img,
    avatar.title,
    avatar.owner_id
    FROM avatar
    JOIN elements
    ON avatar.element_id = elements.element_id
    WHERE id=$1`, [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.post('/avatar', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO avatar(name, element_id, img, title, owner_id) 
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `, [req.body.name, req.body.element_id, req.body.img, req.body.title, 1]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.delete('/avatar/:id', async(req, res) => {
  try {
    const data = await client.query(`
    DELETE from avatar where id=$1
    RETURNING *
    `, [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.put('/avatar/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE avatar 
    SET name = $1, element_id = $2, img = $3, title = $4 
    WHERE id=$5 
    RETURNING *
    `, [req.body.name, req.body.element_id, req.body.img, req.body.title, req.params.id]);
   
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/elements', async(req, res) => {
  try {
    const data = await client.query('SELECT * from elements');
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/elements', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO elements( element_id, element_name) 
    VALUES($1, $2)
    RETURNING *
    `, [req.body.element_id, req.body.element_name]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;