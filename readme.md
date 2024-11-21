## 개발자 커뮤니티 : CodePlay

## 팀 소개

<table width="100%" align="center">
  <tr>
    <th align="center">문승은</th>
    <th align="center">박상찬</th>
    <th align="center">신재광</th>
    <th align="center">이예준</th>
    <th align="center">정인화</th>
    <th align="center">최호준</th>
  </tr>
  <tr>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/estiemoon">
        <img src="https://avatars.githubusercontent.com/u/102018454?v=4" width="120" height="120" alt="문승은"/><br />
        @estiemoon
      </a>
    </td>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/HungKungE">
        <img src="https://avatars.githubusercontent.com/u/84065412?v=4" width="120" height="120" alt="박상찬"/><br />
        @HungKungE
      </a>
    </td>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/Siltarae">
        <img src="https://avatars.githubusercontent.com/u/24228737?v=4" width="120" height="120" alt="신재광"/><br />
        @Siltarae
      </a>
    </td>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/yejunian">
        <img src="https://avatars.githubusercontent.com/u/8781472?v=4" width="120" height="120" alt="이예준"/><br />
        @yejunian
      </a>
    </td>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/IIINHWAA">
        <img src="https://avatars.githubusercontent.com/u/39130972?v=4" width="120" height="120" alt="정인화"/><br />
        @IIINHWAA
      </a>
    </td>
    <td align="center" valign="top" width="16.6%">
      <a href="https://github.com/hojun3377">
        <img src="https://avatars.githubusercontent.com/u/76763854?v=4" width="120" height="120" alt="최호준"/><br />
        @hojun3377
      </a>
    </td>
  </tr>
</table>

## 1. 개발 환경

## 2. 프로젝트 구조

### 아래 구조에 없는 폴더, 파일은 모두 배포에 사용되므로 기입하지 않음!

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
┣ 📂 nestJs # BE 폴더
┃ ┣ 📂 src
┃ ┃ ┣ 📂 api # api module 폴더
┃ ┃ ┣ 📂 common # guard, decorator, filter 등 서버 설정에 필요한 폴더
┃ ┃ ┣ 📂 config # 환경 변수 관련 (option)
┃ ┃ ┣ 📂 db # db module
┃ ┃ ┣ 📂 health-check # ping test
┃ ┃ ┗ 📂 utils # 기타 util 함수 폴더
┃ ┗ 📜 main.ts # server main
┣ 📂 chat_server # socketIO 채팅 서버 폴더
┃ ┣ 📂 config # 환경 변수 관련
┃ ┣ 📂 controllers
┃ ┣ 📂 events # 소켓 이벤트 정의
┃ ┣ 📂 middlewares # 사용하는 미들웨어
┃ ┣ 📂 services
┃ ┣ 📂 utils # api 요청이나 kafka, redis 관련 함수
┃ ┗ 📜 app.ts # chat_server main
┣ 📂 consumer-server # kafka consumer 서버 폴더
┃ ┗ 📂 src
┃ ┃ ┣ 📂 config # 환경 변수 관련
┃ ┃ ┣ 📂 kafka # consumer 관련 설정
┃ ┃ ┣ 📂 models # broker에 쌓인 채팅 내역을 DB에 create하는 기능 관련
┃ ┃ ┣ 📂 services
┃ ┗ 📜 index.ts # consumer-server main
┣ 📂 sql # 프로젝트 DB sql 파일 모음
┗ 📂 shared # 공용 타입 및 함수 (로컬 패키지)
```

## 3. 역할 분담

## 4. 페이지별 기능

## 5. 인상 깊었던 부분 + 트러블 슈팅

## 6. 프로젝트 개선 방안

## 7. 프로젝트 후기

