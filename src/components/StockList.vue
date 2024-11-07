<script>
import { defineComponent } from 'vue';
import { Row,Col,Cell,Tag } from 'vant';
import axios from 'axios';
import common from '@/utils/common';
import service from '@/api/myApi';
import moment from 'moment';

export default defineComponent({
    data(){
        return{
            
            //marketValue:0,
            stockList:[],
            jinNang:{},
            //货币格式化
            currencyFormat:common.currencyFormat
        }
    },
    created(){
        const jid=this.$route.query.JinNangId;
        this.jinNangTitle=this.$route.query.JinNangTitle;
        if(jid){
            this.getStockList(jid);
            this.getJinNangInfo();
        }
    },
    methods:{
        getStockList(id){
            service.getStockList(id)
            .then(res=>{
                console.log(res);
                this.stockList=res.data.detail;
                
            })
            .catch(err=>{
                console.log(err);
            });
        
        },
        getJinNangInfo(){
            service.getJinNang(this.jinNangTitle)
            .then(res=>{
                console.log(res.data);
                this.jinNang=res.data.detail.list[0];
            })
            .catch(err=>{
                console.log(err);
            })
        },
        dateChange(timespan){
            return moment(timespan).format("YYYY年MM月DD日");
        },
    },
    computed:{
        marketValue(){
            let totalValue=this.stockList.reduce((total,stock)=>{
                return total+stock.marketValue;
            },0);
            return common.currencyFormat(totalValue/10000);
            
        }
    }
});
</script>
<template>
    <div>
        <van-row class="header">
            <van-col span="24">
                <van-row>
                    <van-col span="12">
                        <van-icon name="bag-o" />锦囊:
                        <span>
                            {{ jinNang.title }}
                        </span>
                    </van-col>
                    <van-col span="12">
                        <van-icon name="discount-o" />投资比例:
                        <span>
                            {{ jinNang.mktLevel }}
                        </span>
                    </van-col>
                </van-row>
                <van-row >
                    <van-col span="12">
                        <van-icon name="balance-o" />市值:
                        <span>
                            {{marketValue}}
                        </span>
                    </van-col>
                    <van-col span="12">
                        
                        <van-icon name="discount-o" />总收益:
                        <span>
                            {{ jinNang.glYield }}
                        </span>
                    </van-col>
                </van-row>
                <van-row class="header-date">
                    <van-col span="12">
                        打理日期:
                        {{dateChange(jinNang.lastOperateTime)}}
                    </van-col>
                    <van-col span="12">
                        创建日期:
                        {{ dateChange(jinNang.createTime) }}
                    </van-col>
                </van-row>
                
            </van-col>
            
        </van-row>
        
        <div 
            class="header-sub">持仓明细</div>
        <van-row class="table-header">
            <van-col span="6">名称</van-col>
            <van-col span="6">持仓盈亏</van-col>
            <van-col span="6">持仓/可用</van-col>
            <van-col span="6">成本/现价</van-col>
        </van-row>
        <van-row 
            v-for="stock in stockList"
            class="table-tr"
            :style="{color:stock.totalGailLoss>0?'red':'dodgerblue'}">
            <van-col span="6">
                <div>{{ stock.securitiesName }}</div>
                <div>{{ currencyFormat(stock.marketValue/10000) }}</div>
            </van-col>
            <van-col span="6">
                <div>{{ stock.gainLossScale }}</div>
                <div>{{ currencyFormat(stock.totalGailLoss/10000) }}</div>
            </van-col>
            <van-col span="6">
                <div>{{ stock.secuAmount }}</div>
                <div>{{ stock.usableAmount }}</div>
            </van-col>
            <van-col span="6">
                <div>{{ stock.dilucostPriceStr }}</div>
                <div>{{ stock.newPriceStr }}</div>
            </van-col>
        </van-row>
    </div>
</template>
<style>
    .header{
        font-size: 14px;
        margin-bottom: 12px;
        border-bottom: 2px solid;
    }
    .header span{
        color: blue;
    }
    .header .van-row{
        padding:3px 0px;
    }
    .header .van-row .van-col:last-child{
        text-align: right;
    }
    .header-date{
        color: gray;
        font-size: 12px;
    }
    .header-sub{
        font-weight: 600;
        padding-bottom: 6px;
        border-bottom: 1px solid #efedf0;
    }
    
    .table-header{
       border-bottom: 1px solid #ebedf0; 
       text-align: right;
       padding:3px 2px;
       color: gray;
    }
    .table-tr{
        border-bottom: 1px solid #ebedf0; 
        padding:6px 0px;
        text-align: right;
    }
    .table-header .van-col:first-child,.table-tr .van-col:first-child{
        text-align: left;
    }
    .text-align-right{
        text-align: right;
    }
    
    #main{
        font-size: 12px;
    }
   
</style>