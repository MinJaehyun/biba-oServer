import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class BookMark extends Model {
  public readonly id!: number;
  public user_id!: number;
  public beer_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

BookMark.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    beer_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'BookMark',
    tableName: 'BookMark',
  }
);

export const associate = (db: dbType): void => {
  db.BookMark.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'id',
  });
  db.BookMark.belongsTo(db.Beer, {
    foreignKey: 'beer_id',
    targetKey: 'id',
    as: 'getBeer',
  });
};

export default BookMark;
