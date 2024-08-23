
//model定义
module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("UserInfo",{
    uid: {
      type:DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    gender: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    birthMonth: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    intro: {
      type:DataTypes.STRING,
      defaultValue: "",
    },
  }, {
    tableName: 'user_info'
  },);
};
