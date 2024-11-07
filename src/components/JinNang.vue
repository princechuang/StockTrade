<script>
import { defineComponent } from 'vue';
import { Row,Col,Button,List,showToast} from 'vant';
import axios from 'axios';
import httpUtil from '@/utils/httpUtil';
import moment from 'moment';
import apiService from '@/api/myApi';

export default defineComponent({
    data(){
        return {
            loading:false,
            finished:false,
            jinNangList:[],
            pageIndex:0,
            pageSize:20
        }
    },
    created(){
        
        //this.getAlljinNangList();
        this.pageIndex=0;
        console.log( moment(new Date(1728873270917)).format("YYYY-MM-DD"));
    },
    methods:{
        loadData(){
            this.getAlljinNangList();
            this.pageIndex++;
        },
        getAlljinNangList(){
            apiService.getJinNang("",this.pageSize,this.pageIndex)
            .then(res=>{
                console.log(res.data.detail.list);
                this.jinNangList=[...this.jinNangList,...res.data.detail.list];
                //最后一页，停止下拉加载数据
                if(res.data.detail.list.length<this.pageSize){
                    this.finished=true;
                }
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(f=>{
                this.loading=false;
                //this.finished=true;
            });
        },
        dateChange(timespan){
            return moment(timespan).format("YYYY年MM月DD日");
        },
        setTagType(value){
            if(value && value.indexOf('-')<0){
                return 'primary';
            }else{
                return 'success';
            };
        },
        GetStockList(jn){
            this.$router.push({path:"/openJinNang",query:{JinNangId:jn.jinNangId,JinNangTitle:jn.title}});
        }
    }
});
</script>
<template>
    <div>
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadData"
        >   
            <van-row  v-for="jinNang in jinNangList" @click="GetStockList(jinNang)">
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