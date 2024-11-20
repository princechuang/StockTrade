
<template>
    <van-row class="row-header">
        <van-col span="24">
            <van-row>
                <van-col span="12">
                    <div class="pool-title">
                        {{ stockPool.title }}
                    </div>
                    <div>
                        <van-tag 
                            plain 
                            type="primary"
                            v-for="tag in stockPool.tags"
                        >
                            {{ tag.text }}
                        </van-tag>
                    </div>
                </van-col>
                <van-col span="12" class="text-align-right">
                    
                    <div class=" text-opacity">
                        打理：{{ dateChange(stockPool.lastOperateTime) }}
                    </div>
                    <div>
                        <van-tag 
                            type="primary" 
                            color="#eee"
                            text-color="gray"
                            class="button-follow"
                            v-if="isFollowedPool==1"
                            @click="setFollowPool(false)"
                        >
                            <van-icon name="success" />
                            已关注锦囊
                        </van-tag>
                        <van-tag  
                            type="primary"
                            class="button-follow"
                            plain
                            v-if="isFollowedPool==-1"
                            @click="setFollowPool(true)"
                        >
                            <van-icon name="plus" />
                            关注锦囊
                        </van-tag>
                    </div>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="24">
                    <div class="text-opacity">总收益</div>
                    <div class="total-yield-text">
                        <van-icon name="discount-o" />
                        {{ stockPool.glYield }}</div>
                    <div class="total-yield-text">
                        <van-icon name="gold-coin-o" />
                         {{ marketValue }}
                    </div>
                </van-col>
            </van-row>
            <van-divider
                :style="{  borderColor: '#fff', paddingTop: '10px' }"
            >
            </van-divider>

            <van-row class="text-align-center text-opacity">
                <van-col span="4">近一周</van-col>
                <van-col span="5">近一月</van-col>
                <van-col span="5">近三月</van-col>
                <van-col span="5">近一年</van-col>
                <van-col span="5">胜率</van-col>
            </van-row>
            <van-row class="text-align-center">
                <van-col span="4">{{stockPool.weekYield}}</van-col>
                <van-col span="5">{{stockPool.monthYield}}</van-col>
                <van-col span="5">{{stockPool.qrtYield}}</van-col>
                <van-col span="5">{{stockPool.yearYield}}</van-col>
                <van-col span="5">{{stockPool.selwinidx}}</van-col>
            </van-row>
        </van-col>
    </van-row>
    
    <div class="stock-list">
        <span class="header-sub">持仓明细</span>
        <van-row class="table-header">
            <van-col span="6">名称/市值</van-col>
            <van-col span="6">持仓盈亏</van-col>
            <van-col span="6">持仓/可用</van-col>
            <van-col span="6">成本/现价</van-col>
        </van-row>
        
        <van-row 
            v-for="(stock,index) in stockList.detail"
            :key="stock.securitiesCode"
            :style="{color:stock.totalGailLoss>0?'red':'dodgerblue'}"
            @click="stockClick(index)"
             class="table-tr"
        >
            <van-col span="24">
                <van-row>
                    <van-col span="6">
                        <div>
                            {{ stock.securitiesName }}
                            <van-icon 
                                name="star-o" 
                                v-if="isFollowedStock(stock.securitiesCode)" 
                            />
                        </div>
                        <div>
                            {{ common.currencyFormat(stock.marketValue/10000,2) }}
                        </div>
                    </van-col>
                    <van-col span="6" class="text-align-right">
                        <div>{{ stock.gainLossScale }}</div>
                        <div>{{ common.currencyFormat(stock.totalGailLoss/10000,2) }}</div>
                    </van-col>
                    <van-col span="6" class="text-align-right">
                        <div>{{ stock.secuAmount }}</div>
                        <div>{{ stock.usableAmount }}</div>
                    </van-col>
                    <van-col span="6" class="text-align-right">
                        <div>{{ stock.dilucostPriceStr }}</div>
                        <div>{{ stock.newPriceStr }}</div>
                    </van-col>
                </van-row>
                <van-row  v-show="stockChooseIndex==index">
                    <van-col 
                        span="24" 
                        class="stock-ribbon">
                        
                        <van-button
                            size="mini"
                            plain
                            @click="setFollowStock(stock,false)"
                            v-if="isFollowedStock(stock.securitiesCode)"
                        >
                            取消关注
                        </van-button>
                        <van-button
                            size="mini"
                            text-color="#fff"
                            @click="setFollowStock(stock)"
                            v-else
                        >
                            <van-icon name="plus" />
                            关注
                        </van-button>
                        <van-button size="mini" @click="goTradeInfo(stock)">交易记录</van-button>
                        
                    </van-col>
                </van-row>
            </van-col>
        </van-row>
    </div>
    
</template>
<script setup lang="ts">
import { reactive,ref,computed, toRef, toRefs } from 'vue';
import { Row,Col,Cell,Tag,Button,showToast,showSuccessToast,showFailToast } from 'vant';
import common from '@/utils/common';
import service from '@/api/myApi';
import moment from 'moment';
import { useRoute } from 'vue-router';
import StockPool from './StockPool.vue';
import $router from "@/router/index"
const route=useRoute();

//data
let stockList=reactive({detail:[]as any});
let stockPool:any=ref({});
let loading=ref(true);
let isFollowedPool=ref(0);//0未获取到关注信息；1已关注，-1未关注
let followedStockList=reactive({detail:[]as any});
let stockChooseIndex=ref(-1);
//关注的所有数据
let myFollowedList:any[]=reactive([]);

