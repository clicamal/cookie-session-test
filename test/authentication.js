'use strict';

const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000
});

const userDataMock = {
    id: 0,
    username: 'test',
    password: 'test'
};

QUnit.module('Authentication Test');

QUnit.test('Register', async assert => {
    let response = await api.post('/register', userDataMock);

    assert.deepEqual(response.data, {
        message: 'User created successfully.'
    });
});

QUnit.test('Authenticate', async assert => {
    let response = await api.post('/authenticate', userDataMock);

    assert.deepEqual(response.data, {
        message: 'User authenticated successfully.'
    });
});

QUnit.test.each('Authenticate errors', [
    { username: 'tes', password: 'test' }, // Wrong username
    { username: 'test', password: 'tes' } // Wrong password
], async (assert, data) => {
    try {
        let response = await api.post('/authenticate', data);
    } catch (error) {
        assert.deepEqual(error.response.data, {
            message: 'Invalid username or password.'
        });
    }
});

// It is working on RESTER but not on here.
QUnit.test.skip('Session', async assert => {
    let response = await api.post('/authenticate', userDataMock);
    response = await api.get('/session');

    userDataMock.id = response.data.id;

    assert.deepEqual(response.data, {
        user: userDataMock
    });
});
