const app = require('../server/server');
const supertest = require('supertest');
const request = supertest(app);

describe("Testing response for start page", () => {
    it('Testing / endpoint', () => {
        request.get("/").then(res => {
            expect(res.status).toBe(200);
        });
    })
});

