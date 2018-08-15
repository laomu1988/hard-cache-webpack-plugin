<template>
    <div class="app">
        <span class="icon"></span>
        app success..
    </div>
</template>
<script lang="ts">
/* eslint-disable fecs-camelcase */
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {};
    }
});
</script>
<style lang="less" scoped>
.app {
    color: #0f0;
}
.icon {
    background: url('./microphone.png') 100% 100%;
    background-size: 100% 100%;
    display: inline-block;
    width: 20px;
    height: 20px;
}
</style>
