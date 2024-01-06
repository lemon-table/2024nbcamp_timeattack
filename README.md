# ⏲ 내일배움캠프 타임어택 해커톤

## 📌 프로젝트 개요
E-Commerce 의 기본 제품 요소인 로그인, 회원가입 기능 개발.

### 🎯 프로젝트 목표
  1. **프로젝트 설정:**
      - Nest.js 프로젝트 생성
      - 선호하는 ORM 설정 및 모델 작성
      - JWT 모듈 설치 및 설정
  2. **회원가입 API 구현:**
      - 사용자 모델 정의 및 데이터베이스에 저장
      - 유효성 검사를 통한 데이터 입력 확인
          - 이메일, 비밀번호, 이름, 전화번호 유효성 검증
              - 회원가입 버튼 클릭시 검증
              - 올바르지 않으면 오류를 표시
      - 비밀번호 암호화
  3. **로그인 API 구현:**
      - 이메일 유효성 검사
          - 로그인 버튼 클릭 시 검사
      - 이메일을 찾을 수 없음 오류 처리
      - 이메일-비밀번호 불일치 오류 처리
      - JWT 토큰 생성 및 반환
      - Passport를 사용하여 로그인 인증 처리
  4. **인증 미들웨어 구현:**
      - JWT 토큰을 사용하여 인증을 처리하는 미들웨어 작성
      - `accessToken` 및 `refreshToken` 처리 구현
  5. **에러 핸들링 및 보안 강화:**
      - 에러 핸들링을 위한 미들웨어 구현
      - 보안 측면에서의 고려 사항 추가 (예: CSRF, 보안 헤더 등)

## 📌 API 명세서
[2024nbcamp_timeattack API 명세서](https://docs.google.com/spreadsheets/d/1r_3E0aF1DngUuPHyYPowZjJmNZiI7vDTn6ZFSSakRdQ/edit?usp=sharing) / swagger url:http://localhost:3000/api#

## 📌 ERD
![image](https://github.com/lemon-table/2024nbcamp_timeattack/assets/147114778/19493c30-fe96-4094-be4b-f678795606f2)

## 📌 구현하며 중요하게 생각했던 점
최대한 가독성 있는 코드를 구현하려 했고, NestJS의 활용할 수 있는 기능을 최대한 사용하려고 했습니다. 그리고 구현하면서 특히 비밀번호 저장시 hash 과정을 넣어 DB에 보관하더라도 좀 더 안전하게 하도록 하였습니다. 

access token과 refresh token 발급은 구현하였지만 access token 만료시 refresh token 확인하여 refresh token이 유효하다면 access token 재발급하는 로직은 구현하지 못하였습니다. 단순히 access token만 발급하게 되었을 때 비교쩍 짧은 유효시간이 적용되어 사용자가 실제 페이지 사용시 잦은 토큰 만료 오류를 방지하고자 refresh token과 같이 검증하는 과정을 만드려 하였으나 시간내 구현하지 못한점이 아쉽습니다.

이같이 사용자의 개인정보를 최대한 보호하고 페이지 사용을 원활하게 하기 위한 관점으로 이번 프로젝트 진행하였습니다.
