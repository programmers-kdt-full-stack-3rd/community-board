## 커뮤니티 게시판 프로젝트

### 1. 팀원 (이름 클릭 시, 프로필로 이동)
--- 
 - 팀장 : [박상찬](https://github.com/HungKungE)
    - 구현 : (게시글 + 댓글)
 - 팀원 : [이예준](https://github.com/yejunian)
    - 구현 : (게시글 + 댓글)
 - 팀원 : [신재광](https://github.com/Siltarae)
    - 구현 : (회원 가입 + 로그인)

### 2. 프로젝트 구조 ( 프로젝트 진행하면서 변경 예정 )
---
```sh
📦 community-board
┣ 📂 client
┃ ┣ 📂 src
┃ ┃ ┣ 📂 assets
┃ ┃ ┣ 📂 component
┃ ┃ ┃ ┣ 📂 Board
┃ ┃ ┃ ┣ 📂 TestMain
┃ ┃ ┃ ┣ 📂 User
┣ 📂 server
┃ ┣ 📂 controller
┃ ┣ 📂 route
┃ ┣ 📂 utils
┗ 📂 sql
 ```

### 3. 프로젝트 초기 설정
---
#### 1. 프로젝트 clone
```sh
# 프로젝트를 다운 받을 디렉토리에서 해당 명령어 실행
git clone {프로젝트 추소}
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
( 아직 없음 )
# server ----
PORT
```