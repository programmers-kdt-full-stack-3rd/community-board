## 커뮤니티 게시판 프로젝트

### 1. 팀원 (이름 클릭 시, 프로필로 이동)

---

-   팀장 : [박상찬](https://github.com/HungKungE)
    -   구현 : (게시글 + 댓글)
-   팀원 : [이예준](https://github.com/yejunian)
    -   구현 : (게시글 + 댓글)
-   팀원 : [신재광](https://github.com/Siltarae)
    -   구현 : (회원 가입 + 로그인)

### 2. 프로젝트 구조 ( 프로젝트 진행하면서 변경 예정 )

---

```sh
📦 community-board
┣ 📂 client # FE 폴더
┃ ┣ 📂 src
┃ ┃ ┣ 📂 api # http request 함수
┃ ┃ ┣ 📂 assets # 렌더링 할 사진 파일
┃ ┃ ┣ 📂 component # 각 기능별 컴포넌트
┃ ┃ ┣ 📂 page # app.tsx에서 routing하는 페이지
┃ ┃ ┣ 📂 state # 전역 state with Zustand
┃ ┃ ┗ 📂 hooks # 커스텀 훅
┃ ┗ 📜 app.tsx # client main
┣ 📂 server # BE 폴더
┃ ┣ 📂 controller # 실제 API 구현
┃ ┣ 📂 route # 라우팅
┃ ┣ 📂 DB # database 관련 기능
┃ ┃ ┣ 📂 context # 각 table 별 접근(CRUD) 로직 정의 (sql문...)
┃ ┃ ┣ 📂 sql # table.sql
┃ ┃ ┣ 📂 model # db data를 server에서 다루기 쉽게 변환하는 model type , interface
┃ ┃ ┗ 📂 mapper # select한 db data를 model로 바꿔줌.
┃ ┗ 📂 middleware # 개발한 middleware 모아놓는 곳
┗ 📂 shared # 공용 타입 및 함수 (로컬 패키지)
```

### 3. 프로젝트 초기 설정

---

#### 1. 프로젝트 clone

```sh
# 프로젝트를 다운 받을 디렉토리에서 해당 명령어 실행
git clone https://github.com/programmers-kdt-full-stack-3rd/community-board.git

# 원격 저장소 연걸 확인
git remote -v
# 만약 제대로 URL이 안뜨면 아래 명령어 실행
git remote add origin https://github.com/programmers-kdt-full-stack-3rd/community-board.git
```

#### 2. 프로젝트에 필요한 패키지 설치

```sh
# 아래 명령어를 순서대로 입력
cd client
sudo npm i # 비밀번호 입력하라 하면 입력하기
cd ../server
sudo npm i
```

#### 3. 프로젝트에서 사용할 환경 변수를 관리하는 .env 파일 생성

```sh
# client 디렉토리와 server 디렉토리에 .env 파일을 생성하기
# 프로젝트 진행하면서 .env 파일에 채워야 하는 내용 언급할 예정

# client ----
VITE_SERVER_ADDRESS
# server ----
PORT
DB_PORT
DB_USER
DB_NAME
DB_PSWORD
ACCESS_TOKEN_KEY
REFRESH_TOKEN_KEY
TEMP_TOKEN_KEY

```
