/**
 * Tailwind CSS v3 설정 파일
 *
 * [Tailwind CSS란?]
 * Tailwind는 "유틸리티 퍼스트(utility-first)" CSS 프레임워크입니다.
 * 미리 정의된 CSS 클래스(예: 'bg-blue-500', 'p-4', 'text-lg')를
 * HTML에 직접 적용하여 스타일링합니다.
 *
 * [content 옵션]
 * Tailwind가 사용되는 파일 경로를 지정합니다.
 * 여기 지정된 파일들에서 사용된 클래스만 최종 CSS에 포함됩니다.
 * → 사용하지 않는 CSS가 자동 제거되어 번들 크기가 줄어듭니다.
 *
 * [theme.extend]
 * 기본 제공 디자인 토큰(색상, 폰트 등)을 확장하거나 덮어씁니다.
 * extend 안에 작성하면 기본값을 유지하면서 추가합니다.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 클래스를 사용하는 파일 경로
  // 이 파일들을 스캔하여 사용된 클래스만 CSS에 포함
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  // 테마 확장: 프로젝트 전용 디자인 토큰 추가
  theme: {
    extend: {
      // 커스텀 색상 (WeGet 브랜드 팔레트)
      // 사용법: bg-brand, text-brand-light 등
      colors: {
        brand: {
          DEFAULT: '#667eea',  // 기본 브랜드 색
          light: '#818cf8',    // 밝은 브랜드
          dark: '#4f46e5',     // 어두운 브랜드
          accent: '#764ba2',   // 강조 색
        },
        surface: {
          DEFAULT: '#1e1e2e',  // 메인 배경
          card: '#2a2a3e',     // 카드 배경
          hover: '#353550',    // 호버 배경
        }
      },

      // 커스텀 폰트 패밀리
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },

      // 애니메이션 (마이크로 인터랙션용)
      // 사용법: animate-fadeIn
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
      },

      // @keyframes 정의
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  // 플러그인: 추가 유틸리티가 필요하면 여기에 등록
  plugins: [],
}
