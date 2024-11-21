<template>
    <van-nav-bar
        :title="stockName+stockCode"
        left-text="返回"
        left-arrow
        @click-left="goBack"
    />

    <div class="trade-title">
        
        交易记录

    </div>
    <div class="trade-list">
        <van-list 
            @load="getTradeList"
            :finished-text="finishedText"
            v-model:loading="loading"
            :finished="finished"
        >
            <van-row 
                v-for="trade in tradeList.detail"
                class="trade-list-item"
            >
                <van-col span="24">
                    <van-row gutter="20">
                        <van-col span="13">
                            <van-tag :type="setTagColor(trade)">
                                {{ trade.tradeTypeName }}
                            </van-tag>
                            {{ common.dateChange(trade.tradeTime,"YYYY年MM月DD日") }}
                        </van-col>
                        <van-col span="11" class="trade-list-item-pl">
                            <span 
                                v-if="showTotalPl(trade.tradeType)" 
                                :style="{color:trade.totalPl>0?'red':'dodgerblue'}">
                                {{ common.currencyFormat(Number(trade.totalPl/10000),2) }}
                            </span>
                            
                        </van-col>
                    </van-row>
                    <van-row gutter="20">
                        <van-col span="13">
                            <span class="trade-list-item-title">价格</span>
                            {{ trade.dealPriceStr }}
                        </van-col>
                        <van-col span="11">
                            <span class="trade-list-item-title">金额</span>
                            {{ common.currencyFormat(Number(trade.dealAmountStr),2) }}
                        </van-col>
                    </van-row>
                    <van-row gutter="20">
                        <van-col span="13">
                            <span class="trade-list-item-title">数量</span>
                            {{ trade.dealNumber }}
                        </van-col>
                        <van-col span="11">
                            <span  class="trade-list-item-title">
                                盈亏
                            </span>
                            {{ trade.plScale }}
                        </van-col>
                    </van-row>
                    <van-row gutter="20">
                        <van-col span="13">
                            <span class="trade-list-item-title">时间</span>
                            {{ common.dateChange(trade.tradeTime, "HH:mm") }}
                        </van-col>
                        <van-col span="11">
                            <span  class="trade-list-item-title">
                                占比
                            </span>
                            {{ trade.dealPosition }}
                        </van-col>
                    </van-row>
                    <van-divider></van-divider>
                </van-col>
            </van-row>
        </van-list>
        
    </div>
</template>
<script setup lang="ts">
import { reactive,ref } from 'vue';
import { Row,Col,Tag,List } from 'vant';
import common from '@/utils/common';
import service from '@/api/myApi';
import { useRoute } from 'vue-router';
//import $route from "@/router/index"
const route=useRoute();

const poolId=route.query.PoolId;

const stockCode=route.query.StockCode as string;

let stockName=route.query.StockName as string;


let tradeList=reactive({detail:[]as any});

let loading=ref(false);
let finished=ref(false);
let finishedText=ref("没有更多了");
//methods
const getTradeList=()=>{
    //const beginDate=common.dateChange(new Date())
    service.getTradeList(poolId,stockCode,0,0)
    .then(res=>{
        tradeList.detail=res.data.detail;
        loading.value=false;
        finished.value=true;
        if(tradeList.detail.length==0){
            finishedText.value="没有记录";
        }
    })
    .catch(err=>{

    });
}


const setTagColor=(trade)=>{
    return trade.tradeType==2?"primary":"danger"
}

const showTotalPl=(tradeType)=>{
    //卖出，，派息=6
    return tradeType==2;
}
const goBack=()=>{
    history.back();
}
if(poolId && stockCode){
    //getTradeList();
}
</script>
<style scoped>
    .trade-title{
        font-weight: 600;
        margin-bottom: 10px;
    }
    .trade-list-item .van-col{
        padding: 2px 0px;
    }

    .trade-list-item-pl{
        text-align: right;

    }
    .trade-list-item-title{
        opacity: .5;
        margin-right: 8px;
    }

    :deep() .van-nav-bar__left{
        padding: 0px !important
    }
</style>