import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Team.model';

import { Response } from 'superagent';
import { teamsMock } from './mocks/team.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('testando o metodo GET da rota /teams', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('acessado com sucesso', async () => {
    sinon.stub(Team, 'findAll').resolves(teamsMock as Team[])

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams')

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(teamsMock);
  })
})

describe('testando o metodo GET da rota /teams/:id', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('acessando com sucesso', async () => {
    sinon.stub(Team, 'findOne').resolves(teamsMock[0] as Team)

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/1');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(teamsMock[0]);
  })
  
  it('time nao encontrado', async () => {
    sinon.stub(Team, 'findOne').resolves();

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/666');

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body).to.equal('team not found');
  })
})