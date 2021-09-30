require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns avatar characters', async() => {

      const expectation = [
        {
          id: 1,
          name:'Aang',
          element: 'Air',
          img: 'https://i.insider.com/5ebdbc8c3ad8612a1c7aa143?width=856&format=jpeg',
          title: 'Avatar',
          owner_id: 1 
        }, 
        {
          id: 2,
          name:'Zuko',
          element: 'Fire',
          img: 'https://i.redd.it/jcyddoyzeo761.jpg',
          title: 'Prince',
          owner_id: 1 

        }, 
        {
          id: 3,
          name:'Katara',
          element: 'Water',
          img: 'http://pm1.narvii.com/6078/caabea330dc68f44a3f855606f897516ec582759_00.jpg',
          title: 'Healer', 
          owner_id: 1 
        }, 
        {
          id: 4,
          name:'Sokka',
          element: 'None',
          img: 'https://i.pinimg.com/originals/08/ca/e8/08cae8f53ebfd473b1b3133b0138d9cd.jpg',
          title: 'Plan-Guy',
          owner_id: 1  
        }, 
        {
          id: 5,
          name:'Toph',
          element: 'Earth',
          img: 'http://images4.wikia.nocookie.net/__cb20081225191856/avatar/images/2/2e/Toph.png',
          title: 'Blind-Bandit',
          owner_id: 1  
        }, 
        {
          id: 6,
          name:'Suki',
          element: 'None',
          img: 'https://comicvine1.cbsistatic.com/uploads/scale_super/11138/111385676/7019867-suki.jpg',
          title: 'Kyoshi-Warrior',
          owner_id: 1  
        }, 
        {
          id: 7,
          name:'Appa',
          element: 'Air',
          img: 'https://preview.redd.it/nx50st82y8351.png?auto=webp&s=f31cdd2db86f73ee5245bf8462fa7df187119254',
          title: 'Bison',
          owner_id: 1  
        }, 
        {
          id: 8,
          name:'Momo',
          element: 'Air',
          img: 'https://pbs.twimg.com/media/Eb78V98WsAU4-4G.png',
          title: 'Lemur',
          owner_id: 1  
        },
      ];

      const data = await fakeRequest(app)
        .get('/avatar')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  
    test('returns 1 avatar character', async() => {

      const expectation = 
        {
          id: 1,
          name:'Aang',
          element: 'Air',
          img: 'https://i.insider.com/5ebdbc8c3ad8612a1c7aa143?width=856&format=jpeg',
          title: 'Avatar',
          owner_id: 1 
        };
      const data = await fakeRequest(app)
        .get('/avatar/1')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual(expectation);
    });

    test('posting new character', async() => {

      const expectation = 
        {
          id: expect.any(Number),
          name:'Ozai',
          element: 'Fire',
          img: 'https://pbs.twimg.com/media/EOSb5rPX0AAQKtL.jpg',
          title: 'Phoenix King',
          owner_id: expect.any(Number), 
        };
      const data = await fakeRequest(app)
        .post('/avatar')
        .send({
          name: 'Ozai',
          element: 'Fire',
          img: 'https://pbs.twimg.com/media/EOSb5rPX0AAQKtL.jpg',
          title: 'Phoenix King'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('putting updated info', async() => {

      const expectation = 
        {
          id: 2,
          name:'Zuko',
          element: 'Fire',
          img: 'https://i.redd.it/jcyddoyzeo761.jpg',
          title: 'FireLord',
          owner_id: 1, 
        };
      const data = await fakeRequest(app)
        .put('/avatar/2')
        .send({
          name:'Zuko',
          element: 'Fire',
          img: 'https://i.redd.it/jcyddoyzeo761.jpg',
          title: 'FireLord'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test('deletes a character created', async() => {

    //   const expectation = 
    //     {
    //       id: 8,
    //       name:'Momo',
    //       element: 'Air',
    //       img: 'https://pbs.twimg.com/media/Eb78V98WsAU4-4G.png',
    //       title: 'Lemur', 
    //       owner_id: 1, 
    //     };
    //   const data = await fakeRequest(app)
    //     .delete('/avatar/8')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });


  });
});