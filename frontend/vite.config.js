import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite 설정
 * - base: './'  → 상대 경로로 빌드 (Electron file:// 프로토콜 호환)
 * - build.outDir: 'dist' → 빌드 결과물 위치
 * - server.port: 5173 → 개발 서버 포트 (Electron에서 이 포트로 접속)
 */
export default defineConfig({
  plugins: [react()],

  // 상대 경로 빌드 (Electron file:// 호환 필수)
  base: './',

  // 빌드 설정
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  // 개발 서버 설정
  server: {
    port: 5173,
    strictPort: true,  // 포트 충돌 시 실패 (다른 포트로 변경 방지)
  },
})
