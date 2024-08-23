const {UserSearchEngine,} = require("../models");


const getMySearchEngine = async (uid)=>{
  let list = await UserSearchEngine.findAll({
    where: {
      uid
    }
  });

  return list;
}

const saveMySearchEngine = async (uid, list) =>{
  //删除用户现有的搜索引擎
  await UserSearchEngine.destroy({
    where: {
      uid,
    }
  });
  let rtList = [];
  //再插入新的
  let i = 0;
  for(let data of list){
    if(!!data.name && !!data.addr){
      let dbData = await UserSearchEngine.create({
        uid,
        seid: new Date().getTime() +"_"+i,
        name: data.name,
        addr: data.addr,
        dft: data.dft,
      });
      i++;
      rtList.push(dbData);
    }
  }

  return {
    code: 1,
    list: rtList,
  }
}

module.exports = {
  getMySearchEngine,
  saveMySearchEngine,
}
