
//model定义
module.exports = (sequelize, DataTypes) =>{
  return sequelize.define("UserSearchEngine",{
    uid: {
      type:DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    seid: {
      type:DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    name: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    addr: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    dft: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "N",
    },
    icoUrl: {
      type:DataTypes.STRING,
      allowNull: true,
      defaultValue: "N",
    },
  }, {
    tableName: 'user_search_engine'
  },);
};
