import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User.model';
import { jwtVerifiedMock, mockedToken, userMock } from './mocks/user.mocks';
import * as auth from '../auth/JWTFunc';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const loginInfo = {
  email: 'mock@mock.com',
  password: 'secret_admin',
}

describe('testa as funções de criação e validação de Tokens', () => {
  afterEach(()=>{
      sinon.restore()
    })
  
  it('cria um novo Token', async () => {
    sinon.stub(jwt, 'sign').resolves(mockedToken);

    const createdToken = await auth.createToken({ id: 1,
      username: 'mock',
      role:'mock',
      email: 'mock@mock.com'})
    expect(createdToken).to.equal(mockedToken);
  })

  it('valida com sucesso o novo Token', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtVerifiedMock);

    const verified = await auth.verifyToken(mockedToken)
    expect(verified).to.equal(jwtVerifiedMock);
  });

  it('falha na validação do novo Token', async () => {
    const error = 'error'
    sinon.stub(jwt, 'verify').throws(new Error(error));

    const verified = await auth.verifyToken('mockedToken')
    expect(verified).to.deep.equal({ isError: true });
  });
});

describe('testando rota POST do /login', () => {
  let response: Response;
  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('acessando sem o campo password', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User)
  
    response = await chai
      .request(app)
      .post('/login')
      .send({ email: loginInfo.email });
      
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('All fields must be filled');
  });

  it('acessando sem o campo email', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User)
  
    response = await chai
      .request(app)
      .post('/login')
      .send({ password: loginInfo.password });
      
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('All fields must be filled');
  });

  it('acessando com um password invalido', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(bcrypt, 'compareSync').returns(false);
  
    response = await chai
      .request(app)
      .post('/login')
      .send({ ...loginInfo, password: 'errado'});
      
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Incorrect email or password');
  });

  it('acessando com um email invalido', async () => {
    sinon.stub(User, 'findOne').resolves();
  
    response = await chai
      .request(app)
      .post('/login')
      .send(loginInfo);
      
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Incorrect email or password');
  });

  it('acesso concedico', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(auth, 'createToken').returns(mockedToken)
  
    response = await chai
      .request(app)
      .post('/login')
      .send(loginInfo);
      
    expect(response.status).to.equal(200);
    expect(response.body.token).to.equal(mockedToken);
  });
});

describe('acessando a rota GET de /login', () => {
  let response: Response;

  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('acesso correto', async () => {
    sinon.stub(User, 'findOne').resolves();
    sinon.stub(jwt, 'verify').returns(jwtVerifiedMock as any);
  
    response = await chai
      .request(app)
      .get('/login/validate').set('Authorization', mockedToken);
      
    expect(response.status).to.equal(200);
    expect(response.body.role).to.equal(jwtVerifiedMock.data.role);
  });

  it('acessando sem um token', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
  
    response = await chai
      .request(app)
      .get('/login/validate').set('Authorization', '');
      
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Token not found');
  });

  it('acessando com token invalido', async () => {
    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(auth, 'verifyToken').returns('jwtVerifiedMock');
  
    response = await chai
      .request(app)
      .get('/login/validate').set('Authorization', 'Invalid Token');
      
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Invalid Token');
  });
});