import {
  Model,
  DataTypes,
  BelongsToManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
import Comment from './comments';
import Company from './companies';
import Style from './styles';
import Country from './countries';

interface GetRate {
  rate: { [key: string]: any };
}

class Beer extends Model implements GetRate {
  public readonly id!: number;
  public beer_name!: string;
  public beer_img!: string;
  public abv!: number;
  public ibu!: number;
  public company_id!: number;
  public country!: number; // ! 반드시 존재한
  public style_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
  // public getComment!: { [key: string]: any };
  public rate!: { [key: string]: any };
  // public getComments!: BelongsToManyAddAssociationMixin<Comment, number>;
  public getCompany!: BelongsToGetAssociationMixin<Company>;
  public geyStyle!: BelongsToGetAssociationMixin<Style>;
  public getCountry!: BelongsToGetAssociationMixin<Country>;
}

Beer.init(
  {
    beer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beer_img: {
      type: DataTypes.STRING,
    },
    abv: {
      type: DataTypes.INTEGER,
    },
    ibu: {
      type: DataTypes.INTEGER,
    },
    style_id: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    country_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Beer',
    tableName: 'Beer',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Beer.belongsTo(db.Style, {
    foreignKey: 'style_id',
    targetKey: 'id',
    as: 'getStyle',
  });
  db.Beer.hasMany(db.Beer_seller, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getBeer_seller',
  });
  db.Beer.hasMany(db.Comment, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getComment',
  });
  db.Beer.hasMany(db.Beer_tag, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getBeer_tag',
  });
  db.Beer.belongsTo(db.Country, {
    as: 'getCountry',
    foreignKey: 'country_id',
    targetKey: 'id',
  });
  db.Beer.belongsTo(db.Company, {
    as: 'getCompany',
    foreignKey: 'company_id',
    targetKey: 'id',
  });
};

export default Beer;
