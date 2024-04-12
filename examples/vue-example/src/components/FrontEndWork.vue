<template>
    <Header></Header>
    <div class="Works">
        <div class="month-select">
            <div class="current">
                月度周期：2024年
                <div class="month">
                    <div class="cur"></div>
                    <div class="month-list">
                        <div class="month-option" :class="{cur: curMonth == month, hide: curMonth != month && !showSelectMonth}" :key="month" v-for="month in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12]" @click="selectMonth(month)">{{ month }}</div>
                    </div>
                </div>月
            </div>
        </div>
        <div class="heros-area">
            <div class="hero" @click="showMe(item)" v-for="item in heros" :key="item.name" :class="{cur: item.name==showingMe?.value?.name, 'no-cur': showingMe?.value?.name && item.name!=showingMe?.value?.name}">
                <div class="clear-cur" v-show="item.name==showingMe?.value?.name" @click="clearShowMe($event)">收起</div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div>
                        <div class="ability">擅长：{{item.ability}}</div>
                        <div class="duty">主要负责：{{item.duty}}</div>
                    </div>
                </div>
                <div class="work-theme">
                    <div class="main-work">
                        <span>本月主题： </span>
                        {{ item.monthTheme }}
                    </div>
                    <div class="week-work">
                        <div class="sub">
                            <div class="time">1.15 - 1.19</div>
                            <div class="thing">切第一周图</div>
                        </div>
                        <div class="sub">
                            <div class="time">1.22 - 1.26</div>
                            <div class="thing">切第二周图</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './Header.vue';
import { 
    reactive,
    ref,
    //  toRefs
     } from 'vue';
export default {
    components: {
        Header
    },
    setup() {
        let heros = [
            
            {
                name: '仝宗华',
                ability: '移动端H5、AppHybrid、云游戏',
                duty: '坦克世界云游戏、战舰世界云游戏、社区等',
                monthTheme: '切图、页面切图、切图页面, 切图、页面切图、切图页面',
                weekWork: [
                    {
                        time: '1.15 - 1.19',
                        work: '切第一周图'
                    },
                    {
                        time: '1.22 - 1.26',
                        work: '切第二周图'
                    },
                    
                ]
            }
            ,
            {
                name: '赵银灿',
                ability: '移动端H5、AppHybrid、云游戏',
                duty: '坦克世界云游戏、战舰世界云游戏、社区等',
                monthTheme: '切图、页面切图、切图页面, 切图、页面切图、切图页面',
                weekWork: [
                    {
                        time: '1.15 - 1.19',
                        work: '切第一周图'
                    },
                    {
                        time: '1.22 - 1.26',
                        work: '切第二周图'
                    },
                    
                ]
            }
            ,
            {
                name: '李云龙',
                ability: '移动端H5、AppHybrid、页面3D场景等',
                duty: 'WCL赛事竞猜、模型渲染场景构建、坦克助手插件PC端等',
                monthTheme: '切图、页面切图、切图页面, 切图、页面切图、切图页面',
                weekWork: [
                    {
                        time: '1.15 - 1.19',
                        work: '切第一周图'
                    },
                    {
                        time: '1.22 - 1.26',
                        work: '切第二周图'
                    },
                    
                ]
            },
            {
                name: '李丹丹',
                ability: '移动端H5、AppHybrid、云游戏',
                duty: '坦克世界云游戏、战舰世界云游戏、社区等',
                monthTheme: '切图,页面切图、切图页面',
                weekWork: [
                    {
                        time: '1.15 - 1.19',
                        work: '切第一周图'
                    },
                    {
                        time: '1.22 - 1.26',
                        work: '切第二周图'
                    },
                    
                ]
            }
            ,
            {
                name: '宋阳',
                ability: '移动端H5、AppHybrid、云游戏',
                duty: '坦克世界云游戏、战舰世界云游戏、社区等',
                monthTheme: '切图、页面切图、切图页面, 切图、页面切图、切图页面',
                weekWork: [
                    {
                        time: '1.15 - 1.19',
                        work: '切第一周图'
                    },
                    {
                        time: '1.22 - 1.26',
                        work: '切第二周图'
                    },
                    
                ]
            }
        ]
        const showingMe = reactive({value: null})
        const showMe = (item)=>{
            showingMe.value = item;
            console.info(showingMe)
        }
        const clearShowMe = (e)=>{
            e.stopPropagation();
            showingMe.value = null;
            console.info(showingMe)
        }
        let curMonth = ref((new Date()).getMonth() + 1)
        const selectMonth = (month)=>{
            if (showSelectMonth.value) {
                curMonth.value = month
                showSelectMonth.value = false
            }else {
                showSelectMonth.value = true
            }
        }
        let showSelectMonth = ref(false)
        console.info(curMonth)
        return {
            heros,
            showMe,
            showingMe,
            clearShowMe,
            curMonth,
            selectMonth,
            showSelectMonth
            // ...toRefs()
            
        }
        
    },
}
</script>
<style>
    body {
        background-color: rgb(247, 246, 246);
    }
    #app {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
