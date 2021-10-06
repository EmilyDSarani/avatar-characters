const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const avatar = require('./avatar.js');
const usersData = require('./users.js');
const elementData = require('./elements.js');

const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      elementData.map(element => {
        return client.query(`
                    INSERT INTO elements (element_id, element_name)
                    VALUES ($1, $2)
                    RETURNING *;
                `,
        [element.element_id, element.element_name]);
      })
    );

    await Promise.all(
      avatar.map(avatar => {
        return client.query(`
                    INSERT INTO avatar (name, element_id, img, title, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [avatar.name, avatar.element_id, avatar.img, avatar.title, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
