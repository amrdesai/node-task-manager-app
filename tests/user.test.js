const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Billu Billeshwar',
    email: 'billu@billeshwar.com',
    password: 'paffword',
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
        },
    ],
};

// Clear Users in database
beforeEach(async () => {
    await User.deleteMany();
    // Add a new user to the database
    await new User(userOne).save();
});

// Test: User signup
test('Sould signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Random Name',
            email: 'randomemail@emailgmail.com',
            password: 'paffword',
        })
        .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert about the response
    expect(response.body).toMatchObject({
        user: { name: 'Random Name', email: 'randomemail@emailgmail.com' },
        token: user.tokens[0].token,
    });

    // Assert password is not saveed as text
    expect(user.password).not.toBe('paffword');
});

// Test: Login existing user
test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({ email: userOne.email, password: userOne.password })
        .expect(200);

    // Assert that new token is saved to database
    const user = await User.findById(userOneId);
    expect(user.tokens[1].token).toBe(response.body.token);
});

// Test: Login error
test('Should not login non-existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'random@email.com',
            password: 'random-password',
        })
        .expect(400);
});

// Test: Get user profile
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

// Test: Get user error for unauthenticated user
test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401);
});

// Test: Delete Account for User
test('Should delete account', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert null response if user deleted
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

// Test: Delete Account Error
test('Should delete account', async () => {
    await request(app).delete('/users/me').send().expect(401);
});

// Test: Avatar
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    // Check if the avater property is equal to buffer
    expect(user.avatar).toEqual(expect.any(Buffer));
});

// Test: Update valid fields
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Billi' })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe('Billi');
});

// Test: Should not update invalid fields
test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Toronto' })
        .expect(400);
});