const poolId=route.query.PoolId;
const poolTitle=route.query.PoolTitle;
//method
//股票池里的股票信息
const getStockList=(id:number)=>{
    service.getStockList(id)
    .then(res=>{
        stockList.detail.push(...res.data.detail);
        //重组数据，增加isFollowed属性
       
        loading.value=false;
    })
    .catch(err=>{
        showFailToast("加载数据失败");
    });
};

//获取股票池
const getStockPoolInfo=()=>{
    const stockPoolTitle=route.query.PoolTitle as string;
    service.getStockPool(stockPoolTitle)
    .then(res=>{
        stockPool.value=res.data.detail.list[0];
    })
    .catch(err=>{
        showFailToast("获取数据失败");
    })
}
const dateChange=(timespan:number)=>{
    return moment(timespan).format("YYYY-MM-DD");
}
const marketValue=computed(()=>{
    let totalValue=stockList.detail.reduce((total,stock)=>{
        
        return total+stock.marketValue;
    },0);
    return common.currencyFormat(totalValue/10000,2);
});

//我的关注信息，
const getMyFollowedList=()=>{
    service.getMyFollowedList()
    .then(data=>{
        myFollowedList=[...data];
        //关注的股票
        myFollowedStockListByPoolTitle();
    })
    .catch();
}

const myFollowedStockListByPoolTitle=()=>{
    //获取被关注的当前锦囊股票
    followedStockList.detail= service.getFollowedStockByPool(myFollowedList,poolTitle);
    
    //是否关注当前锦囊,股票列表里存在“”则表示关注股票池
    isFollowedPool.value=followedStockList.detail.includes("")?1:-1;
}

//关注/取消关注股票池
const setFollowPool=(isFollow_)=>{
    service.setPoolFollow(poolTitle,"",isFollow_)
    .then(res=>{
        if(res.status==200 &&res.data.detail){
            showSuccessToast(`成功${isFollow_?"关注":"取消关注"}锦囊`);
            isFollowedPool.value=isFollow_?1:-1;
        }else{
            showFailToast("操作失败");
        }
    })
    .catch(err=>{});
}

let calling=ref(false);
//关注/取消 股票关注
const setFollowStock=(stock,isFollow_=true)=>{
    if(calling.value){
        //重复调用
        return;
    }
    calling.value=true;
    const stockCode=stock.securitiesCode;
    service.setPoolFollow(stockPool.value.title,stockCode,isFollow_)
    .then(res=>{
        if(res.status==200 &&res.data.detail){
            if(isFollow_){
                followedStockList.detail.push(stockCode);
                stock.isFollowed=true;
            }
            else{
                followedStockList.detail=followedStockList.detail.filter((code)=>{
                    return code!=stockCode;
                });
                stock.isFollowed=false;
            }
            showSuccessToast(`${isFollow_?'已关注':'已取消关注'}${stock.securitiesName}`);
        }
    })
    .catch(err=>{
        showFailToast("操作失败");
    }).finally(()=>{
        calling.value=false;
    });
}


//判断当前股票是否被关注，返回true/false
const isFollowedStock=(stockCode)=>{
    return followedStockList.detail.includes(stockCode);
}

const goTradeInfo=(stock)=>{
    
    $router.push({
        path:"/trade",
        query:{
            PoolId:poolId,
            StockCode:stock.securitiesCode,
            StockName:stock.securitiesName
        }
    });
}

const stockClick=(index)=>{
    stockChooseIndex.value=index;
}


//load
//存在参数，查询股票列表
if(poolId){
    //1.获取股票池信息
    getStockPoolInfo();
    getStockList(Number(poolId));
    //查询关注信息
    getMyFollowedList();
}

</script>
<style scoped>
   
    .row-header{
        background-color: #046bcc;
        color:#fff;
        padding: 10px;
        font-size:14px;
        margin-bottom: 15px;
    }
    .row-header .van-row:nth-child(2){
        margin-top: 10px;
    }
    .text-opacity{
        opacity:0.5;
    }
    .text-align-center{
        text-align: center;
    }
    .text-align-right{
        text-align: right;
    }
    .pool-title{
        font-size: 20px;
        font-weight: 600;
        margin-right: 20px;
    }

    .total-yield-text{
        font-size: 24px;
        font-weight: 600;
    }
    /** */
    .stock-list{
        padding: 10px;
    }
    .header-sub{
        font-weight: 600;
        padding:5px 0px;
    }
    .button-follow{
        display: block;
        float: right;
        width: 60%;
        text-align: center;
        margin-top: 10px;
    }
    
    .table-header{
       border-bottom: 1px solid #ebedf0; 
       text-align: right;
       padding:3px 2px;
       color: gray;
    }
    .table-header .van-col{
        font-size: 14px;
    }
    .table-tr{
        border-bottom: 1px solid #ebedf0; 
        padding:6px 0px;
        font-size: 14px !important;
    }
    .table-tr .van-col{
        font-size: 14px !important;
    }
    .table-header .van-col:first-child,.table-tr .van-col:first-child{
        text-align: left;
    }
    .text-align-right{
        text-align: right;
    }
    
   .button_row button{
        width: 100%;
        margin-top: 10px;
   }

   .stock-ribbon{
        padding: 2px;
        color: black;
        text-align: right !important;
   }

   .stock-ribbon button{
        margin-left: 10px;
   }

</style>