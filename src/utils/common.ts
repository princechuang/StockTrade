
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

export default {
    currencyFormat
};