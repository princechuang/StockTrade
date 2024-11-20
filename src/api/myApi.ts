import httpUtil from '@/utils/httpUtil';
import axios  from 'axios';
import {apiHost} from '@/utils/configs';

//微信授权登录获取UserId
export function getQYWxUserInfo(code:string){
  return httpUtil.get<any>(`/user/LoginQYWeChat?code=${code}`);
}
export function  getUserInfoByToken (token:string){
  return axios.get(`${apiHost}/user/GetUser?token=${token}`);
}
//获取锦囊列表，传入名称时，仅获取该锦囊信息
const getStockPool=async(name:string,pageSize=99,pageIndex=0)=>{
    return await axios.post(`${apiHost}/MyFollow/GetListPage`,{
      "PageSize":pageSize,
      "JinNangName":name,
      "PageIndex":pageIndex
    });
    
}

//获取锦囊内的股票信息
const getStockList=async(jinNangId:number)=>{
    return await axios.post(`${apiHost}/MyFollow/GetHoldList`,{
      "PageSize":999,
      "JinNangId":jinNangId
    });
    
}

//我关注的锦囊,返回锦囊名称列表
const getMyFollowedList=async()=>{
  const result= await axios.get(`${apiHost}/MyFollow/GetMyFollows?userId=${userId}`);
  if(result.status==200){
    const followList=[...result.data.detail];
    return followList;
  }
  return [];
}

//关注的锦囊名称列表
const getMyFollowedPoolList=(followedList)=>{
    const newList=new Set(followedList.map((jn:any)=>{return jn.stockPool;}));
    return Array.from(newList);
}


//获取锦囊下关注的股票列表
const getFollowedStockByPool=(followedList,poolName)=>{
  const followList=followedList
    .filter(pool=>{
      return pool.stockPool==poolName
    });
  
  //去重
  const newList=new Set(followList.map((jn:any)=>{return jn.stockCode;}));
  return Array.from(newList);
}

//设置关注
const setPoolFollow=async(stockPool,stockId,isFollow)=>{
  return await axios.get(`${apiHost}/MyFollow/Follw?userId=${userId}&stockPool=${stockPool}&stockCode=${stockId}&isFollow=${isFollow}`);
}

//获取股票池交易记录
const getTradeList=async(poolId,stockCode,startDate,endDate)=>{
  //日期格式要求:20240101
  return await axios.post(`${apiHost}/MyFollow/GetTradeList`,{
    "JinNangId":poolId,
    "SecuritiesCode":stockCode,
    "BeginTme":startDate,
    "EndTime":endDate,
  });
}

//企业微信用户UserId
const userId=sessionStorage.getItem("userId");

export default{
  getStockPool,
  getStockList,
  getMyFollowedList,
  getMyFollowedPoolList,
  getFollowedStockByPool,
  setPoolFollow,
  getTradeList,
  userId
}
