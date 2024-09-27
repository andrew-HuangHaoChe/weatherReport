<template>
    <div>
        <div class="header">
            <router-link to="/">首頁</router-link>
            <router-link to="/weather">累計雨量長條圖</router-link>
        </div>
    </div>
</template>
<style lang="scss">
.header {
    display: flex;

    a {
        margin-right: 10px;
        text-decoration: none;
        color: #2c3e50;
        font-size: 16px;
        transition: opacity 0.3s;

        &:hover {
            opacity: 0.8;
        }

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>