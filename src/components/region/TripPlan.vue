<template>
<div>
    <div class="lump"/>   
    <div class="search">
        <div class="search-info" v-if="!searchToggleBtn">
            <div class="region">
                <form method="GET" action="search">
                <select id="sido" v-model="sidoCode" @change="changeGugun" >
                    <option :value="0" selected>시도 선택</option>
                    <option v-for="sido in sidoData" :key="sido.sidoCode" :value="sido.sidoCode">{{sido.sidoName}}</option>
                </select>
                <select id="gugun" v-model="gugunCode">
                    <option :value="0" selected>구군 선택</option>
                    <option v-for="gugun in gugunData" :key="gugun.gugunCode" :value="gugun.gugunCode" >{{gugun.gugunName}}</option>
                </select>
                <div id="search-form">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" style="color: #5c98ff;" @click="routeSearch('st')" class="search-icon" />
                    <input type="text" id="search-btn"  v-model="start" placeholder="출발지 검색"/>
                </div>
                <div id="search-form">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" style="color: #5c98ff;" @click="routeSearch('dest')" class="search-icon" />
                    <input type="text" id="search-btn"  v-model="dest" placeholder="도착지 검색"/>
                </div>
                </form> 
            </div>
            <div class="notice">
                검색 결과
            </div>
            <search-result @selectedData="getMapInfo" @startPoint="setStart" @endPoint="setDest" :mapData="mapData"></search-result>
        </div>
        <div class="open-info">
            <div class="bar"/>
            <span >
                <font-awesome-icon :icon="['fas', 'caret-right']" style="color: #427bff;" v-if="searchToggleBtn" @click="searchToggle()" class="toggle-btn"/>
                <font-awesome-icon :icon="['fas', 'caret-left']"  style="color: #427bff;" v-else @click="searchToggle()" class="toggle-btn"/>
            </span>
        </div>
        <div>
            <div class="detail-option" v-if="!searchToggleBtn">
                <div v-for="cat in catList" :key="cat.catNum" @click="catChange(cat.catNum)" :tabindex="cat.catNum">
                    <font-awesome-icon v-if="cat.catNum!=0" :icon="['fas', cat.icon]" :style="{color: `${cat.style}`}" />
                    <label>{{cat.name}}</label>
                </div>
            </div>
        </div>
            <the-map :mapData="mapData" :startPoint="startPoint" :destPoint="destPoint"></the-map>
    </div>
</div>
</template>

<script>
import TheMap from '@/components/region/TheMap.vue';
import { sidoList, gugunList, regionSearch } from '@/api/region';
import SearchResult from '@/components/region/SearchResult';
import { mapGetters } from 'vuex';

const planStore = "planStore";

export default {
    components:{
        TheMap,
        SearchResult,
    },
    data(){
        return{
            sidoCode: 0,
            gugunCode: 0,
            category: 0,
            start: "",
            dest: "",
            sidoData: [],
            gugunData: [],
            mapData:[],
            startPoint:[],
            destPoint:[],
            getMapData: false,
            searchToggleBtn: true,
            catList:[
                {catNum:0, icon:'', style:'', name:'미선택'},
                {catNum:12, icon:'plane', style:'#4d9aff', name: '관광지'},
                {catNum:14, icon:'landmark', style:'#90f4c5', name: '문화시설'},
                {catNum:15, icon:'clapperboard', style:'#fda43f', name: '공연행사'},
                {catNum:25, icon:'person-hiking', style:'#9494ff', name: '여행코스'},
                {catNum:28, icon:'baseball', style:'#ff7b00', name: '레포츠'},
                {catNum:32, icon:'hotel', style:'#d84dff', name: '숙박'},
                {catNum:38, icon:'cart-shopping', style:'#ff4f42', name: '쇼핑'},
                {catNum:39, icon:'utensils', style:'#33f1ff', name: '음식점'},
            ]
        }
    },
    computed:{
        ...mapGetters(planStore, ["getPlan", "getPlanNo"]),
    },
    created(){
        console.log(this.getPlan)
        console.log(this.getPlanNo)
        console.log(1234)
        if(this.getPlanNo!=0){
            let stPoint = {
                contentId: this.getPlan.planStart,
                latitude: this.getPlan.planStartLat,
                longitude: this.getPlan.planStartLng,
                keyword: this.getPlan.planStartTitle,
                firstImage : this.getPlan.planImg,
            }
            let endPoint ={
                contentId: this.getPlan.planEnd,
                latitude: this.getPlan.planEndLat,
                longitude: this.getPlan.planEndLng,
                keyword: this.getPlan.planEndTitle,
                firstImage : this.getPlan.planImg,
            }
            this.setStart(stPoint)
            this.setDest(endPoint);

            this.routeSearch()
        }
        if(this.$route.params.sidoCode){
            this.sidoCode= this.$route.params.sidoCode,
            this.changeGugun()
            this.gugunCode= this.$route.params.gugunCode,
            this.category= this.$route.params.category,
            this.keyword= this.$route.params.keyword,
            this.mapData=[{
                sidoCode : this.sidoCode,
                gugunCode : this.gugunCode,
                category : this.category,
                keyword : this.keyword,
                }
            ]
            this.search()
        }
        // sido list load
        sidoList(
            ({data})=>{
                data.map((item)=>{
                    this.sidoData.push(item);
                })
            }, 
            () =>{console.log('sido 로드 실패')})

    },
    methods:{
        changeGugun(){
            gugunList(this.sidoCode,
            ({data}) =>{
                this.gugunData.length = 0;
                data.map((item)=>{
                    this.gugunData.push(item);
                })
            },
            (error) => {console.log(error)}
            )
        },
        search(){
            let sidoInfo = {
                sidoCode : this.sidoCode,
                gugunCode : this.gugunCode,
                category : this.category,
                keyword : this.keyword == "" ? "0" : this.keyword
            }
            regionSearch(sidoInfo, 
            ({data}) => { 
                    let newData = [];
                    data.map((item)=>{
                        newData.push(item);
                    })
                    this.mapData = newData;
                
            })  
        },
        routeSearch(point){
            point=='st' ? this.keyword = this.start : this.keyword = this.dest;
            let sidoInfo = {
                sidoCode : this.sidoCode,
                gugunCode : this.gugunCode,
                category : this.category,
                keyword : this.keyword == "" ? "0" : this.keyword
            }
            regionSearch(sidoInfo, 
            ({data}) => {
                    let newData = [];
                    data.map((item)=>{
                        newData.push(item);
                    })
                    this.mapData = newData;
                
            })
        },
        searchToggle(){
            this.searchToggleBtn = !this.searchToggleBtn;
        },
        catChange(catNum){
            this.category = catNum;
        },
        getMapInfo(mapInfo){
            // map 에 그리기.
            console.log(mapInfo)
            this.getMapData = true;
            this.sidoCode = mapInfo.sidoCode;
            this.changeGugun();
            this.gugunCode = mapInfo.gugunCode;
            this.category = mapInfo.category;
            this.keyword = mapInfo.keyword;
            this.search()
            // search option 변경

        },
        setStart(data){
            this.start = data.keyword;
            this.startPoint = data;
            console.log(this.startPoint)
        },
        setDest(data){
            this.dest = data.keyword;
            this.destPoint = data;
            console.log(this.destPoint)
        }
    }
}

