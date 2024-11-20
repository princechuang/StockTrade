import moment from 'moment';
//货币格式化
const currencyFormat=(amount:number,fixedLength:number)=>{
    if(!fixedLength){
        fixedLength=2;
    }

    let num=Math.trunc(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const amountStr=amount.toFixed(fixedLength).toString();
   if(amountStr.indexOf(".")>=0){
      num=num+amountStr.substring(amountStr.indexOf("."));
    } 

  return num;
}

//日期格式
const dateChange=(timespan:number,formatString)=>{
  return moment(timespan).format(formatString);
}

export default {
    currencyFormat,
    dateChange
};