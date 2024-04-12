<template>
    <div class="header">
        <div class="inner">
            <div class="link">主页 HOME</div>
            <div class="link">工作内容 WORKS</div>
        </div>
    </div>
</template>
<script>
export default {
    setup() {
        
    },
}
</script>
<style lang="scss" scoped>
    .header {
        display: flex;
        width: 100%;
        .inner {
            width: 100%;
            background-color: gray;
            display: flex;
            padding: 0 1rem;
            .link {
                margin-right: .4rem;
                font-size: .24rem;
                color: white;
                padding: .1rem .2rem;
                cursor: pointer;
                &:hover {
                    color: gray;
                    background-color: white;    
                }
            }
        }
    }
</style>