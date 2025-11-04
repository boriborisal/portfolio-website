/**
 * CardSwap 컴포넌트
 *
 * GSAP를 활용하여 카드 스택이 자동으로 순환하는 애니메이션을 구현한 컴포넌트입니다.
 * 맨 앞의 카드가 아래로 떨어지면서 뒤로 이동하고, 나머지 카드들이 앞으로 이동하는
 * 3D 효과의 카드 스와핑 애니메이션을 제공합니다.
 *
 * 주요 기능:
 * - 자동 카드 순환 애니메이션 (설정 가능한 지연 시간)
 * - Elastic 또는 Power easing 선택 가능
 * - 호버 시 애니메이션 일시정지 (선택 사항)
 * - 다크/라이트 테마 지원
 * - 3D perspective 효과로 깊이감 표현
 */

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

/**
 * Card 컴포넌트
 *
 * CardSwap 내부에서 사용되는 개별 카드 요소입니다.
 * forwardRef를 사용하여 부모 컴포넌트에서 ref를 통해 DOM 노드에 직접 접근할 수 있습니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.customClass - 추가 CSS 클래스
 * @param {React.Ref} ref - 카드 DOM 요소에 대한 ref
 */
export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

/**
 * 카드의 위치 슬롯을 계산하는 헬퍼 함수
 *
 * 각 카드가 스택에서 차지할 3D 공간의 위치를 계산합니다.
 * 인덱스가 클수록(뒤쪽 카드일수록) x, z는 증가하고 y는 감소합니다.
 *
 * @param {number} i - 카드의 인덱스 (0이 맨 앞)
 * @param {number} distX - 카드 간 수평 거리
 * @param {number} distY - 카드 간 수직 거리
 * @param {number} total - 전체 카드 개수
 * @returns {Object} 카드의 x, y, z 좌표와 zIndex 값
 */
const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,           // 오른쪽으로 이동 (뒤로 갈수록 증가)
  y: -i * distY,          // 위로 이동 (뒤로 갈수록 감소)
  z: -i * distX * 1.5,    // 뒤로 이동 (깊이감 표현, 뒤로 갈수록 감소)
  zIndex: total - i       // zIndex는 앞쪽 카드일수록 높음
});

/**
 * 카드를 즉시 특정 슬롯 위치로 배치하는 헬퍼 함수
 *
 * GSAP의 gsap.set을 사용하여 애니메이션 없이 카드를 바로 이동시킵니다.
 * 초기 카드 배치 및 스택 재정렬에 사용됩니다.
 *
 * @param {HTMLElement} el - 배치할 카드 DOM 요소
 * @param {Object} slot - makeSlot에서 반환된 위치 정보
 * @param {number} skew - Y축 기울기 값 (3D 효과)
 */
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,              // 중앙 정렬을 위한 X축 오프셋
    yPercent: -50,              // 중앙 정렬을 위한 Y축 오프셋
    skewY: skew,                // Y축 기울기 (3D 원근감)
    transformOrigin: 'center center',  // 변형 기준점을 중앙으로 설정
    zIndex: slot.zIndex,
    force3D: true               // GPU 가속 활성화 (성능 최적화)
  });

/**
 * CardSwap 메인 컴포넌트
 *
 * 여러 카드를 3D 스택 형태로 배치하고 자동으로 순환시키는 애니메이션 컴포넌트입니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.width - 카드의 너비 (기본값: 500px)
 * @param {number} props.height - 카드의 높이 (기본값: 400px)
 * @param {number} props.cardDistance - 카드 간 수평 거리 (기본값: 60px)
 * @param {number} props.verticalDistance - 카드 간 수직 거리 (기본값: 70px)
 * @param {number} props.delay - 카드 순환 지연 시간 (밀리초, 기본값: 5000ms)
 * @param {boolean} props.pauseOnHover - 호버 시 애니메이션 일시정지 여부 (기본값: false)
 * @param {Function} props.onCardClick - 카드 클릭 시 호출될 콜백 함수
 * @param {number} props.skewAmount - Y축 기울기 값 (3D 효과, 기본값: 6)
 * @param {string} props.easing - 이징 타입 ('elastic' 또는 'power', 기본값: 'elastic')
 * @param {string} props.theme - 테마 모드 ('dark' 또는 'light', 기본값: 'dark')
 * @param {React.ReactNode} props.children - 카드로 렌더링할 자식 요소들
 */
