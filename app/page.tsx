/**
 * Portfolio Home Page
 *
 * 박소은 포트폴리오 웹사이트의 메인 페이지 컴포넌트입니다.
 * Next.js App Router를 사용하며, 다크/라이트 테마 전환을 지원합니다.
 *
 * 주요 섹션:
 * - Hero: 인사말, 타이핑 효과, 3D 카드 스와핑 애니메이션
 * - About: 자기소개, 가치관, 성장 마인드셋 (스크롤 활성화 카드)
 * - Projects: Cafe Flow, 포트폴리오, 마마케어 프로젝트 상세 정보
 * - Awards: 수상 경력 및 대회 참가 이력
 * - Skills: 기술 스택 (Languages, Frontend, Animation, Tools)
 * - Contact: 연락처 및 소셜 링크
 *
 * 기술 스택:
 * - Next.js 16.0.0 (App Router, Turbopack)
 * - React 19 (Client Components)
 * - Tailwind CSS (스타일링)
 * - GSAP (카드 애니메이션)
 * - Three.js (3D 효과)
 * - Framer Motion (페이지 전환)
 * - Lucide React (아이콘)
 * - React Icons (기술 로고)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Database, Cpu, Trophy, Calendar, Users, Lightbulb } from 'lucide-react';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript, SiHtml5, SiCss3, SiPython, SiFramer, SiGit, SiGithub, SiFigma } from 'react-icons/si';

/**
 * Dynamic Imports with SSR Disabled
 *
 * 모든 인터랙티브 컴포넌트는 클라이언트 사이드에서만 렌더링됩니다.
 * SSR을 비활성화하는 이유:
 * 1. Canvas/WebGL 기반 애니메이션 (Three.js, GSAP)
 * 2. window/document 객체에 직접 접근하는 컴포넌트
 * 3. 마우스/터치 이벤트 리스너가 필요한 인터랙션
 * 4. 초기 로딩 성능 최적화 (애니메이션 코드는 클라이언트에서만 로드)
 */

// 터미널 글리치 효과 배경 (다크 모드)
const FaultyTerminal = dynamic(() => import('@/components/FaultyTerminal'), {
  ssr: false,
});

// 픽셀 폭발 효과 (사용하지 않음 - 추후 제거 예정)
const PixelBlast = dynamic(() => import('@/components/PixelBlast'), {
  ssr: false,
});

// 글자 글리치 효과 배경 (라이트 모드)
const LetterGlitch = dynamic(() => import('@/components/LetterGlitch'), {
  ssr: false,
});

// 클릭 시 스파크 효과
const ClickSpark = dynamic(() => import('@/components/ClickSpark'), {
  ssr: false,
});

// 커서 따라다니는 효과
const CursorFollow = dynamic(() => import('@/components/CursorFollow'), {
  ssr: false,
});

// 암호 해독 텍스트 효과 (사용하지 않음 - 추후 제거 예정)
const DecryptedText = dynamic(() => import('@/components/DecryptedText'), {
  ssr: false,
});

// 3D 틸트 카드 (마우스 움직임에 반응)
const TiltedCard = dynamic(() => import('@/components/TiltedCard'), {
  ssr: false,
});

// 색상 그리드 배경 (사용하지 않음 - 추후 제거 예정)
const ChromaGrid = dynamic(() => import('@/components/ChromaGrid'), {
  ssr: false,
});

// About 섹션 (스크롤 활성화 카드)
const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  ssr: false,
});

// 좌측 네비게이션 메뉴 (햄버거 메뉴)
const StaggeredMenu = dynamic(() => import('@/components/StaggeredMenu'), {
  ssr: false,
});

// 카드 스와핑 애니메이션 컴포넌트
const CardSwap = dynamic(() => import('@/components/CardSwap'), {
  ssr: false,
});

// CardSwap의 개별 Card 컴포넌트
const Card = dynamic(() => import('@/components/CardSwap').then(mod => mod.Card), {
  ssr: false,
});

// 타이핑 효과 텍스트
const TextType = dynamic(() => import('@/components/TextType'), {
  ssr: false,
});

// 기술 로고 무한 루프 애니메이션
const LogoLoop = dynamic(() => import('@/components/LogoLoop'), {
  ssr: false,
});

// 이미지 모달 (프로젝트 스크린샷 확대)
const ImageModal = dynamic(() => import('@/components/ImageModal'), {
  ssr: false,
});

// 스크롤 스택 효과 (사용하지 않음 - 추후 제거 예정)
const ScrollStack = dynamic(() => import('@/components/ScrollStack'), {
  ssr: false,
});

// ScrollStack의 개별 아이템 컴포넌트
const ScrollStackItem = dynamic(() => import('@/components/ScrollStack').then(mod => mod.ScrollStackItem), {
  ssr: false,
});

/**
 * Home 페이지 컴포넌트
 *
 * 포트폴리오의 모든 섹션을 포함하는 메인 페이지입니다.
 */
