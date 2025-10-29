# Bookmark Hub

주제별로 북마크를 정리하고 한눈에 확인할 수 있는 웹 기반 북마크 관리 애플리케이션입니다.

## 주요 기능

### 북마크 그룹 관리
- 그룹 추가, 삭제, 이름 변경, 설명 편집
- 비밀번호 보호 기능으로 그룹 보안
- QR 코드 생성으로 모바일 기기에서 쉽게 접근
- 검색 기능 (그룹명, 설명, 북마크 제목)

### 북마크 뷰어
- iframe을 통한 웹사이트 미리보기
- 드래그 앤 드롭으로 북마크 순서 변경
- 북마크 추가, 수정, 삭제
- 새 탭에서 열기 옵션
- LocalStorage 기반 데이터 저장

## 기술 스택

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3.3
- QRCode.js
- Google AdSense

## Vercel 자동 배포 설정

이 프로젝트는 모든 브랜치에서 자동으로 Vercel에 배포되도록 설정되어 있습니다.

### 1. Vercel 프로젝트 연동

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택 (joshweb83/bookmark)
4. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (비워두기)
   - **Output Directory**: (비워두기)
5. "Deploy" 클릭

### 2. 작업 브랜치를 Production으로 자동 배포 설정

**중요**: 어떤 브랜치에서 작업하더라도 자동으로 Production에 배포되도록 설정하려면:

#### GitHub 기본 브랜치 변경:
1. GitHub 저장소 → **Settings** → **Branches**
2. **Default branch** 섹션에서 현재 작업 브랜치로 변경
   - 예: `claude/project-check-011CUbHw14BAeuTGrd13idn1`
3. **Update** 클릭

#### Vercel 자동 연동:
- Vercel은 GitHub의 기본 브랜치를 자동으로 Production으로 인식
- 별도 설정 불필요
- Push 즉시 Production URL에 자동 배포

### 3. 배포 동작 방식

- **GitHub 기본 브랜치**: Production 배포 (실제 서비스 URL)
  - 현재: `claude/project-check-011CUbHw14BAeuTGrd13idn1`
- **기타 모든 브랜치**: Preview 배포 (고유한 미리보기 URL)
- **자동 배포**: Push 즉시 자동으로 배포 시작
- **상태 확인**: GitHub 및 Vercel 대시보드에서 확인 가능

### 4. 환경 변수 (필요시)

Vercel Dashboard → Project → Settings → Environment Variables에서 설정:

```
GOOGLE_ADSENSE_CLIENT=ca-pub-7384099933473977
```

## 로컬 개발

### 실행 방법

1. 저장소 클론:
```bash
git clone https://github.com/joshweb83/bookmark.git
cd bookmark
```

2. 로컬 서버 실행 (Python):
```bash
python -m http.server 8000
# 또는
python3 -m http.server 8000
```

3. 브라우저에서 접속:
```
http://localhost:8000
```

### 또는 Live Server 사용 (VS Code)

VS Code의 Live Server 확장 프로그램을 사용하여 `index.html` 실행

## 파일 구조

```
bookmark/
├── index.html          # 메인 관리 페이지
├── viewer.html         # 북마크 뷰어 페이지
├── management.js       # 관리 페이지 로직
├── viewer.js          # 뷰어 페이지 로직
├── style.css          # 스타일시트
├── ads.txt            # Google AdSense 설정
├── vercel.json        # Vercel 배포 설정
└── README.md          # 프로젝트 문서
```

## 보안 기능

- 그룹별 비밀번호 설정 가능
- 마스터 비밀번호로 모든 그룹 접근 (기본값: `0070`)
- 비밀번호 검증 후에만 그룹 삭제 및 수정 가능

> ⚠️ **보안 참고**: 마스터 비밀번호는 클라이언트 코드에 하드코딩되어 있으므로, 민감한 정보는 저장하지 마세요.

## 데이터 저장

- 모든 데이터는 브라우저의 LocalStorage에 저장됩니다
- 서버 없이 완전히 클라이언트 사이드에서 동작합니다
- 브라우저 데이터를 삭제하면 모든 북마크가 사라지니 주의하세요

## 라이선스

MIT License

## 기여

이슈 및 PR은 언제나 환영합니다!
