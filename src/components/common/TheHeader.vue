<template>
  <header class="header-container">
    <nav class="header-nav">
      <router-link to="/">나들이</router-link>
      <div>
        <ul class="header-inner">
          <router-link :to="{ name: 'RegionSearch' }">여행지 검색</router-link>
          <a @click.prevent="onClickTripReset()">여행 계획</a>
          <!-- <li><a href="${root }/board/list?pgno=1&search=&word=">여행 후기</a></li> -->
          <a @click.prevent="onClickPlanReset()">여행 게시판</a>
          <a @click.prevent="onClickBoardReset()">자유 게시판</a>
        </ul>
      </div>
      <div>
        <ul class="header-inner" v-if="!isLogin">
          <li><router-link :to="{ name: 'SignIn' }">로그인</router-link></li>
          <li><router-link :to="{ name: 'SignUp' }">회원가입</router-link></li>
        </ul>
        <ul class="header-inner" v-else>
          <li><router-link :to="{ name: 'MyPage' }">마이페이지</router-link></li>
          <li><a @click.prevent="onClickLogout()">로그아웃</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import router from "@/router/index.js"
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

const userStore = "userStore";
const boardStore = "boardStore";
const planStore = "planStore";

export default {
  name: "TheHeader",
  data() {
    return {
      token: false,
    };
  },
  computed: {
    ...mapState(userStore, ["isLogin", "userId"]),
    ...mapGetters(userStore, ["getLoginState", "getUserId"]),
  },
  methods:{
    ...mapActions(userStore, ["userLogout"]),
    ...mapMutations(boardStore, ["SET_BOARD_INIT"]),
    ...mapMutations(planStore, ["SET_PLANNO", "SET_PGNO"]),
    
    async onClickLogout(){
      await this.userLogout(this.getUserId);
    },

    onClickBoardReset(){
      this.SET_BOARD_INIT();
      if(router.currentRoute.fullPath != '/board/list'){
        router.push('/board/list');
      }
      else{
        router.go(0);
      }
    },

    onClickPlanReset(){
      this.SET_PLANNO(0);
      this.SET_PGNO(1);
      if(router.currentRoute.fullPath != '/plan/list'){
        router.push('/plan/list');
      }
      else{
        router.go(0);
      }
    },
    onClickTripReset(){
      this.SET_PLANNO(0);
      this.SET_PGNO(1);
      if(router.currentRoute.fullPath != '/region/TripPlan'){
        router.push('/region/TripPlan');
      }
      else{
        router.go(0);
      }
    }
  }
};

window.onscroll = function () {
  navScroll();
};

function navScroll() {
  let headerContainerElement =
    document.getElementsByClassName("header-container")[0];
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    headerContainerElement.style.borderBottom =
      "0.1px solid rgba(0, 0, 0, 0.3)";
    headerContainerElement.style.backgroundColor = "rgb(0, 0, 0)";
  } else {
    headerContainerElement.style.borderBottom =
      "0.1px solid rgba(255, 255, 255, 0.3)";
    headerContainerElement.style.backgroundColor = "transparent";
  }
}
</script>

<style>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 0.1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  transition: 0.4s;
  z-index: 1;
  height: 90px;
}

.header-container a {
  color: rgb(255, 255, 255);
  transition: 0.4s;
}

.header-nav {
  max-width: 1280px;
  min-width: 900px;
  margin: 2rem auto 2rem auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-inner {
  display: flex;
  gap: 2rem;
}

.header-container:hover {
  border-bottom: 0.1px solid rgba(0, 0, 0, 0.3) !important;
  background-color: black !important;
}

.header-container a:hover {
  color: rgb(153, 0, 255);
  transition: 0.4s;
}
a{
  cursor:pointer;
}
</style>
