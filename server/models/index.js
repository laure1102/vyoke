const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db_config");
const env = process.env.NODE_ENV || "development";
let config = db[env];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require("./User")(sequelize, DataTypes);
const UserObj = require("./UserObj")(sequelize, DataTypes);
const RefreshToken = require("./RefreshToken")(sequelize, DataTypes);
const UserInfo = require("./UserInfo")(sequelize, DataTypes);
const UserSearchEngine = require("./UserSearchEngine")(sequelize, DataTypes);

module.exports = {
  User,
  RefreshToken,
  UserObj,
  UserInfo,
  UserSearchEngine,
}
