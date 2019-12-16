const request = require('supertest')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const { errorCodes } = require('supra-core')
const { appUrl, testEmail, testPassword, fingerprint } = require('./common')

describe('POSTS CONTROLLER', function () {
  this.slow(0)
  let bearer = 'Bearer'
  let postId

  before(done => {
    request(appUrl)
      .post('/auth/login')
      .send({ password: testPassword, email: testEmail, fingerprint })
      .end((err, res) => {
        expect(err).to.be.null
        bearer = `Bearer ${res.body.data.accessToken}`
        done()
      })
  })

  describe('[POST] /posts', () => {
    it('it should return new post entity', done => {
      chai.request(appUrl)
        .post('/posts')
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .send({ title: 'test title', content: 'test content' })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('object')
          expect(res.body.data.id).to.be.a('number')
          expect(res.body.data.title).to.be.a('string').that.is.not.empty
          expect(res.body.data.content).to.be.a('string').that.is.not.empty

          postId = res.body.data.id
          done()
        })
    })

    it('it should return validation error if request data is wrong', done => {
      chai.request(appUrl)
        .post('/posts')
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .send({ title: null })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(400)
          expect(res.body.code).to.equal(errorCodes.VALIDATION.code)
          expect(res.body.success).to.be.false
          done()
        })
    })
  })

  describe('[GET] /posts/:id', () => {
    it('it should return post entity by id', done => {
      chai.request(appUrl)
        .get(`/posts/${postId}`)
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('object')
          expect(res.body.data.id).to.be.a('number')
          expect(res.body.data.title).to.be.a('string').that.is.not.empty
          expect(res.body.data.content).to.be.a('string').that.is.not.empty
          done()
        })
    })

    it('it should return not found error if the post does not exist', done => {
      chai.request(appUrl)
        .get(`/posts/${9999999}`)
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(404)
          expect(res.body.code).to.equal(errorCodes.NOT_FOUND.code)
          expect(res.body.success).to.be.false
          done()
        })
    })
  })

  describe('[GET] /posts', () => {
    it('it should return posts list', done => {
      chai.request(appUrl)
        .get('/posts')
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('array')
          done()
        })
    })
  })

  describe('[PATCH] /posts/:id', () => {
    it('it should return updated post entity', done => {
      chai.request(appUrl)
        .patch(`/posts/${postId}`)
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
        .send({ title: 'test title updated', content: 'test content updated' })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.success).to.be.true
          expect(res.body.data).to.be.a('object')
          expect(res.body.data.title).to.be.a('string').that.is.not.empty
          expect(res.body.data.title).to.include('updated')
          expect(res.body.data.content).to.be.a('string').that.is.not.empty
          expect(res.body.data.content).to.include('updated')
          done()
        })
    })
  })

  describe('[DELETE] /posts/:id', () => {
    it('it should remove post entity by id', done => {
      chai.request(appUrl)
        .delete(`/posts/${postId}`)
        .set('Authorization', bearer)
        .set('content-type', 'application/json')
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
