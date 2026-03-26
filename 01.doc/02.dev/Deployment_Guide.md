# WeGet TODO 데스크톱 앱 배포 가이드 (Deployment Guide)

본 가이드는 현재 개발된 WeGet TODO 앱을 Windows용 실행 파일(`.exe`)로 패키징하여 배포하는 상세 절차를 설명합니다.

---

## 1. 개요
Electron 앱 배포는 크게 두 단계로 나뉩니다.
1. **Frontend Build**: React(Vite) 소스 코드를 최적화된 정적 HTML/JS/CSS 파일로 변환합니다.
2. **Main Packaging**: Electron 엔진과 빌드된 프론트엔드 파일을 결합하여 OS별 실행 파일(`.exe`)로 묶습니다.

## 2. 배포를 위한 사전 준비
배포 도구로 가장 널리 사용되는 `electron-builder`를 권장합니다.

### 2.1 도구 설치 (02.backend 폴더 내)
```bash
cd 02.backend
npm install --save-dev electron-builder
```

### 2.2 네이티브 모듈(SQLCipher) 빌드 설정
본 프로젝트는 `@journeyapps/sqlcipher` 라는 네이티브 C++ 모듈을 사용하므로, 배포 시 대상 플랫폼에 맞게 다시 컴파일(Rebuild)되어야 합니다.
- **필수 도구**: Windows 사용자의 경우 `Node-Gyp` 및 Python, Visual Studio Build Tools가 필요할 수 있습니다.
- 다음 명령어를 실행하여 배포 환경에 맞는 모듈을 생성합니다.
```bash
npx electron-rebuild -f -w @journeyapps/sqlcipher
```

---

## 3. 배포 절차 (Step-by-Step)

### Step 1: 프론트엔드 빌드
먼저 React 코드를 빌드하여 `03.frontend/dist` 폴더를 생성합니다.
```bash
cd 03.frontend
npm run build
```

### Step 2: 빌드 설정 (package.json 수정)
`02.backend/package.json` 파일에 아래와 같은 `build` 설정을 추가합니다.
```json
"build": {
  "appId": "com.weget.todo",
  "productName": "WeGet TODO",
  "directories": {
    "output": "dist"
  },
  "files": [
    "**/*",
    "../03.frontend/dist/**/*"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icon.ico"
  }
}
```

### Step 3: 패키징 실행 (02.backend 폴더 내)
본 프로젝트는 이미 `package.json`에 빌드 스크립트가 구성되어 있습니다.
```bash
cd 02.backend
npm run pack
```
- 실행이 완료되면 `02.backend/dist_build` 폴더 안에 Installer(`.exe`) 및 Portable 실행 파일이 생성됩니다.

---

## 4. 확인 및 배포
1. 생성된 `.exe` 파일을 실행하여 앱이 정상적으로 구동되는지 확인합니다.
2. `weget-todo.db` 파일이 로컬 사용자 경로에 정상적으로 생성되고 암호화가 유지되는지 점검합니다.
3. 최종 결과물을 사용자에게 전달하거나 클라우드 저장소를 통해 배포합니다.

---

## 5. 주의 사항
- **Node.js 버전**: 로컬 개발 환경과 배포 빌드 환경의 Node.js 버전이 동일해야 안정적입니다.
- **보안**: `sqlcipher`의 암호화 키 관리 로직(`safeStorage`)이 실제 배포된 윈도우 환경에서도 정상 작동하는지 확인하기 위해 관리자 권한 실행 테스트가 필요할 수 있습니다.
