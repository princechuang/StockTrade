<template>
    <div>
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getAlljinNangList"
        >   
            <van-row  v-for="jinNang in jinNangList" @click="openJinNang(jinNang)">
                <van-col span="24" class="jinNang">
                    <van-row>
                        <van-col span="18" >
                            <span class="jinNang-title">{{jinNang.title}}</span>
                            <van-tag plain type="primary"
                                v-for="tag in jinNang.tags"
                                class="jinNang-tag">
                                {{ tag.text }}
                            </van-tag>
                        </van-col>
                        <van-col span="6" class="jinNang-glYield">
                            {{ jinNang.glYield }}
                        </van-col>
                    </van-row>
                    <van-row class="jinNang-row-author">
                        <van-col span="18">
                            
                        打理日期:{{ dateChange(jinNang.lastOperateTime) }}
                         | 回撤率:{{ jinNang.maxdrawidx }}
                            
                        </van-col>
                        <van-col span="6" style="text-align: center;">
                            总收益
                        </van-col>
                    </van-row>
                    <van-row class="jinNang-yield-title">
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
                    <van-row class="jinNang-yield-value">
                        <van-col span="6">
                            <van-tag round :type="setTagType(jinNang.monthYield)">
                                {{jinNang.monthYield}}
                            </van-tag>

                        </van-col>
                        <van-col span="6" >
                            <van-tag round :type="setTagType(jinNang.qrtYield)">
                                {{jinNang.qrtYield}}
                            </van-tag>
                        </van-col>
                        <van-col span="6">
                            <van-tag round :type="setTagType(jinNang.yearYield)">
                                {{jinNang.yearYield}}
                            </van-tag>
                        </van-col>
                        <van-col span="6">
                            <van-tag round :type="setTagType(jinNang.selwinidx)">
                                {{jinNang.selwinidx}}
                            </van-tag>
                        </van-col>
                    </van-row>
                </van-col>
            </van-row>
        </van-list>
    </div>
</template>
<script setup lang="ts">
    import { ref,reactive } from 'vue';
    import { Row,Col,Button,List,showToast} from 'vant';
    import moment from 'moment';
    import apiService from '@/api/myApi';
    import { useRouter } from 'vue-router';
    import $router from "@/router/index"

    let loading=ref(false);
    let finished=ref(false);
    let jinNangList:any[]=reactive([]);
    let pageIndex=ref(0);
    let pageSize=ref(20);
    const getAlljinNangList=()=>{
        apiService.getJinNang("",pageSize.value,pageIndex.value)
        .then(res=>{
            //console.log(res.data.detail.list);
            
            jinNangList.push(...res.data.detail.list);//.value=[...jinNangList.value,...res.data.detail.list];
            pageSize.value++;
            //最后一页，停止下拉加载数据
            if(res.data.detail.list.length<pageSize.value){
                finished.value=true;
            }
        })
        .catch(err=>{
            console.log(err);
        })
        .finally(()=>{
            loading.value=false;
            //this.finished=true;
        });
    }
    const dateChange=(timespan:number)=>{
        return moment(timespan).format("YYYY年MM月DD日");
    }
    const setTagType=(value:any)=>{
        if(value && value.indexOf('-')<0){
            return 'primary';
        }else{
            return 'success';
        };
    }
    const openJinNang=(jn:any)=>{
        const router=useRouter();
        //router.push({path:"/open",query:{JinNangId:jn.jinNangId,JinNangTitle:jn.title}});
        $router.push({path:"/open",query:{JinNangId:jn.jinNangId,JinNangTitle:jn.title}});
    }

    //加载
    getAlljinNangList();
</script>
<style scoped >
    .jinNang{
        margin-bottom: 8px;
        border-radius: 6px;
        padding:8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    .jinNang-title{
        text-align: left;
        margin-right: 10px;
    }
    .jinNang-tag{
        font-size:smaller;
        margin-right: 2px;
    }
    .jinNang-glYield{
        font-weight: 600;
        color:crimson;
        text-align: center;
        
    }
    .jinNang-row-author{
        font-size: small;
        color: gray;
        margin-top: 6px;
    }
    .jinNang-yield-title{
        font-size:small;
        font-weight: 600;
        color: midnightblue !important;
        margin-top: 12px;
        text-align: center;
    }
    .jinNang-yield-value{
        font-size:small;
        margin-top: 0px !important;
        text-align: center;
    }
</style>