</style>
<style lang="scss" scoped>

    .header {

    }
    .Works {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .month-select {
            overflow: visible;
            height: 70px;
            .current {
                text-align: center;
                font-size: .2rem;
                line-height: 50px;
                margin-top: .2rem;
                color: #333;
                display: flex;
                justify-content: center;
                .month {
                    position: relative;
                    .cur {
                        font-size: .2rem;
                    }
                    .month-list {
                        // position: absolute;
                        z-index: 1;
                        display: flex;
                        flex-wrap: wrap;
                        max-width: 1.5rem;
                        .month-option {
                            width: .2rem;
                            padding: .12rem;
                            margin-top: .02rem;
                            margin-right: .02rem;
                            font-size: .2rem;
                            line-height: .2rem;
                            cursor: pointer;
                            text-align: center;
                            background-color: white;
                            transition: all .2s;
                            
                            &:hover {
                                color: white;
                                background-color: gray;
                            }
                            &.cur {
                                color: rgb(255, 255, 255);
                                background-color: rgb(192, 192, 192);
                            }
                            &.hide {
                                transition: all 0s;
                                position: absolute;
                                // display: none;
                                transform: scale(0);

                                opacity: 0
                            }
                        }
                    }
                }
            }
        }
        .heros-area {
            flex-grow: 1;
            justify-content: center;
            align-items: center;
            display: flex;
            .hero {
                &:hover {
                    .info {
                        .ability {
                            max-height: 2rem;
                        }
                        .duty {
                            max-height: 2rem;
                        }
                    }
                }
                &.cur {
                    cursor: auto;
                    width: 10rem;
                    .info {
                        display: flex;
                        align-items: flex-end;
                        .name {
                            margin-right: .2rem;
                            font-size: .4rem;
                            transition: all .3s;
                            height: auto;
                            color: white;
                        }
                        .ability {
                            max-height: 2rem;
                        }
                        .duty {
                            max-height: 2rem;
                        }
                    }
                }
                &.no-cur {
                    width: 0;
                }
                overflow: hidden;
                transition: width .3s;
                cursor: pointer;
                flex-shrink: 0;
                margin: 0 .2rem;
                width: 2rem;
                position: relative;
                &:nth-child(1) {
                    --theme-color: rgb(252, 175, 8);
                }
                &:nth-child(2) {
                    --theme-color: rgb(232, 17, 53);
                }
                &:nth-child(3) {
                    --theme-color: rgb(97, 66, 252);
                }
                &:nth-child(4) {
                    --theme-color: rgb(36, 191, 252);
                }
                &:nth-child(5) {
                    --theme-color: rgb(14, 207, 104);
                }
                .clear-cur {
                    position: absolute;
                    color: var(--theme-color);
                    background-color: white;
                    right: 0;
                    top: 0;
                    font-size: .18rem;
                    padding: .1rem;
                    cursor: pointer;
                }
                .info {
                    background-color: var(--theme-color);
                    padding: .2rem;
                    .name {
                        writing-mode: vertical-lr;
                        font-style: oblique;
                        font-size: .6rem;
                        font-weight: 500;
                        height: 2rem;
                        color: #111;
                    }
                    .ability {
                        color: white;
                        font-size: .16rem;
                        font-style: oblique;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height .5s;
                        margin-bottom: .12rem;
                    }
                    .duty {
                        color: white;
                        font-size: .16rem;
                        font-style: oblique;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height .5s;
                        // transition-delay: .1s;
                    }
                }
                .work-theme {
                    background-color: white;    
                    font-style: oblique;
                    .main-work {
                        min-width: 1.76rem;
                        height: 1.5rem;
                        font-size: .2rem;
                        padding: .12rem;
                        font-style: normal;
                        span {
                            font-size: .2rem;
                            color: #666;
                            font-style: oblique;
                        }
                    }
                    .week-work {
                        max-height: 0;
                        overflow: hidden;
                        .sub {
                            .time {
                                font-size: .18rem;
                            }
                            .thing {
                                font-size: .18rem;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
