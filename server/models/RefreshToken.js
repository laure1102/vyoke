//model定义
module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("Refresh_token",{
    refreshToken: {
      type:DataTypes.STRING,
      allowNull: false
    },
    uid: {
      type:DataTypes.STRING,
      allowNull: false
    },
    expireAt: {
      type:DataTypes.DATE,
      allowNull: false
    },
  }, {
    tableName: 'refresh_token'
  })
};
