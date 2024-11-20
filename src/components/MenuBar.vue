<template>
    <van-tabbar v-model="active">
        <van-tabbar-item 
            icon="star-o"
            to="/my-follow"
            name="myFollow"
        >
            我的关注
        </van-tabbar-item>
        <van-tabbar-item 
            icon="newspaper-o"
            to="/pool-list"
            name="poolList"
        >
        锦囊
        </van-tabbar-item>
    </van-tabbar>
</template>
<script setup lang="ts">
    import {watch, ref} from 'vue';
    import { Tabbar,TabbarItem } from 'vant';
    import { useRouter } from 'vue-router';
    import $route from "@/router/index"
    const router=useRouter();

    const active=ref("myFollowed");

    watch(()=>router.currentRoute.value,(to,back)=>{
        active.value=to.name as string;
    });
</script>