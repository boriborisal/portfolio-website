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
                <p>안녕하세요. 사용자 경험을 중심으로 생각하는 프론트엔드 개발자 박소은입니다.</p>
                <p>저는 개발을 단순히 기능을 구현하는 것이 아닌, 사용자가 웹을 마주하는 순간의 경험을 설계하는 일이라고 생각합니다. 그래서 시각적 디자인과 인터랙션, 그리고 코드가 조화롭게 만나는 지점을 고민하며 개발합니다.</p>
                <p>React, Next.js, TypeScript를 기반으로 웹 애플리케이션을 개발하고 있으며, Framer Motion과 GSAP를 활용해 자연스럽고 의미 있는 인터랙션을 구현합니다. 기술적으로 안정적이면서도, 사용자에게는 기억에 남는 경험을 제공하는 웹을 만들고자 합니다.</p>
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
                <p>성능 최적화에도 신경 쓰고 있으며, Lighthouse 등의 도구를 활용해 접근성과 성능을 점검합니다. 기술적 완성도와 사용자 경험 사이의 균형을 유지하는 것을 목표로 합니다.</p>
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
                <p>새로운 기술을 배우는 것을 두려워하지 않으며, 모르는 것을 마주했을 때 이해하고 내 것으로 만드는 과정을 즐깁니다.</p>
                <p>스터디, 온라인 강의, 사이드 프로젝트를 통해 지속적으로 학습하고 있으며, 메타인지적 학습 방식을 통해 스스로의 강점과 보완점을 파악하고 개선해 나가고 있습니다.</p>
                <p>피드백을 통한 성장을 중요하게 생각하며, 동료와의 협업과 코드 리뷰를 통해 더 나은 개발자로 성장하고자 합니다.</p>
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
