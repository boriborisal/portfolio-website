'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const TiltedCard = dynamic(() => import('@/components/TiltedCard'), {
  ssr: false,
});

export default function AboutSection({ theme = 'dark' }) {
  const [activeCard, setActiveCard] = useState(0);
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-card-index'));
            setActiveCard(index);
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
      }
    );

    const refs = [card0Ref, card1Ref, card2Ref];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-green-400' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-green-500/20' : 'border-gray-300';
  const accentColor = theme === 'dark' ? 'text-green-500' : 'text-green-500';

  return (
    <section id="about" className={`${bgColor} py-20 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className={`text-4xl sm:text-5xl font-bold ${textColor} mb-12 text-center`}>
          <span className={accentColor}>〈</span> About <span className={accentColor}>/〉</span>
        </h2>

        {/* Grid Layout: Cards + TiltedCard */}
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left: Cards */}
          <div className="space-y-8">
            {/* About Me Card */}
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
                <p>안녕하세요. 게임 파일을 뜯어보던 호기심에서 시작해<br />사용자 경험을 중심으로 생각하는 프론트엔드 개발자 박소은입니다.</p>
                <p>어렸을 때 텍스트 게임 파일을 열어보니 .txt로 되어 있었고,<br />내용을 수정하면 게임이 바뀌는 것을 발견했습니다.<br />그때 처음 '코드로 무언가를 만들 수 있구나'를 깨달았고,<br />이후 웹사이트를 개발자 도구로 분석하며 배워왔습니다.</p>
                <p>그 호기심이 지금은 사용자에게 실질적인 가치를 제공하는<br />웹 애플리케이션을 만드는 열정으로 이어졌습니다.</p>
                <p>React, Next.js, TypeScript를 기반으로 웹 애플리케이션을 개발합니다.<br />Framer Motion과 GSAP를 활용해 자연스러운 인터랙션을 구현하며,<br />기술적 안정성과 직관적인 사용자 경험 사이의 균형을 추구합니다.</p>
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
                <p>React.js와 Next.js를 중심으로 웹 프론트엔드를 개발하며,<br />Framer Motion과 GSAP를 활용한 자연스러운 인터랙션 구현에 관심이 많습니다.<br />웹사이트가 단순히 작동하는 것을 넘어, 사용자에게 몰입감 있는 경험을 제공하는 것을 중요하게 생각합니다.</p>
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
                <p>모르는 것을 마주했을 때 회피하지 않고,<br />오히려 이해하고 내 것으로 만드는 과정을 즐깁니다.</p>
                <p>공식 문서를 먼저 읽고, 직접 코드를 작성하며 체화하는 방식으로 학습합니다.<br />스터디, 온라인 강의, 사이드 프로젝트를 통해 지속적으로 성장하고 있으며,<br />스스로의 강점과 보완점을 파악하며 개선해 나가고 있습니다.</p>
                <p>피드백을 통한 성장을 중요하게 생각하며,<br />동료와의 협업과 코드 리뷰를 통해 더 나은 개발자로 성장하고자 합니다.</p>
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
