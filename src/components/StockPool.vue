<template>
    <div>
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadData"
        >   
            <van-row  v-for="stockPool in stockPoolList" @click="openStockPool(stockPool)">
                <van-col span="24" class="stockPool">
                    <van-row>
                        <van-col span="18" >
                            <span class="stockPool-title">
                                {{stockPool.title}}
                            </span>
                            <van-tag plain type="primary"
                                v-for="tag in stockPool.tags"
                                class="stockPool-tag">
                                {{ tag.text }}
                            </van-tag>
                        </van-col>
                        <van-col span="6" class="stockPool-glYield">
                            {{ stockPool.glYield }}
                        </van-col>
                    </van-row>
                    <van-row class="stockPool-row-author">
                        <van-col span="18">
                            
                        打理日期:{{ dateChange(stockPool.lastOperateTime) }}
                         | 回撤率:{{ stockPool.maxdrawidx }}
                            
                        </van-col>
                        <van-col span="6" style="text-align: center;">
                            总收益
                        </van-col>
                    </van-row>
                    <van-row class="stockPool-yield-title">
                        <van-col span="6" >
                            近一月
                        </van-col>
                        <van-col span="6">
                            近三月
                        </van-col>
                        <van-col span="6">
                            近一年
                        </van-col>
                        <van-col span="6">
                            交易胜率
                        </van-col>
                    </van-row>
                    <van-row class="stockPool-yield-value">
                        <van-col span="6">
                            <van-tag round :type="setTagType(stockPool.monthYield)">
                                {{stockPool.monthYield}}
                            </van-tag>

                        </van-col>
                        <van-col span="6" >
                            <van-tag round :type="setTagType(stockPool.qrtYield)">
                                {{stockPool.qrtYield}}
                            </van-tag>
                        </van-col>
                        <van-col span="6">
                            <van-tag round :type="setTagType(stockPool.yearYield)">
                                {{stockPool.yearYield}}
                            </van-tag>
                        </van-col>
                        <van-col span="6">
                            <van-tag round :type="setTagType(stockPool.selwinidx)">
                                {{stockPool.selwinidx}}
                            </van-tag>
                        </van-col>
                    </van-row>
                </van-col>
            </van-row>
        </van-list>
        <van-back-top bottom="100" right="20" />
    </div>
</template>
<script setup lang="ts">
    import { ref,reactive, watchEffect } from 'vue';
    import { Row,Col,Button,List,showToast,BackTop} from 'vant';
    import moment from 'moment';
    import service from '@/api/myApi';
    import { useRoute } from 'vue-router';
    import $router from "@/router/index"
    const route=useRoute();

    let loading=ref(false);
    let finished=ref(false);
    let stockPoolList:any[]=reactive([]);
    let pageIndex=ref(0);
    let pageSize=ref(50);
    let isFollowPage=ref(false);

    //获取所有股票池
    //传入Name,获取指定的股票池
    const getAllStockPoolList=(name="")=>{
        service.getStockPool(name,pageSize.value,pageIndex.value)
        .then(res=>{
            //console.log(res.data.detail.list);
            
            stockPoolList.push(...res.data.detail.list);//.value=[...stockPoolList.value,...res.data.detail.list];
            pageIndex.value++;
            //最后一页，停止下拉加载数据
            //获取指定锦囊时，为关注列表，停止下拉加载数据
            if((res.data.detail.list.length<pageSize.value) && name=="" || name!=""){
                finished.value=true;
            }
        })
        .catch(err=>{
            showToast("获取股票池数据失败");
        })
        .finally(()=>{
            loading.value=false;
        });
    }
    //日期显示格式
    const dateChange=(timespan:number)=>{
        return moment(timespan).format("YYYY年MM月DD日");
    }
    //标签颜色
    const setTagType=(value:any)=>{
        if(value && value.indexOf('-')<0){
            return 'primary';
        }else{
            return 'success';
        };
    }
    
    //查看详细
    const openStockPool=(pool:any)=>{
        $router.push({
            path:"/open",
            query:{
                PoolId:pool.jinNangId,
                PoolTitle:pool.title
            }
        });
    }

    //我关注的股票池
    const getMyFollowList=()=>{
        service.getMyFollowedList()
        .then(followedList=>{
            const stockPoolList=service.getMyFollowedPoolList(followedList);
             stockPoolList.forEach(name=>{
                //获取锦囊信息
                getAllStockPoolList(name as string);
             });
        })
        .catch(err=>{
            showToast("获取数据失败");
        }).finally(()=>{
            loading.value=false;
            finished.value=true;
        });
    }

    //监听路由，加载数据
    watchEffect(ef=>{
        
    });

    //load
    const loadData=()=>{
        //list数据加载，通过路由判断是否需要加载
        
        /*
        if(route && route.name=="myFollow"){
            //我的关注
            getMyFollowList();
        }else{
            
        }*/
        getAllStockPoolList();
    };


</script>
<style scoped >
    .stockPool{
        margin-bottom: 8px;
        border-radius: 6px;
        padding:8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    .stockPool-title{
        text-align: left;
        margin-right: 10px;
    }
    .stockPool-tag{
        font-size:smaller;
        margin-right: 2px;
    }
    .stockPool-glYield{
        font-weight: 600;
        color:crimson;
        text-align: center;
        
    }
    .stockPool-row-author{
        font-size: small;
        color: gray;
        margin-top: 6px;
    }
    .stockPool-yield-title{
        font-size:small;
        font-weight: 600;
        color: midnightblue !important;
        margin-top: 12px;
        text-align: center;
    }
    .stockPool-yield-value{
        font-size:small;
        margin-top: 0px !important;
        text-align: center;
    }
    .van-tag{
        font-size: unset !important;
    }
   
</style>