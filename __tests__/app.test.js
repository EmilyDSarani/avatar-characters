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
          img: 'https://www.pngitem.com/pimgs/m/233-2336335_transparent-aang-png-avatar-aang-png-download.png',
          title: 'Avatar',
          owner_id: 1 
        }, 
        {
          id: 2,
          name:'Zuko',
          element: 'Fire',
          img: 'https://www.pngitem.com/pimgs/m/375-3756861_zuko-avatar-png-transparent-png.png',
          title: 'Prince',
          owner_id: 1 

        }, 
        {
          id: 3,
          name:'Katara',
          element: 'Water',
          img: 'https://www.nicepng.com/png/detail/157-1576012_katara-de-avatar-katara-transparent.png',
          title: 'Healer', 
          owner_id: 1 
        }, 
        {
          id: 4,
          name:'Sokka',
          element: 'None',
          img: 'https://www.kindpng.com/picc/m/548-5484508_avatar-the-last-airbender-sokka-png-transparent-png.png',
          title: 'Plan-Guy',
          owner_id: 1  
        }, 
        {
          id: 5,
          name:'Toph',
          element: 'Earth',
          img: 'https://png.pngitem.com/pimgs/s/25-250115_aang-clipart-vector-toph-png-transparent-png.png',
          title: 'Blind-Bandit',
          owner_id: 1  
        }, 
        {
          id: 6,
          name:'Suki',
          element: 'None',
          img: 'https://www.pngkit.com/png/full/157-1575591_png-avatar-the-last-airbender-image-freeuse-avatar.png',
          title: 'Kyoshi-Warrior',
          owner_id: 1  
        }, 
        {
          id: 7,
          name:'Appa',
          element: 'Air',
          img: 'https://64.media.tumblr.com/ac50fb0c75b02757620b46478077b413/tumblr_p27negJA0A1tyjd90o1_400.png',
          title: 'Bison',
          owner_id: 1  
        }, 
        {
          id: 8,
          name:'Momo',
          element: 'Air',
          img: 'https://i.pinimg.com/originals/be/31/83/be31836efa6e88f094558feac39c2cf4.png',
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
          img: 'https://www.pngitem.com/pimgs/m/233-2336335_transparent-aang-png-avatar-aang-png-download.png',
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
          img: 'https://www.pngitem.com/pimgs/m/375-3756861_zuko-avatar-png-transparent-png.png',
          title: 'FireLord',
          owner_id: 1, 
        };
      const data = await fakeRequest(app)
        .put('/avatar/2')
        .send({
          name:'Zuko',
          element: 'Fire',
          img: 'https://www.pngitem.com/pimgs/m/375-3756861_zuko-avatar-png-transparent-png.png',
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