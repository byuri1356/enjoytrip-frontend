<template>
  <main class="board-list-main">
    <div class="board-list-container">
      <div class="board-list-header">
        <div>
          <h2>자유 게시판</h2>
        </div>

        <form class="board-list-form" @submit.prevent="submitBoardSearch()">
          <input type="hidden" name="pgno" value="${pgno}" />
          <select
            name="search"
            id="board-list-search-select"
            aria-label="검색조건"
            v-model="search"
          >
            <option value="" selected>검색조건</option>
            <option value="boardTitle">제목</option>
            <option value="boardId">작성자</option>
          </select>
          <div class="board-list-key-container">
            <input
              type="text"
              name="word"
              id="board-list-word"
              placeholder="검색어..."
              v-model="word"
            />
            <button id="board-list-search-btn" type="submit">
              <img
                id="board-list-img"
                src="@/assets/search.png"
                alt="search-img load fail"
              />
            </button>
          </div>
        </form>
      </div>

      <div class="board-list-list-container">
        <ul>
          <li>
            <div class="board-list-title">
              <div>제목</div>
              <div>이름</div>
              <div>조회수</div>
              <div>날짜</div>
            </div>
          </li>
          <li
            v-for="board in boards"
            :key="board.boardNo"
            @click="boardView(board.boardNo)"
          >
            <div class="board-list-content">
              <div>{{ board.boardTitle }}</div>
              <div>{{ board.boardId }}</div>
              <div>{{ board.boardHit }}</div>
              <div>{{ board.boardDate }}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="board-list-write-container">
        <span>
          <button
            id="board-list-write-btn"
            class="btn btn-write"
            @click="moveWrite()"
          >
            글쓰기
          </button>
        </span>
      </div>

      <div class="navigator">
        <span>
          <ul class="pagination">
            <li class="page-item">
              <a href="#" class="page-link" @click="onClickPage(1)">최신</a>
            </li>
            <li class="page-item" v-if="navigation.startRange">
              <a href="#" class="page-link" @click="onClickPage(start)">이전</a>
            </li>
            <li class="page-item" v-for="i in indexList" :key="i.index">
              <a
                href="#"
                class="page-link"
                :class="{ select: i.index === navigation.currentPage }"
                @click="onClickPage(i.index)"
                >{{ i.value }}</a
              >
            </li>
            <li class="page-item" v-if="navigation.endRange">
              <a href="#" class="page-link" @click="onClickPage(end)">다음</a>
            </li>
            <li class="page-item">
              <a
                href="#"
                class="page-link"
                @click="onClickPage(navigation.totalPageCount)"
                >마지막</a
              >
            </li>
          </ul>
        </span>
      </div>
    </div>
  </main>
</template>

<script>
import { boardList } from "@/api/board";
import { mapGetters, mapMutations } from "vuex";

const boardStore = "boardStore";

export default {
  data() {
    return {
      search: "",
      word: "",
      start: null,
      end: null,
      boards: [],
      navigation: "",
      indexList: [],
    };
  },
  created() {
    boardList(
      this.getBoardSearch,
      ({ data }) => {
        console.log(data);
        console.log(this.getBoardSearch);
        this.navigation = data.navigation;
        data.boards.map((item) => {
          this.boards.push(item);
        });
        for (
          let i = this.navigation.startPage;
          i <= this.navigation.endPage;
          i++
        ) {
          this.indexList.push({ index: i, value: i });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  },
  computed: {
    ...mapGetters(boardStore, ["getBoardSearch"]),
  },
  watch: {
    navigation: function () {
      this.start = this.navigation.startPage - this.navigation.naviSize;
      this.end = this.navigation.startPage + this.navigation.naviSize;
    },
  },
  methods: {
    ...mapMutations(boardStore, ["SET_BOARD_STATE", "SET_BOARD_PAGE"]),
    submitBoardSearch() {
      this.SET_BOARD_STATE({ search: this.search, word: this.word, pgno: 1 });
      this.$router.go(0);
    },
    onClickPage(page) {
      console.log(page);
      this.SET_BOARD_PAGE(page);
      this.$router.go(0);
    },
    boardView(boardNo) {
      console.log("!!!!!!!!!");
      this.$router.push({ name: "BoardView", params: { boardNo: boardNo } });
    },
    moveWrite() {
      this.$router.push({ name: "BoardWrite" });
    },
  },
};
</script>

<style>
.board-list-main {
  margin: auto;
  width: 100%;
  background: white;
}

.board-list-container {
  width: 80%;
  min-width: 980px;
  margin: auto;
}

h2 {
  font-size: 2rem;
}

.board-list-header {
  margin: auto auto 2rem auto;
  padding: 1rem;
  border-bottom: 3px solid #000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.board-list-form {
  display: flex;
  align-items: center;
}

#board-list-search-select {
  box-sizing: content-box;
  border: 1px solid #ddd;
  height: 50px;
}

#board-list-word {
  padding: 0;
  border: 1px solid #ddd;
  height: 50px;
}

#board-list-search-btn {
  cursor: pointer;
}

.board-list-key-container {
  display: flex;
  align-items: center;
}

#board-list-img {
  width: 42px;
  object-fit: cover;
}

.board-list-sort {
  margin-bottom: 1rem;
  font-size: 15px;
}

.board-list-sort a {
  margin-left: 1rem;
  font-size: 15px;
}

.board-list-list-container ul {
  padding: 0;
}

.board-list-title {
  padding: 1rem;
  background: rgba(230, 230, 230, 0.3);
}

.board-list-content {
  cursor: pointer;
  padding: 1rem;
}

.board-list-title div,
.board-list-content div {
  font-size: 1.3rem;
  display: inline-block;
}

.board-list-title div {
  text-align: center;
}

.board-list-title div:nth-child(1),
.board-list-content div:nth-child(1) {
  width: 60%;
}

.board-list-title div:nth-child(2),
.board-list-content div:nth-child(2) {
  width: 15%;
}

.board-list-title div:nth-child(3),
.board-list-content div:nth-child(3) {
  width: 10%;
}

.board-list-title div:nth-child(4),
.board-list-content div:nth-child(4) {
  width: 15%;
}

.board-list-write-container {
  text-align: right;
  margin: 2rem 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.page-link {
  background-color: transparent;
  cursor: pointer;
  color: #7cacde;
  border-bottom: 0px;
  font-family: Arial;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  margin: 5px 10px;
  padding-bottom: 5px;
  text-shadow: 0px 1px 0px #7cacde;
}

.page-link:hover {
  border-bottom: 1px solid #14396a;
  transition: border-bottom 0.5s ease-in;
}
.page-link:active {
  position: relative;
  top: 1px;
}

.select{
  color:#000;
}
</style>