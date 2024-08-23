//model定义
module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("UserObj",{
    uid: {
      type:DataTypes.STRING,
      allowNull: false
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false
    },
    nickname: DataTypes.STRING,
  }, {
    tableName: 'user'
  },
  /*{
    // 将模型与特定模式关联
    schema: 'vyoke',
  }*/);
};