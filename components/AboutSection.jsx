/**
 * AboutSection 컴포넌트
 *
 * 포트폴리오의 About 섹션을 렌더링하는 메인 컴포넌트입니다.
 * 스크롤에 따라 활성화되는 3개의 카드(About Me, Work Values, Growth & Learning)와
 * 오른쪽에 고정된 TiltedCard를 포함합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.theme - 테마 모드 ('dark' 또는 'light')
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// TiltedCard 컴포넌트를 동적으로 import (SSR 비활성화)
// SSR을 비활성화하여 클라이언트 전용 애니메이션과 인터랙션을 보장합니다
const TiltedCard = dynamic(() => import('@/components/TiltedCard'), {
  ssr: false,
});

export default function AboutSection({ theme = 'dark' }) {
  // 현재 활성화된 카드의 인덱스를 추적하는 state
  // 스크롤 위치에 따라 0, 1, 2 값을 가집니다
  const [activeCard, setActiveCard] = useState(0);

  // 각 카드에 대한 ref를 생성하여 Intersection Observer로 관찰
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  /**
   * Intersection Observer를 설정하여 스크롤 위치에 따라 활성 카드를 업데이트합니다.
   *
   * 동작 방식:
   * 1. 각 카드가 뷰포트의 중앙 영역(상하 40% 제외)에 들어오면 활성화
   * 2. 활성화된 카드는 컬러로 표시되고, 비활성 카드는 grayscale 처리
   * 3. 부드러운 전환 효과를 위해 CSS transition 사용
   */
  useEffect(() => {
    // Intersection Observer 생성
    // 콜백 함수: 관찰 대상 요소가 교차 영역에 들어오거나 나갈 때 실행
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 교차 영역에 들어온 경우
          if (entry.isIntersecting) {
            // data-card-index 속성에서 카드 인덱스를 가져와 활성 카드로 설정
            const index = parseInt(entry.target.getAttribute('data-card-index'));
            setActiveCard(index);
          }
        });
      },
      {
        root: null, // viewport를 root로 사용
        rootMargin: '-40% 0px -40% 0px', // 상하 40% 영역을 제외하여 중앙 20%만 활성 영역으로 설정
        threshold: 0 // 요소가 조금이라도 교차 영역에 들어오면 트리거
      }
    );

    // 모든 카드 ref를 배열로 모아서 관찰 시작
    const refs = [card0Ref, card1Ref, card2Ref];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // 컴포넌트 언마운트 시 모든 관찰 해제 (메모리 누수 방지)
    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  // 테마에 따른 스타일 변수 설정
  // 다크/라이트 모드에 맞는 배경, 텍스트, 테두리 색상을 동적으로 지정
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-green-400' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-green-500/20' : 'border-gray-300';
  const accentColor = theme === 'dark' ? 'text-green-500' : 'text-green-500';

  return (
    <section id="about" className={`${bgColor} py-20 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* 섹션 제목: HTML 태그 형식의 About 제목 */}
        <h2 className={`text-4xl sm:text-5xl font-bold ${textColor} mb-12 text-center`}>
          <span className={accentColor}>〈</span> About <span className={accentColor}>/〉</span>
        </h2>

        {/*
          그리드 레이아웃: 왼쪽에 3개의 카드, 오른쪽에 TiltedCard
          md 브레이크포인트 이상에서 2열 그리드로 표시
        */}
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          {/* 왼쪽: 3개의 About 카드 */}
          <div className="space-y-8">
            {/*
              About Me Card (카드 0)
              - ref와 data-card-index로 Intersection Observer가 추적
              - activeCard === 0일 때 컬러, 아닐 때 grayscale 필터 적용
              - 500ms 애니메이션으로 부드러운 전환
            */}
            <div
              ref={card0Ref}
              data-card-index="0"
              className={`${bgColor} border ${borderColor} rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-in-out ${
                activeCard === 0 ? 'grayscale-0' : 'grayscale'
              }`}
            >
              <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${theme === 'dark' ? 'border-green-500/30' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className={`${theme === 'dark' ? 'text-green-400/60' : 'text-gray-500'} text-xs ml-2`} style={{ fontFamily: 'Galmuri9, monospace' }}>
                  about_me.txt
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-4`} style={{ fontFamily: 'Galmuri9, monospace' }}>About Me</h3>
              <div className={`${textColor} text-sm sm:text-base space-y-3 leading-relaxed`}>
                <p>게임 파일을 뜯어보던 호기심에서 시작해 사용자 경험을 중심으로 생각하는 프론트엔드 개발자 박소은입니다.</p>
                <p>어릴 적 게임 파일을 열어보니 .txt로 되어 있었고, 내용을 수정하면 게임이 바뀌는 것을 발견했습니다. 그때 처음 '코드로 무언가를 만들 수 있구나'를 깨달았고, 이후 웹사이트를 개발자 도구로 분석하며 배워왔습니다.</p>
                <p>의료정보과에서 병원정보시스템과 의료 IT를 배우며 의료 현장을 이해하는 개발자가 되고자 합니다. React, Next.js를 학습 중이며, AI 도구(Claude Code, Cursor)를 적극 활용해 빠르게 성장하고 있습니다.</p>
              </div>
            </div>

            {/* Work Values Card */}
            <div
              ref={card1Ref}
              data-card-index="1"
              className={`${bgColor} border ${borderColor} rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-in-out ${
                activeCard === 1 ? 'grayscale-0' : 'grayscale'
              }`}
            >
              <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${theme === 'dark' ? 'border-green-500/30' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className={`${theme === 'dark' ? 'text-green-400/60' : 'text-gray-500'} text-xs ml-2`} style={{ fontFamily: 'Galmuri9, monospace' }}>
                  work_values.txt
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-4`} style={{ fontFamily: 'Galmuri9, monospace' }}>Work Values</h3>
              <div className={`${textColor} text-sm sm:text-base space-y-3 leading-relaxed`}>
                <p>개발할 때 가장 중요하게 생각하는 가치는 사용자 중심 사고입니다.</p>
                <p>"이 기능이 사용자에게 실질적인 도움이 될까?", "이 인터랙션이 사용자의 흐름을 방해하지 않을까?"와 같은 질문을 끊임없이 던지며, 직관적이고 편안한 사용자 경험을 설계하기 위해 노력합니다.</p>
                <p>임산부 헬스케어 앱 '마마케어'에서 SurveyMonkey를 활용한 설문으로 실제 사용자의 목소리를 듣고 UI를 개선한 경험이 있습니다. 추측이 아닌 검증된 니즈를 기반으로 설계하는 것을 중요하게 생각합니다.</p>
                <p>주니어 개발자로서 배워야 할 것이 많지만, 새로운 기술을 두려워하지 않고 빠르게 습득하는 것이 저의 강점입니다. 선배 개발자들과 협업하며 실무 경험을 쌓고, 코드 리뷰를 통해 더 나은 코드를 작성하는 방법을 배우고 싶습니다.</p>
              </div>
            </div>

            {/* Growth & Learning Card */}
            <div
              ref={card2Ref}
              data-card-index="2"
              className={`${bgColor} border ${borderColor} rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-in-out ${
                activeCard === 2 ? 'grayscale-0' : 'grayscale'
              }`}
            >
              <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${theme === 'dark' ? 'border-green-500/30' : 'border-gray-200'}`}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className={`${theme === 'dark' ? 'text-green-400/60' : 'text-gray-500'} text-xs ml-2`} style={{ fontFamily: 'Galmuri9, monospace' }}>
                  growth.txt
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-4`} style={{ fontFamily: 'Galmuri9, monospace' }}>Growth & Learning</h3>
              <div className={`${textColor} text-sm sm:text-base space-y-3 leading-relaxed`}>
                <p>모르는 것을 마주했을 때 회피하지 않고, 오히려 이해하고 내 것으로 만드는 과정을 즐깁니다.</p>
                <p>공식 문서를 읽고, AI 도구를 활용하며, 직접 코드를 작성하는 방식으로 학습합니다. Android Java를 7주 만에 배워 앱을 완성하고, Vanilla JavaScript로 1,800줄 프로젝트를 구현한 후 React의 필요성을 깨닫고 독학으로 Next.js를 배웠습니다.</p>
                <p>빠른 학습과 실행을 통해 지속적으로 성장하고 있으며, 피드백을 받아들여 개선하는 것을 중요하게 생각합니다. 동료와의 협업과 코드 리뷰를 통해 더 나은 개발자로 성장하고자 합니다.</p>
              </div>
            </div>
          </div>

          {/* Right: Tilted Card */}
          <div className="hidden md:flex w-80 lg:w-96 items-center justify-center sticky top-20 self-start">
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop"
              altText="Frontend Developer"
              captionText="박소은 - Frontend Developer"
              containerHeight="500px"
              containerWidth="350px"
              imageHeight="500px"
              imageWidth="350px"
              rotateAmplitude={8}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