</script>

<style scoped>
@charset "UTF-8";
@font-face {
    font-family: 'S-CoreDream-3Light';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
.lump{
    height:89px;
    background-color:black;
}
.search{
    display: flex;
    flex-direction:row;
    justify-content: center;
    height:calc(100vh - 90px);
    overflow:hidden;
}
.search-info{
    padding: 20px;
    z-index:1;
    height:calc(100vh - 130 px);
    width:20%;
    min-width: 290px;

}
.search-info form{
    display:flex;
    flex-direction:column;
}
#search-container-btn img{
    width:100px;
    height:100px;
}
.region{
    display:flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
    border-bottom : 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px 0;
}
.region > *{
    margin-right: 10px;
    border-radius: 5px;

}

.region select{
    -webkit-appearance:none; /* 크롬 화살표 없애기 */
    -moz-appearance:none; /* 파이어폭스 화살표 없애기 */
    appearance:none; /* 화살표 없애기 */
    width:100%;
    height: 40px;
    text-align : center;
    border: 1px solid #5c98ff;
    border-radius: 5px;
    margin-bottom: 5px;
}

.region #search-btn{
    border-radius: 10px;
}
.open-info{
    z-index: 20;
    width:0;
    border-collapse:collapse; 
}
.bar{
    font-size:16px;
    height: 45%;
}
.toggle-btn{
    background-color:white;
    width:10px;
    height:20px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding:10px;
    cursor:pointer;
}

input{
	padding:6px;
}
input[type="button"]{
    width:100%;
    height:100%;
	border:1px solid gray;
	background-color:white;
}
input[type="text"]{
    padding-left: 20px;
    border : 2px solid gray;
}

#search-form{
    display:flex;
    justify-content: center;
    align-items:center;
    flex-direction: row-reverse;
    border: 3px solid #5c98ff;
    border-radius: 5px;
    padding:5px 12px;
    margin-bottom:5px;
}
#search-form input{
    border: 0;
}
#search-form input:focus, .region select:focus{
    outline:none;
}
.notice{
    padding: 10px;
    border-bottom : 1px solid rgba(0, 0, 0, 0.1);
}
.detail-option{
    position:absolute;
    display:flex;
    justify-content: center;
    align-items: center;
    width:60%;
    min-width: 850px;
    background-color: white;
    left:380px;
    padding: 10px;
    top:100px;
    border: 1px solid rgba(0, 0, 0, .05);
    border-radius: 4px;
    z-index: 2;
}
.detail-option div{
    padding:10px 5px;
    width: 120px;
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items:center;
    border-radius:5px;
}
.detail-option div:focus{
    border: 1px solid #5c98ff;
}

.detail-option *{
    cursor:pointer;
    margin-right:2px;
}
.search-icon{
    cursor:pointer;
}
search-result{
    overflow:scroll;
}

</style>