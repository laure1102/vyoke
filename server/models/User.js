
//model定义
module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("User",{
    uid: {
      type:DataTypes.STRING,
      allowNull: false
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type:DataTypes.STRING,
      allowNull: false
    },
    nickname: DataTypes.STRING,
    active: DataTypes.INTEGER,
    deleted: DataTypes.INTEGER,
  }, {
    tableName: 'user'
  },
  /*{
    // 将模型与特定模式关联
    schema: 'vyoke',
  }*/);
};
