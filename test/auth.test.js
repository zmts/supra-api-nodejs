const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const { host, port } = require('../config').app

describe('AUTH CONTROLLER', function () {
  this.slow(0)
  const appUrl = `${host}:${port}`
  const fingerprint = '12345678901234567890'
  let refreshToken = ''

  describe('[POST] /auth/login', () => {
    it('it should return access/refresh tokens', done => {
      chai.request(appUrl)
        .post('/auth/login')
        .send({ password: '123456Aa', email: 'test@test.com', fingerprint })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('object')
          expect(res.body.data.accessToken).to.be.a('string').that.is.not.empty
          expect(res.body.data.refreshToken).to.be.a('string').that.is.not.empty

          refreshToken = res.body.data.refreshToken
          done()
        })
    })
  })

  describe('[POST] /auth/refresh-tokens', () => {
    it('it should return refreshed access/refresh tokens', done => {
      chai.request(appUrl)
        .post('/auth/refresh-tokens')
        .send({ refreshToken, fingerprint })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('object')
          expect(res.body.data.accessToken).to.be.a('string').that.is.not.empty
          expect(res.body.data.refreshToken).to.be.a('string').that.is.not.empty

          refreshToken = res.body.data.refreshToken
          done()
        })
    })
  })

  describe('[POST] /auth/logout', () => {
    it('it should return success message', done => {
      chai.request(appUrl)
        .post('/auth/logout')
        .send({ refreshToken })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.message).to.be.a('string').that.is.not.empty
          done()
        })
    })
  })
})
