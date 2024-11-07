import httpUtil from '@/utils/httpUtil';
import axios  from 'axios';

export function getWxUserInfo(code: string) {
  return httpUtil.get<any>(`/Login/GetWxUserInfo?code=${code}`);
}

export function getWxSignature(url: string) {
  return httpUtil.get<any>(`/My/GetWxSignature?url=${url}`);
}

//获取锦囊列表，传入名称时，仅获取该锦囊信息
const getJinNang=async(name:string,pageSize=99,pageIndex=0)=>{
    const api="/hpapi/MyFollow/GetListPage";
    const data={"PageSize":pageSize,"JinNangName":name,"PageIndex":pageIndex};
    return await axios.post(api,data);
    
}

//获取锦囊内的股票信息
const getStockList=async(jinNangId:string)=>{
    return await axios.post("/hpapi/MyFollow/GetHoldList",{
      "PageSize":999,
      "JinNangId":jinNangId
    });
    
}

export default{
  getJinNang,
  getStockList
}
