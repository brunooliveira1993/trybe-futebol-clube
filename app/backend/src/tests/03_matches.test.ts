import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Matches.model';

import { Response } from 'superagent';
import Team from '../database/models/Team.model';
import { mockedToken } from './mocks/user.mocks';
import { jwtPayload } from './mocks/jwt.mock'
import { teamsMock } from './mocks/team.mock';
import { matchCreated, matchesMock, matchToCreate,
  matchWithSameTeam, finishedMatchesMock } from './mocks/matches.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('testando o metodo GET da rota /matches', () => {
  let response: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('acessando com sucesso', async () => {
    sinon.stub(Match, 'findAll').resolves(matchesMock as unknown as Match[]);

    response = await chai
      .request(app)
      .get('/matches');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matchesMock);
  })
});

describe('testando o metodo GET da rota /matches?inProgress=', () => {
  let response: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('in progress = false', async () => {
    const noFilter = matchesMock.filter((m) => m.inProgress === false);
    sinon.stub(Match, 'findAll').resolves(noFilter as unknown as Match[]);

    response = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(noFilter);
  })

  it('in progress = true', async () => {
    const inProgreesFilter = matchesMock.filter((m) => m.inProgress === true);
    sinon.stub(Match, 'findAll').resolves(inProgreesFilter as unknown as Match[]);

    response = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(inProgreesFilter);
  })
});

describe('testando o metodo PATCH da rota /matches/:id/finish', () => {
  let response: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('acessando com sucesso', async () => {
    sinon.stub(Match, 'findAll').resolves(finishedMatchesMock as unknown as Match[])
    const response = await chai.request(app).get("/matches?inProgress=false").send()

    expect(response.status).to.be.eq(200)
    expect(response.body).to.deep.equal(finishedMatchesMock)
})
})


describe('-> POST /matches', () => {
  let response: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('token não informado', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtPayload);

    response = await chai
      .request(app)
      .post('/matches').send(matchWithSameTeam);

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token must be a valid token');
  })

  it('token informado invalido', async () => {
    sinon.stub(jwt, 'verify').throws(new Error('error'));

    response = await chai
      .request(app)
      .post('/matches').send(matchWithSameTeam).set('Authorization', 'mockedToken');

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token must be a valid token');
  })
})

describe('-> PATCH /matches/:id', () => {
  let response: Response;

  afterEach(()=>{
    sinon.restore()
  });
  
  it('goal adicionado com sucesso', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtPayload);
    sinon.stub(Match, 'update').resolves([1]);

    response = await chai
      .request(app)
      .patch('/matches/555').send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      }).set('Authorization', mockedToken);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal('GOOOOOOOOAAAAALLL');
  });
});