export default function Home() {
  /**
   * modalImage: 현재 모달에서 표시 중인 이미지 정보
   * { src: string, alt: string } 형태의 객체
   * null이면 모달이 닫힌 상태
   */
  const [modalImage, setModalImage] = useState(null);

  /**
   * theme: 현재 테마 모드
   * 'dark' 또는 'light' 값을 가짐
   * 기본값은 'dark'
   */
  const [theme, setTheme] = useState('dark');

  /**
   * 테마 토글 함수
   * StaggeredMenu의 테마 전환 버튼에서 호출됨
   */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  /**
   * 테마 변경 시 document.body에 스타일 적용
   * - backgroundColor: 전체 배경 색상 변경
   * - className: 'dark' 또는 'light' 클래스를 body에 추가 (globals.css에서 사용)
   */
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? 'black' : 'white';
    document.body.className = theme;
  }, [theme]);

  /**
   * 기술 스택 로고 배열
   * LogoLoop 컴포넌트에서 무한 루프 애니메이션으로 표시됨
   * 각 항목은 { node: React 아이콘 컴포넌트, title: 기술 이름 } 형태
   */
  const techLogos = [
    { node: <SiJavascript className="w-12 h-12 text-green-400" />, title: "JavaScript" },
    { node: <SiTypescript className="w-12 h-12 text-green-400" />, title: "TypeScript" },
    { node: <SiReact className="w-12 h-12 text-green-400" />, title: "React" },
    { node: <SiNextdotjs className="w-12 h-12 text-green-400" />, title: "Next.js" },
    { node: <SiTailwindcss className="w-12 h-12 text-green-400" />, title: "Tailwind CSS" },
    { node: <SiHtml5 className="w-12 h-12 text-green-400" />, title: "HTML5" },
    { node: <SiCss3 className="w-12 h-12 text-green-400" />, title: "CSS3" },
    { node: <SiPython className="w-12 h-12 text-green-400" />, title: "Python" },
    { node: <SiFramer className="w-12 h-12 text-green-400" />, title: "Framer Motion" },
    { node: <SiGit className="w-12 h-12 text-green-400" />, title: "Git" },
    { node: <SiGithub className="w-12 h-12 text-green-400" />, title: "GitHub" },
    { node: <SiFigma className="w-12 h-12 text-green-400" />, title: "Figma" },
  ];

  /**
   * 메인 렌더링
   *
   * 구조:
   * 1. CursorFollow: 전역 커서 효과 (페이지 전체)
   * 2. ClickSpark: 클릭 시 스파크 효과 래퍼
   * 3. StaggeredMenu: 좌측 햄버거 네비게이션 메뉴
   * 4. Hero Section: 첫 화면 (인사말 + 카드 스와핑)
   * 5. About Section: 자기소개 (AboutSection 컴포넌트)
   * 6. Projects Section: 프로젝트 목록
   * 7. Awards Section: 수상 경력
   * 8. Skills Section: 기술 스택
   * 9. Contact Section: 연락처
   * 10. ImageModal: 이미지 모달 (전역)
   */
  return (
    <>
      {/* 커서 따라다니는 효과 (전역) */}
      <CursorFollow />

      {/* 클릭 시 스파크 효과 래퍼 */}
      <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={8}>
        <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>

        {/**
         * Navigation Menu (StaggeredMenu)
         *
         * 좌측에 고정된 햄버거 메뉴로, 다음 기능을 제공:
         * - 섹션 간 네비게이션 (Home, About, Skills, Projects, Awards, Contact)
         * - 소셜 링크 (GitHub, LinkedIn, Twitter)
         * - 테마 토글 버튼 (다크/라이트 모드 전환)
         *
         * 주요 Props:
         * - position: 'left' (왼쪽 고정)
         * - colors: 그라데이션 색상 배열 (녹색 계열)
         * - items: 메뉴 아이템 배열 (label, link, ariaLabel)
         * - theme/onThemeToggle: 테마 관리
         */}
        {/* @ts-ignore */}
        <StaggeredMenu
        position="left"
        colors={['#a7ef9e', '#00ff41', '#10b981', '#059669']}  // 녹색 계열 그라데이션
        items={[
          { label: 'Home', link: '/', ariaLabel: 'Go to homepage' },
          { label: 'About', link: '#about', ariaLabel: 'Go to about section' },
          { label: 'Skills', link: '#skills', ariaLabel: 'Go to skills section' },
          { label: 'Projects', link: '#projects', ariaLabel: 'Go to projects section' },
          { label: 'Awards', link: '#awards', ariaLabel: 'Go to awards section' },
          { label: 'Contact', link: '#contact', ariaLabel: 'Go to contact section' },
        ]}
        socialItems={[
          { label: 'GitHub', link: 'https://github.com/yourusername' },
          { label: 'LinkedIn', link: 'https://linkedin.com/in/yourusername' },
          { label: 'Twitter', link: 'https://twitter.com/yourusername' },
        ]}
        displaySocials={true}              // 소셜 링크 표시
        displayItemNumbering={true}        // 메뉴 아이템 번호 표시
        menuButtonColor={theme === 'dark' ? '#fff' : '#000'}
        openMenuButtonColor={theme === 'dark' ? '#fff' : '#000'}
        accentColor="#00ff41"              // 강조 색상 (녹색)
        changeMenuColorOnOpen={true}       // 메뉴 열릴 때 색상 변경
        isFixed={true}                     // 스크롤해도 고정
        logoUrl={undefined}                // 로고 없음
        theme={theme}                      // 현재 테마 전달
        onThemeToggle={toggleTheme}        // 테마 토글 함수 전달
      />

      {/**
       * Hero Section
       *
       * 포트폴리오의 첫 화면으로, 다음 요소로 구성:
       * 1. 배경: FaultyTerminal (다크 모드) 또는 LetterGlitch (라이트 모드)
       * 2. 왼쪽: 인사말 텍스트 + TextType 타이핑 효과
       * 3. 오른쪽: CardSwap (3개의 카드가 순환하는 3D 애니메이션)
       *
       * 레이아웃:
       * - lg (1024px) 이상: 2열 그리드 (텍스트 | 카드)
       * - lg 미만: 1열 스택 (텍스트 위, 카드 아래)
       */}
      <section className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {/**
         * 배경 애니메이션
         *
         * 다크 모드: FaultyTerminal
         * - 터미널 스타일의 매트릭스 효과
         * - 마우스 반응형 (mouseReact: true)
         * - 녹색 계열 틴트 (#a7ef9e)
         *
         * 라이트 모드: LetterGlitch
         * - 글자 글리치 효과
         * - 중앙 비네팅 효과
         * - 흰색 배경
         */}
        <div className="absolute inset-0 z-[1]">
          {theme === 'dark' ? (
            <FaultyTerminal
              scale={1.4}                      // 배경 크기 확대
              gridMul={[2, 1]}                 // 그리드 배율
              digitSize={1.2}                  // 숫자 크기
              timeScale={0.5}                  // 애니메이션 속도
              pause={false}                    // 일시정지 없음
              scanlineIntensity={0.5}          // 스캔라인 강도
              glitchAmount={1}                 // 글리치 양
              flickerAmount={1}                // 깜빡임 양
              noiseAmp={1}                     // 노이즈 진폭
              chromaticAberration={0}          // 색수차 없음
              dither={0}                       // 디더링 없음
              curvature={0.1}                  // CRT 곡률 효과
              tint="#a7ef9e"                   // 녹색 틴트
              backgroundColor="#000000"        // 검정 배경
              mouseReact={true}                // 마우스 반응 활성화
              mouseStrength={0.5}              // 마우스 반응 강도
              pageLoadAnimation={false}        // 페이지 로드 애니메이션 비활성화
              brightness={0.6}                 // 밝기
            />
          ) : (
            <LetterGlitch
              glitchSpeed={50}                 // 글리치 속도
              centerVignette={true}            // 중앙 비네팅 활성화
              outerVignette={false}            // 외곽 비네팅 비활성화
              smooth={true}                    // 부드러운 전환
              backgroundColor="#ffffff"        // 흰색 배경
              vignetteColor="255,255,255"      // 비네팅 색상 (RGB)
              vignettePosition="40% 50%"       // 비네팅 위치
            />
          )}
        </div>

        {/* Hero 콘텐츠 (배경 위에 표시, z-10) */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-0 items-center">

              {/**
               * 왼쪽: 인사말 텍스트
               *
               * 구조:
               * - "Hello," + TextType 타이핑 효과 ("world!", "HTML!", "React!", etc.)
               * - "I'm FrontEnd Developer"
               * - "Park Soeun" (다크 모드: 노란색, 라이트 모드: 녹색)
               */}
              <div className="space-y-6" style={{ marginLeft: '20px' }}>
                <h1 className={`text-[58px] sm:text-[70px] lg:text-[82px] font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} leading-tight`}>
                  Hello,
                  {/* 타이핑 효과: world, HTML, React, JS, FE가 순환 */}
                  <TextType
                    text={['world!', 'HTML!', 'React!', 'JS!', 'FE!']}
                    as="span"
                    typingSpeed={100}            // 타이핑 속도 (ms)
                    deletingSpeed={50}           // 삭제 속도 (ms)
                    pauseDuration={2000}         // 단어 표시 유지 시간 (ms)
                    loop={true}                  // 무한 반복
                    className="text-green-400"   // 녹색 텍스트
                    showCursor={true}            // 커서 표시
                    cursorCharacter="|"          // 커서 문자
                    cursorClassName="text-green-400"
                  />
                  <br />
                  I'm FrontEnd Developer<br />
                  {/* 이름 색상: 다크 모드 = 노란색, 라이트 모드 = 녹색 */}
                  <span className={theme === 'dark' ? 'text-yellow-400' : 'text-green-400'}>Park Soeun</span>
                </h1>
              </div>

              {/**
               * 오른쪽: CardSwap 애니메이션
               *
               * 3개의 카드가 순환하며 스와핑되는 3D 애니메이션:
               * 1. React & Next.js (Code2 아이콘, 녹색 테두리)
               * 2. UI/UX Design (Palette 아이콘, 파란색/녹색 테두리)
               * 3. Performance (Cpu 아이콘, 보라색/녹색 테두리)
               *
               * 각 카드는 터미널 스타일 헤더를 가지며,
               * 5초마다 자동으로 순환합니다 (delay: 5000ms)
               */}
              <div className="flex justify-center lg:justify-end" style={{ marginLeft: '-150px', marginRight: '50px' }}>
                <CardSwap
                  width={650}
                  height={500}
                  cardDistance={60}
                  verticalDistance={70}
                  delay={5000}
                  pauseOnHover={false}
                  skewAmount={6}
                  easing="elastic"
                  theme={theme}
                >
                  <Card customClass={`${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-green-500/30' : 'border-green-500/30'} shadow-2xl overflow-hidden`}>
                    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                      {/* Terminal Header */}
                      <div className={`${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700/50' : 'bg-gray-100 border-gray-200'} px-4 py-3 border-b flex items-center gap-2`}>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={`ml-3 text-xs ${theme === 'dark' ? 'text-gray-400' : ''}`}>React & Next.js</span>
                      </div>
                      {/* Content */}
                      <div className={`flex-1 flex flex-col items-center justify-center p-8 ${theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white'}`}>
                        <Code2 size={64} className="mb-4 text-green-400" />
                        <h3 className="text-3xl font-bold mb-3 text-green-400">React & Next.js</h3>
                        <p className={`text-center text-sm ${theme === 'dark' ? 'opacity-70' : ''}`}>Modern web applications with cutting-edge frameworks</p>
                      </div>
                    </div>
                  </Card>
                  <Card customClass={`${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-blue-500/30' : 'border-green-500/30'} shadow-2xl overflow-hidden`}>
                    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                      {/* Terminal Header */}
                      <div className={`${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700/50' : 'bg-gray-100 border-gray-200'} px-4 py-3 border-b flex items-center gap-2`}>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={`ml-3 text-xs ${theme === 'dark' ? 'text-gray-400' : ''}`}>UI/UX Design</span>
                      </div>
                      {/* Content */}
                      <div className={`flex-1 flex flex-col items-center justify-center p-8 ${theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white'}`}>
                        <Palette size={64} className={`mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-green-400'}`} />
                        <h3 className="text-3xl font-bold mb-3 text-green-400">UI/UX Design</h3>
                        <p className={`text-center text-sm ${theme === 'dark' ? 'opacity-70' : ''}`}>Beautiful, responsive interfaces that users love</p>
                      </div>
                    </div>
                  </Card>
                  <Card customClass={`${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-purple-500/30' : 'border-green-500/30'} shadow-2xl overflow-hidden`}>
                    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                      {/* Terminal Header */}
                      <div className={`${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700/50' : 'bg-gray-100 border-gray-200'} px-4 py-3 border-b flex items-center gap-2`}>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={`ml-3 text-xs ${theme === 'dark' ? 'text-gray-400' : ''}`}>Performance</span>
                      </div>
                      {/* Content */}
                      <div className={`flex-1 flex flex-col items-center justify-center p-8 ${theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white'}`}>
                        <Cpu size={64} className={`mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-green-400'}`} />
                        <h3 className="text-3xl font-bold mb-3 text-green-400">Performance</h3>
                        <p className={`text-center text-sm ${theme === 'dark' ? 'opacity-70' : ''}`}>Optimized code for lightning-fast experiences</p>
                      </div>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/**
         * About Section
         *
         * AboutSection 컴포넌트를 사용하여 자기소개를 표시합니다.
         * 스크롤에 따라 3개의 카드가 활성화/비활성화되며:
         * 1. About Me: 개발자가 된 계기와 경험
         * 2. Work Values: 사용자 중심 사고와 개발 철학
         * 3. Growth & Learning: 학습 방식과 성장 마인드셋
         *
         * 오른쪽에는 TiltedCard (3D 틸트 효과 프로필 카드)가 고정됩니다.
         */}
        <AboutSection theme={theme} />

        {/**
         * Projects Section
         *
         * 3개의 주요 프로젝트를 카드 형식으로 표시:
         * 1. Cafe Flow: 올인원 집중 관리 웹 앱 (Vanilla JS, Firebase)
         * 2. 포트폴리오: 현재 이 웹사이트 (Next.js, Three.js, GSAP)
         * 3. 마마케어: 임산부 헬스케어 Android 앱 (Java, 한이음 프로젝트)
         *
         * 각 프로젝트는 다음 정보를 포함:
         * - 타입, 규모, 참여도, 기술 스택
         * - 개발 기간
         * - 작업 기여도 (상세 항목)
         * - 스크린샷 (클릭 시 모달 확대)
         * - 라이브 데모 링크 (해당되는 경우)
         */}
        <section id="projects" className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} py-20 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-12 text-center`}>
              <span className="text-green-500">〈</span> Projects <span className="text-green-500">/〉</span>
            </h2>

            <div className="space-y-6">
              {/* Project 1: Cafe Flow */}
              <div className={`cursor-target ${theme === 'dark' ? 'bg-black/40 border-green-500/20 hover:border-green-500/40' : 'bg-white border-gray-300 hover:border-gray-400'} backdrop-blur-sm border rounded-xl p-6 sm:p-8 transition-all`}>
                <h3 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-4`}>Cafe Flow</h3>
                <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-base mb-4`}>올인원 집중 관리 웹 애플리케이션</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>타입</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>웹</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>프론트엔드 규모</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>개인 프로젝트</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>참여도</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>프론트 100%</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>디자인 100%</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>라이브러리</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Chart.js</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Spotify Embed API</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Firebase</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>프레임워크</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Vanilla JavaScript</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>(ES6+)</p>
                  </div>
                </div>

                {/* 개발 기간 */}
                <div className="mb-4">
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>개발 기간</h4>
                  <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm`}>2025.11 (1주)</p>
                </div>

                {/* 작업 기여도 */}
                <div className="mb-3">
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-2 text-lg`}>작업 기여도</h4>
                  <ul className={`space-y-1 ${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-lg`}>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>Vanilla JavaScript로 뽀모도로 타이머, 투두리스트, 캘린더, 통계 기능 통합 구현 (1,800줄)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>Firebase Authentication & Firestore 연동으로 여러 기기 간 실시간 데이터 동기화</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>HTML5 Audio API 활용한 ASMR 카페 사운드 시스템 구현 (4종 사운드 개별 볼륨 컨트롤)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>SVG 원형 프로그레스 바 및 Chart.js 기반 주간/월간 생산성 통계 시각화</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>LocalStorage + Firebase 하이브리드 저장으로 오프라인/온라인 환경 모두 지원</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>글래스모피즘 디자인 시스템 구축 및 완전 반응형 레이아웃 (모바일/태블릿/데스크톱)</span>
                    </li>
                  </ul>
                </div>

                {/* 스크린샷 */}
                <div className="mb-4">
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-2 text-lg`}>스크린샷</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/cafeflow-1.png', alt: 'Cafe Flow Screenshot 1' })}
                    >
                      <Image src="/images/cafeflow-1.png" alt="Cafe Flow Screenshot 1" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/cafeflow-2.png', alt: 'Cafe Flow Screenshot 2' })}
                    >
                      <Image src="/images/cafeflow-2.png" alt="Cafe Flow Screenshot 2" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/cafeflow-3.png', alt: 'Cafe Flow Screenshot 3' })}
                    >
                      <Image src="/images/cafeflow-3.png" alt="Cafe Flow Screenshot 3" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                  </div>
                </div>

                {/* 링크 */}
                <div>
                  <a
                    href="https://iliketostudycafe.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cursor-target inline-flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 hover:bg-green-200 text-green-600 border-green-300'} border rounded-lg transition-all transform hover:scale-105`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>라이브 데모 보기</span>
                  </a>
                </div>
              </div>

              {/* Project 2: Portfolio Website */}
              <div className={`cursor-target ${theme === 'dark' ? 'bg-black/40 border-green-500/20 hover:border-green-500/40' : 'bg-white border-gray-300 hover:border-gray-400'} backdrop-blur-sm border rounded-xl p-6 sm:p-8 transition-all`}>
                <h3 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-4`}>포트폴리오</h3>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>타입</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>웹</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>프론트엔드 규모</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>개인 프로젝트</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>참여도</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>프론트 100%</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>디자인 100%</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>라이브러리</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Three.js</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>GSAP</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Framer Motion</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>프레임워크</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Next.js</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>React</p>
                  </div>
                </div>

                {/* 작업 기여도 */}
                <div className="mb-3">
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-2 text-lg`}>작업 기여도</h4>
                  <ul className={`space-y-1 ${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-lg`}>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>Next.js App Router 기반 포트폴리오 웹사이트 개발</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>Three.js를 활용한 3D 인터랙션 구현 (마우스 움직임 반응형 오브젝트)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>GSAP와 Framer Motion으로 페이지 전환 및 스크롤 애니메이션 구현</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>완전 반응형 디자인: 모바일/태블릿/데스크톱 최적화</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>사용자 피드백 수용하여 모바일 애니메이션 간소화 (UX 개선)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>Lighthouse 성능 90+ 달성 (Performance, Accessibility, SEO)</span>
                    </li>
                  </ul>
                </div>

                {/* 스크린샷 */}
                <div>
                  <h4 className="text-green-400 font-semibold mb-2 text-lg">스크린샷</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/portfolio-1.png', alt: 'Portfolio Screenshot 1' })}
                    >
                      <Image src="/images/portfolio-1.png" alt="Portfolio Screenshot 1" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/portfolio-2.png', alt: 'Portfolio Screenshot 2' })}
                    >
                      <Image src="/images/portfolio-2.png" alt="Portfolio Screenshot 2" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <div
                      className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                      style={{ aspectRatio: '16/10' }}
                      onClick={() => setModalImage({ src: '/images/portfolio-3.png', alt: 'Portfolio Screenshot 3' })}
                    >
                      <Image src="/images/portfolio-3.png" alt="Portfolio Screenshot 3" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project 3: 마마케어 */}
              <div className={`cursor-target ${theme === 'dark' ? 'bg-black/40 border-green-500/20 hover:border-green-500/40' : 'bg-white border-gray-300 hover:border-gray-400'} backdrop-blur-sm border rounded-xl p-6 sm:p-8 transition-all`}>
                <h3 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-4`}>마마케어</h3>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>타입</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>모바일</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>안드로이드</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>프론트엔드 규모</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>팀 프로젝트</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>한이음</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>참여도</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>프론트 60%</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>디자인 100%</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>개발 환경</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Android Studio</p>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>Java</p>
                  </div>
                  <div>
                    <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 text-base`}>기간</h4>
                    <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-sm leading-tight`}>2025.03 ~ 2025.11</p>
                  </div>
                </div>

                {/* 작업 기여도 */}
                <div className="mb-3">
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-2 text-lg`}>작업 기여도</h4>
                  <ul className={`space-y-1 ${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} text-lg`}>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>팀장: 4명 팀원 9개월 프로젝트 일정 관리 및 협업 조율</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>디자인: Figma로 전체 UI 설계 (50+ 화면), 임산부 10명 인터뷰 통해 니즈 반영</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>개발: Android 프론트엔드 주요 화면 구현 및 API 연동 (60%)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>성과: Claude Code 및 Cursor 등의 AI 툴로 개발기간 30% 단축 (10주 → 7주)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>•</span>
                      <span>수상: 학생 창업마라톤 2025 장려상</span>
                    </li>
                  </ul>
                </div>

                {/* 스크린샷 */}
                <div>
                  <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-2 text-lg`}>스크린샷</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-700/30 border border-green-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-green-500/40 transition-all relative"
                        style={{ aspectRatio: '9/16' }}
                        onClick={() => setModalImage({ src: `/images/mamacare-${i}.jpg`, alt: `마마케어 Screenshot ${i}` })}
                      >
                        <Image src={`/images/mamacare-${i}.jpg`} alt={`마마케어 Screenshot ${i}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/**
         * Awards Section
         *
         * 수상 경력 및 대회 참가 이력을 표시합니다.
         *
         * 포함된 수상:
         * 1. 서울 AI 이노베이션 챌린지 2024 (장려상)
         *    - 프로젝트: 범-드론 (AI 비전 + 드론)
         *    - 배운 점: AI 비전 기술과 드론을 결합한 사회 문제 해결
         *
         * 2. 학생 창업마라톤 2025 (장려상)
         *    - 서비스: 마마케어 (임산부 헬스케어 앱)
         *    - 역할: 팀장, UI/UX 디자인, 프론트엔드 개발
         *    - 배운 점: 9개월 프로젝트 리더십, 사용자 인터뷰 기반 UX 개선
         *
         * 각 수상은 아이콘, 제목, 날짜, 프로젝트/서비스 설명, 배운 점을 포함합니다.
         */}
        <section id="awards" className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} py-20 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-5xl mx-auto">
            <h2 className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-12 text-center`}>
              <span className="text-green-500">〈</span> Awards <span className="text-green-500">/〉</span>
            </h2>

            <div className="space-y-6">
              {/* Award 1: 서울 AI 이노베이션 챌린지 2024 */}
              <div className={`cursor-target ${theme === 'dark' ? 'bg-black/40 border-green-500/20 hover:border-green-500/40' : 'bg-white border-gray-300 hover:border-gray-400'} backdrop-blur-sm border rounded-xl p-6 sm:p-8 transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                    <Trophy className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>서울 AI 이노베이션 챌린지 2024 (아이디어톤)</h3>
                      <span className={`${theme === 'dark' ? 'text-green-400/60' : 'text-green-500'} text-sm mt-1 sm:mt-0`}>장려상</span>
                    </div>

                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-green-300/70' : 'text-gray-900'} text-sm mb-4`}>
                      <Calendar className="w-4 h-4" />
                      <span>2024.06.28</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 flex items-center gap-2`}>
                          <Lightbulb className="w-4 h-4" />
                          프로젝트
                        </h4>
                        <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} pl-6`}>범-드론 - AI 비전 기술과 드론을 결합하여 농작물 피해를 일으키는 멧돼지를 감지하는 시스템</p>
                      </div>

                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1`}>배운 점</h4>
                        <p className={`${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm pl-6`}>AI 비전 기술과 드론을 결합한 사회 문제 해결 아이디어 기획 경험. 사회 문제를 기술적 관점에서 분석하고, 제한된 시간 안에 실현 가능한 솔루션을 도출하여 효과적으로 발표하는 능력 향상.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Award 2 */}
              <div className={`cursor-target ${theme === 'dark' ? 'bg-black/40 border-green-500/20 hover:border-green-500/40' : 'bg-white border-gray-300 hover:border-gray-400'} backdrop-blur-sm border rounded-xl p-6 sm:p-8 transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                    <Trophy className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>학생 창업마라톤 2025</h3>
                      <span className={`${theme === 'dark' ? 'text-green-400/60' : 'text-green-500'} text-sm mt-1 sm:mt-0`}>장려상</span>
                    </div>

                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-green-300/70' : 'text-gray-900'} text-sm mb-4`}>
                      <Calendar className="w-4 h-4" />
                      <span>2025.07.04</span>
                      <span className={theme === 'dark' ? 'text-green-400/40' : 'text-gray-500'}>•</span>
                      <span>과학기술대학교/삼육보건대학교 주최</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 flex items-center gap-2`}>
                          <Lightbulb className="w-4 h-4" />
                          서비스
                        </h4>
                        <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} pl-6`}>마마케어 - 임산부를 위한 맞춤형 헬스케어 어플리케이션</p>
                      </div>

                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1 flex items-center gap-2`}>
                          <Users className="w-4 h-4" />
                          역할
                        </h4>
                        <p className={`${theme === 'dark' ? 'text-green-200/80' : 'text-gray-900'} pl-6`}>팀장, UI/UX 디자인, 프론트엔드 개발</p>
                      </div>

                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1`}>사용 기술</h4>
                        <div className="flex flex-wrap gap-2 pl-6">
                          <span className={`px-3 py-1 ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-100 border-green-300 text-green-500'} border rounded text-sm`}>Android Studio / Java</span>
                          <span className={`px-3 py-1 ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-100 border-green-300 text-green-500'} border rounded text-sm`}>Figma</span>
                        </div>
                      </div>

                      <div>
                        <h4 className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold mb-1`}>배운 점</h4>
                        <p className={`${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm pl-6`}>4명 팀 리더로서 9개월 프로젝트 완수. 임산부 10명 직접 인터뷰하여 '글자가 작다', '메뉴가 복잡하다'는 구체적 불편 사항 도출 후, 폰트 120% 확대 및 3탭 구조로 재설계. Notion 기반 투명한 작업 관리와 효율적 협업으로 개발 기간 30% 단축 (10주 → 7주).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/**
         * Skills Section (Tech Stack)
         *
         * 기술 스택을 4개 카테고리로 분류하여 표시:
         * 1. Languages: JavaScript/TypeScript, Java/Python, HTML/CSS
         * 2. Frontend: React/Next.js, Tailwind CSS, Responsive Design
         * 3. Animation: Framer Motion, CSS Animations
         * 4. Tools & Workflow: Git/GitHub, Cursor/Claude Code, Figma
         *
         * 상단/하단에 LogoLoop 컴포넌트로 기술 로고 무한 루프 애니메이션 표시:
         * - 상단: 왼쪽 방향 (speed: 120)
         * - 하단: 오른쪽 방향 (speed: 120)
         * - 호버 시 일시정지 및 확대 효과
         *
         * 중앙에는 4개의 카드로 기술 스택을 카테고리별로 표시합니다.
         */}
        <section id="skills" className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} py-20 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-5xl mx-auto">
            <div className={`${theme === 'dark' ? 'bg-black/40' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-green-500/20' : 'border-gray-300'} rounded-2xl p-8 sm:p-12 ${theme === 'dark' ? 'shadow-2xl' : ''}`}>
              <h2 className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-8 text-center`}>
                <span className="text-green-500">〈</span> Tech Stack <span className="text-green-500">/〉</span>
              </h2>

              {/* 상단 로고 루프: 왼쪽 방향 */}
              <div className="mb-8 h-20 overflow-hidden">
                <LogoLoop
                  logos={techLogos}
                  speed={120}
                  direction="left"
                  logoHeight={48}
                  gap={40}
                  pauseOnHover
                  scaleOnHover
                  fadeOut={false}
                  ariaLabel="Technology stack"
                />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`cursor-target ${theme === 'dark' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} border rounded-xl p-6 transition-all`}>
                  <div className="flex justify-center mb-4">
                    <Code2 className={`w-12 h-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-3 text-center`}>Languages</h3>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm`}>
                    <li>JavaScript / TypeScript</li>
                    <li>Java / Python</li>
                    <li>HTML / CSS</li>
                  </ul>
                </div>
                <div className={`cursor-target ${theme === 'dark' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} border rounded-xl p-6 transition-all`}>
                  <div className="flex justify-center mb-4">
                    <Palette className={`w-12 h-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-3 text-center`}>Frontend</h3>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm`}>
                    <li>React / Next.js</li>
                    <li>Tailwind CSS</li>
                    <li>Responsive Design</li>
                  </ul>
                </div>
                <div className={`cursor-target ${theme === 'dark' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} border rounded-xl p-6 transition-all`}>
                  <div className="flex justify-center mb-4">
                    <Cpu className={`w-12 h-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-3 text-center`}>Animation</h3>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm`}>
                    <li>Framer Motion</li>
                    <li>CSS Animations</li>
                  </ul>
                </div>
                <div className={`cursor-target ${theme === 'dark' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} border rounded-xl p-6 transition-all`}>
                  <div className="flex justify-center mb-4">
                    <Database className={`w-12 h-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-3 text-center`}>Tools & Workflow</h3>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-green-200/70' : 'text-gray-900'} text-sm`}>
                    <li>Git / GitHub</li>
                    <li>Cursor / Claude Code</li>
                    <li>Figma</li>
                  </ul>
                </div>
              </div>

              {/* Bottom Logo Loop */}
              <div className="mt-8 h-20 overflow-hidden">
                <LogoLoop
                  logos={techLogos}
                  speed={120}
                  direction="right"
                  logoHeight={48}
                  gap={40}
                  pauseOnHover
                  scaleOnHover
                  fadeOut={false}
                  ariaLabel="Technology stack"
                />
              </div>
            </div>
          </div>
        </section>

        {/**
         * Contact Section
         *
         * 연락처 및 마무리 메시지를 표시하는 마지막 섹션입니다.
         *
         * 구성:
         * 1. 소개 메시지 (4개 단락):
         *    - 개발자가 된 계기 (게임 파일 분석)
         *    - 주니어 개발자로서의 강점 (빠른 학습)
         *    - 협업 및 성장에 대한 열망
         *    - 가치 제공에 대한 다짐
         *
         * 2. 연락처 버튼 (3개):
         *    - Email: soeunpark0806@gmail.com
         *    - GitHub: https://github.com/boriborisal
         *    - LinkedIn: 아직 수정 중 (alert 표시)
         *
         * 3. 푸터: © 2024 Park Soeun
         */}
        <section id="contact" className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} py-20 px-4 sm:px-6 lg:px-8 mb-20`}>
          <div className="max-w-4xl mx-auto">
            <div className={`${theme === 'dark' ? 'bg-black/40' : 'bg-white'} backdrop-blur-sm border ${theme === 'dark' ? 'border-green-500/20' : 'border-gray-300'} rounded-2xl p-8 sm:p-12 ${theme === 'dark' ? 'shadow-2xl' : ''} text-center`}>
              <h2 className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mb-8`}>
                <span className="text-green-500">〈</span> Contact <span className="text-green-500">/〉</span>
              </h2>

              <div className={`max-w-3xl mx-auto space-y-6 ${theme === 'dark' ? 'text-green-200/90' : 'text-gray-900'} text-base sm:text-lg leading-relaxed mb-12`}>
                <p>게임 파일을 뜯어보던 호기심으로 시작해,<br />지금은 사용자에게 가치 있는 웹을 만드는 개발자가 되었습니다.</p>
                <p>주니어 개발자로서 배워야 할 것이 많지만,<br />새로운 기술을 두려워하지 않고 빠르게 습득하는 것이 저의 강점입니다.</p>
                <p>선배 개발자들과 협업하며 실무 경험을 쌓고,<br />코드 리뷰를 통해 더 나은 코드를 작성하는 방법을 배우고 싶습니다.</p>
                <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'} font-semibold text-lg sm:text-xl`}>사용자에게 실질적인 가치를 제공하는 프로덕트를 함께 만들어갈 수 있다면<br />최선을 다하겠습니다. 감사합니다.</p>
              </div>

              <div className="flex flex-wrap gap-6 justify-center mb-10">
                <a
                  href="mailto:soeunpark0806@gmail.com"
                  className="cursor-target flex items-center gap-3 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30 rounded-lg border transition-all transform hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
                <a
                  href="https://github.com/boriborisal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target flex items-center gap-3 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30 rounded-lg border transition-all transform hover:scale-105"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <button
                  onClick={() => alert('아직 수정중입니다')}
                  className="cursor-target flex items-center gap-3 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30 rounded-lg border transition-all transform hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </button>
              </div>

              <p className="text-green-500/60 text-sm">
                © 2024 Park Soeun. Made with <span className="text-green-400">❤</span>
              </p>
            </div>
          </div>
        </section>

        {/**
         * Image Modal
         *
         * 프로젝트 스크린샷을 확대하여 보여주는 모달 컴포넌트입니다.
         *
         * 동작:
         * - Projects 섹션의 스크린샷 이미지를 클릭하면 setModalImage로 이미지 정보 설정
         * - modalImage가 null이 아니면 모달이 열림 (isOpen: !!modalImage)
         * - 모달 외부 클릭 또는 닫기 버튼 클릭 시 setModalImage(null)로 모달 닫음
         *
         * Props:
         * - isOpen: 모달 표시 여부
         * - onClose: 모달 닫기 콜백
         * - imageSrc: 확대할 이미지 경로
         * - imageAlt: 이미지 alt 텍스트
         */}
        <ImageModal
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          imageSrc={modalImage?.src}
          imageAlt={modalImage?.alt}
        />
      </div>
    </ClickSpark>
    </>
  );
}
