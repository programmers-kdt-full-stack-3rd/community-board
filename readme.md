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

### FE
<div>
    <img src="https://img.shields.io/badge/react-0088CC?style=for-the-badge&logo=react&logoColor=white">
    <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
    <img src="https://img.shields.io/badge/Zustand-FF6C37?style=for-the-badge&logo=zustand&logoColor=white">
</div>
  
### BE
<div>
    <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
    <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
    <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/typeOrm-FE0803?style=for-the-badge&logo=typeorm&logoColor=white">
</div>

### 협업 툴
<div>
    <img src="https://img.shields.io/badge/github-000000?style=for-the-badge&logo=github&logoColor=white">
    <img src="https://img.shields.io/badge/notion-ECD53F?style=for-the-badge&logo=notion&logoColor=black">
    <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white">
</div>

### 배포
<div>
    <img src="https://img.shields.io/badge/amazon ec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
    <img src="https://img.shields.io/badge/amazon s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">
    <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
</div>

### 기타
- 디자인 : Figma
- ERD : DB diagram

## 2. 프로젝트 구조

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

### 문승은 ( BE )
- nestJS API 마이그레이션
    - 상세 내용 쓰기
- 테스트 코드 작성

### 박상찬 ( FE, BE, DevOps )
- React
    - 게시판 컴포넌트
    - 게시글 컴포넌트
    - 채팅 컴포넌트
- (구) express API 개발
    - 게시글 (post) CRUD
    - 채팅 (chat) CR
- nestJs
    - 테스트 코드 작성
- 배포
    - ec2 배포
    - react + nginx + docker를 통한 배포 환경 구축

### 신재광
- (구) express API 개발
    - 회원 (user) CRUD
    - 권한 & 인가 ( rbac ) 시스템
- nestJs 마이그레이션

### 이예준
- (구) express API 개발
    - 댓글 (comment) CRUD
    - 좋아요 ( like ) CRUD
- React
    - 상세 내용 추가해주세요

### 정인화
- React
   - 상세 내용 추가해주세요 

### 최호준
- 채팅 ( chat ) 기능
    -  socket.io 서버 구현
    -  kafka 도입
    -  consumer 구현
- 포맷팅 통일
    - prettier 도입 및 적용

## 4. 페이지별 기능

## 5. 인상 깊었던 부분 + 트러블 슈팅

## 6. 프로젝트 개선 방안

## 7. 프로젝트 후기