const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  theme = 'dark',
  children
}) => {
  /**
   * 애니메이션 설정 객체
   *
   * easing 타입에 따라 애니메이션의 속도와 타이밍을 다르게 설정합니다.
   *
   * elastic 모드:
   * - 탄성 효과가 있는 부드러운 애니메이션
   * - 더 긴 지속 시간 (2초)
   * - 높은 overlap (0.9)으로 동시성 있는 움직임
   * - 짧은 returnDelay (0.05)로 빠른 복귀
   *
   * power 모드:
   * - 직선적이고 빠른 애니메이션
   * - 짧은 지속 시간 (0.8초)
   * - 낮은 overlap (0.45)으로 순차적인 움직임
   * - 긴 returnDelay (0.2)로 여유 있는 복귀
   */
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',     // GSAP elastic easing
          durDrop: 2,                        // 카드가 떨어지는 애니메이션 지속 시간 (초)
          durMove: 2,                        // 나머지 카드가 앞으로 이동하는 지속 시간 (초)
          durReturn: 2,                      // 카드가 뒤로 돌아가는 지속 시간 (초)
          promoteOverlap: 0.9,               // drop과 promote 애니메이션의 겹침 정도 (0~1)
          returnDelay: 0.05                  // promote 후 return까지의 지연 시간
        }
      : {
          ease: 'power1.inOut',              // GSAP power easing
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  /**
   * 자식 요소들을 배열로 변환
   * useMemo로 메모이제이션하여 children이 변경될 때만 재계산
   */
  const childArr = useMemo(() => Children.toArray(children), [children]);

  /**
   * 각 카드에 대한 ref 배열 생성
   * 카드 개수가 변경될 때만 refs를 재생성
   */
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  /**
   * 카드의 현재 순서를 추적하는 ref
   * [0, 1, 2, ...] 형태로 시작하여 swap 시마다 업데이트됨
   * 예: [1, 2, 0] = 인덱스 1이 맨 앞, 0이 맨 뒤
   */
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  /**
   * GSAP 타임라인 ref (pause/resume 제어에 사용)
   */
  const tlRef = useRef(null);

  /**
   * setInterval ID를 저장하는 ref (cleanup에 사용)
   */
  const intervalRef = useRef();

  /**
   * 컨테이너 DOM 요소 ref (hover 이벤트 리스너에 사용)
   */
  const container = useRef(null);

  /**
   * 카드 초기화 및 swap 애니메이션 설정
   *
   * 동작 흐름:
   * 1. 컴포넌트 마운트 시 모든 카드를 초기 위치에 배치
   * 2. swap 함수로 첫 번째 카드 교체 애니메이션 실행
   * 3. setInterval로 주기적인 swap 실행
   * 4. pauseOnHover 옵션이 true면 hover 이벤트 리스너 추가
   */
  useEffect(() => {
    const total = refs.length;

    // 모든 카드를 초기 위치에 배치
    refs.forEach((r, i) => {
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);

      // 맨 앞 카드(i === 0)를 data-is-front 속성으로 표시
      if (r.current) {
        r.current.setAttribute('data-is-front', i === 0 ? 'true' : 'false');

        // 라이트 테마에서 텍스트 색상 설정
        // h3는 제외하여 녹색 유지 (제목)
        // 맨 앞 카드는 진한 텍스트, 뒤쪽 카드는 회색 텍스트
        if (theme === 'light') {
          const textElements = r.current.querySelectorAll('p, span');
          textElements.forEach(el => {
            gsap.set(el, { color: i === 0 ? '#111827' : '#d1d5db' });
          });
        }
      }
    });

    /**
     * 카드 스와핑 애니메이션 함수
     *
     * 애니메이션 단계:
     * 1. DROP: 맨 앞 카드가 아래로 떨어짐 (y += 500)
     * 2. PROMOTE: 나머지 카드들이 앞으로 한 칸씩 이동
     * 3. RETURN: 떨어진 카드가 맨 뒤로 복귀
     * 4. UPDATE: order 배열 업데이트 (순환)
     */
    const swap = () => {
      // 카드가 2개 미만이면 swap 불가능
      if (order.current.length < 2) return;

      // order 배열에서 맨 앞 카드와 나머지 카드들 분리
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      // GSAP 타임라인 생성 (순차적인 애니메이션 관리)
      const tl = gsap.timeline();
      tlRef.current = tl;

      /**
       * PHASE 1: DROP - 맨 앞 카드가 아래로 떨어지는 애니메이션
       * 현재 y 위치에서 500px 아래로 이동
       */
      tl.to(elFront, {
        y: '+=500',                  // 상대 위치로 500px 아래로
        duration: config.durDrop,    // 설정된 드롭 지속 시간
        ease: config.ease            // 설정된 easing 함수
      });

      /**
       * PHASE 2: PROMOTE - 나머지 카드들이 앞으로 이동하는 애니메이션
       * 'promote' 라벨을 추가하고, DROP 애니메이션과 겹치도록 시간 조정
       * promoteOverlap: 0.9면 DROP의 90% 지점에서 PROMOTE 시작
       */
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

      // 나머지 카드들을 순회하며 각각 한 칸씩 앞으로 이동
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;

        // 새로운 슬롯 위치 계산 (인덱스가 i이므로 한 칸 앞으로)
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        // zIndex를 먼저 설정 (앞으로 올수록 높은 zIndex)
        tl.set(el, { zIndex: slot.zIndex }, 'promote');

        // 카드를 새 위치로 애니메이션 이동
        // 각 카드마다 0.15초씩 지연하여 계단식 효과
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`    // promote 라벨에서 i * 0.15초 후 시작
        );

        // 맨 앞으로 온 카드(i === 0)의 속성 업데이트
        if (i === 0) {
          tl.call(() => {
            el.setAttribute('data-is-front', 'true');
            // 라이트 테마에서 맨 앞 카드의 텍스트를 진한 색으로 변경
            // h3(제목)는 제외하여 녹색 유지
            if (theme === 'light') {
              const textElements = el.querySelectorAll('p, span');
              textElements.forEach(textEl => {
                gsap.to(textEl, { color: '#111827', duration: 0.3 });
              });
            }
          }, undefined, 'promote');
        } else {
          // 뒤로 간 카드들의 속성 업데이트
          tl.call(() => {
            el.setAttribute('data-is-front', 'false');
            // 라이트 테마에서 뒤쪽 카드의 텍스트를 회색으로 변경
            if (theme === 'light') {
              const textElements = el.querySelectorAll('p, span');
              textElements.forEach(textEl => {
                gsap.to(textEl, { color: '#d1d5db', duration: 0.3 });
              });
            }
          }, undefined, 'promote');
        }
      });

      /**
       * PHASE 3: RETURN - 떨어진 카드가 맨 뒤 슬롯으로 복귀하는 애니메이션
       */
      // 맨 뒤 슬롯의 위치 계산 (인덱스 = 전체 카드 개수 - 1)
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);

      // 'return' 라벨 추가: PROMOTE의 durMove * returnDelay 시간 후 시작
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);

      // 먼저 zIndex를 맨 뒤로 설정 (다른 카드들 뒤에 표시)
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );

      // 떨어진 카드를 맨 뒤 위치로 애니메이션 이동
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      // 맨 뒤로 간 카드의 속성 업데이트
      tl.call(() => {
        elFront.setAttribute('data-is-front', 'false');
        // 라이트 테마에서 맨 뒤 카드의 텍스트를 회색으로 변경
        // h3(제목)는 제외하여 녹색 유지
        if (theme === 'light') {
          const textElements = elFront.querySelectorAll('p, span');
          textElements.forEach(textEl => {
            gsap.to(textEl, { color: '#d1d5db', duration: 0.3 });
          });
        }
      }, undefined, 'return');

      /**
       * PHASE 4: UPDATE - order 배열 업데이트
       * 맨 앞 카드를 맨 뒤로 보내 순환 완료
       * 예: [0, 1, 2] → [1, 2, 0]
       */
      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    // 첫 번째 swap 즉시 실행 (초기 애니메이션)
    swap();

    // 이후 delay 간격으로 반복 실행
    intervalRef.current = window.setInterval(swap, delay);

    /**
     * pauseOnHover 옵션 처리
     * 마우스 호버 시 애니메이션 일시정지, 호버 해제 시 재개
     */
    if (pauseOnHover) {
      const node = container.current;

      // 마우스 호버 시 실행되는 함수
      const pause = () => {
        tlRef.current?.pause();                // 현재 실행 중인 타임라인 일시정지
        clearInterval(intervalRef.current);    // setInterval 정지
      };

      // 마우스 호버 해제 시 실행되는 함수
      const resume = () => {
        tlRef.current?.play();                           // 타임라인 재개
        intervalRef.current = window.setInterval(swap, delay);  // setInterval 재시작
      };

      // 이벤트 리스너 등록
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);

      // Cleanup 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거 및 interval 정리
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }

    // pauseOnHover가 false일 때의 Cleanup 함수
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, theme]);

  /**
   * 자식 요소들을 렌더링 가능한 카드로 변환
   *
   * 각 자식 요소에 다음을 주입:
   * - key: React 리스트 렌더링용 고유 키
   * - ref: DOM 요소 참조 (애니메이션 제어에 사용)
   * - style: 카드의 width, height 및 기존 style 병합
   * - onClick: 카드 클릭 이벤트 핸들러 (기존 핸들러와 onCardClick 모두 실행)
   */
  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);  // 자식 요소의 기존 onClick 핸들러 호출
            onCardClick?.(i);           // CardSwap의 onCardClick prop 호출
          }
        })
      : child
  );

  /**
   * 컨테이너와 렌더링된 카드들 반환
   * 컨테이너는 card-swap-container 클래스를 가지며,
   * CSS에서 perspective 등 3D 효과를 위한 스타일이 적용됨
   */
  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
