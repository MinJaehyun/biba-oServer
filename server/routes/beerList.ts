import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Company from '../models/companies';
import Country from '../models/countries';
import Style from '../models/styles';

const router = express.Router();

interface FIoo extends Beer {
  [key: string]: any;
}

// 모든 맥주 리스트 (랜덤하게)
router.get('/list', async (req, res) => {
  //   const where = {};
  //   if (parseInt(req.query.lastId, 10)) {
  //     where = {
  //       id: {
  //         [Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
  //       }, 무한 스크롤 어떤식으로?
  //     };
  //   }
  const allBeerList = await Beer.findAll({
    order: Sequelize.literal('rand()'),
    limit: 10,
    raw: true,
    attributes: ['id', 'beer_name'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
      },
    ],
  });
  // 시더스?? seders
  // rate로 줄 수 있게 바꾸기
  // const sendDate = allBeerList.map((data) =>
  //   Object.assign(
  //     {},
  //     { id: data.id, beer_name: data.beer_name, rate: data['getComment.rate'] }
  //   )
  // );

  //   allBeerList.map((val) => {
  //     val.rate = val['getComment.rate'];
  //     delete val['getComment.rate'];
  //     return val;
  //   });
  //console.log(sendDate);
  return res.status(200).json(allBeerList);
});

// 최신 맥주
router.get('/list-recent', async (req, res) => {
  const recentBeerList = await Beer.findAll({
    raw: true,
    attributes: ['id', 'beer_name'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
        order: ['createAt', 'DESC'],
      },
    ],
  });
  return res.status(200).json(recentBeerList);
});

// 인기 맥주
// rate 높은 순으로 정렬
// 최근 코멘트 우선순으로
// 10개 까지 랜덤하게 정렬
router.get('/list-popular', async (req, res) => {
  const popularBeerList = await Beer.findAll({
    limit: 10,
    raw: true,
    attributes: ['id', 'beer_name'],
    include: [
      {
        model: Comment,
        where: {
          rate: {
            [Sequelize.Op.gte]: 4, // 'rate' >= 4
          },
        },
        as: 'getComment',
        attributes: ['rate'],
        order: ['updateAt', 'DESC'], // 최근 코멘트 작성 우선순위
      },
    ],
  });
  return res.status(200).json(popularBeerList);
});

// 맥주 상세 정보
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const beerInfo = await Beer.findOne({
    attributes: ['id', 'beer_name', 'beer_img', 'abv', 'ibu'],
    where: { id },
    raw: true,
    include: [
      {
        model: Company,
        as: 'getCompany',
        attributes: ['company'],
      },
      {
        model: Country,
        as: 'getCountry',
        attributes: ['country'],
      },
      {
        model: Style,
        as: 'getStyle',
        attributes: ['style_name'],
      },
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
      },
    ],
  });

  return res.status(200).json(beerInfo);
});

export default router;