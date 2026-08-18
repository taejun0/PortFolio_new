---
title: "React Fiber"
date: "2026-06-24"
description: "React Fiber에 대해서"
thumbnail: "https://velog.velcdn.com/images/taejun0/post/a75498aa-d5c2-44c4-a599-695af858e384/image.png"
tags:
  - "JavaScript"
  - "React"
  - "프론트엔드"
series: "프론트엔드"
isVelogPost: false
---

# 서론

기존의 React는 Virtual DOM과 reconciliation을 이용해 실제 DOM을 다시 만들지 않고, 필요한 부분만 수정하는 방식으로 문제점을 해결해왔다.

그러나, 애플리케이션과 React 트리의 규모는 점점 더 커졌고, reconciliation을 계산하는 시간 자체도 매우 커지게 되었다.

기존의 React는 Stack Reconciler를 통해 컴포넌트 트리를 JavaScript 호출 스택에서 재귀적으로 처리했기 때문에, 작업을 시작하면 끝날 때까지 멈추기 어려웠다.

React는 이러한 문제를 해결하기 위해 기존 reconciler를 Fiber 아키텍처를 기반으로 다시 설계하고 React 16부터 적용했다.

해당 글에서는 React가 기존 Stack Reconciler에서 어떤 문제를 발견했으며, 이를 해결하기 위해 Fiber를 어떻게 설계했는지 살펴본다.

# 본론

가장 큰 원인은 역시나 작업 상태가 JavaScript 호출 스택에만 존재한다는 점이다.

React가 컴포넌트를 재귀적으로 처리하면 현재 어떤 컴포넌트를 처리하고 있는지, 작업이 끝난 뒤 어디로 돌아가야 하는지 등의 정보가 호출 스택에 쌓인다.

JavaScript 호출 스택에 들어간 함수는 해당 함수의 실행이 끝나고 반환될 때까지 계속 처리된다. 따라서 React가 reconciliation하는 도중에 사용자 입력과 같이 더 긴급한 작업이 발생하더라도 이를 적용하기 어려웠다.

## Fiber

Fiber는 2가지 의미로 사용된다.

### Fiber Architecture

React 16부터 사용된 새로운 reconciliation 및 렌더링 작업 관리 아키텍처 전체를 말한다.

기존 Stack Reconciler가 JavaScript 호출 스택에 의존하여 렌더링 작업을 처리했다면, Fiber Architecture는 React가 직접 관리하는 Fiber Node를 이용해 작업을 작은 단위로 나눈다.

이를 통해 React는 Render Phase 작업을 중단하거나 다시 시작하고, 업데이트마다 우선순위를 부여하거나, 필요 없어진 렌더링 결과를 폐기할 수 있어졌다.

### Fiber Node

React 트리의 한 위치를 표현하며, 해당 위치에 필요한 상태와 렌더링 작업 정보를 보관하는 JavaScript 객체이자 작업 단위이다.

컴포넌트 함수의 실행이 끝나면 함수의 지역 변수와 호출 스택은 사라지지만, Fiber Node는 React 내부에 남아 해당 위치의 정보를 계속 유지한다.

따라서 React는 Fiber Node를 통해 컴포넌트의 정체성, 트리에서의 위치, 현재 상태, 대기 중인 업데이트 및 이후에 수행할 작업을 추적할 수 있다.

Fiber Node는 사용자 컴포넌트에만 만들어지는 것이 아니다.

함수 컴포넌트와 클래스 컴포넌트뿐만 아니라 div, buttion과 같은 Host Component, 텍스트, Fragment 등 React가 관리하는 트리의 여러 종류의 노드가 Fiber로 표현된다.

## Fiber Node에 저장되는 정보

| 영역 | 대표 정보 | 역할 |
|---|---|---|
| 정체성 | `tag`, `type`, `key` | Fiber가 나타내는 노드의 종류와 정체성 판단 |
| 트리 구조 | `return`, `child`, `sibling` | 부모·자식·형제 Fiber 연결 |
| 입력 | `pendingProps`, `memoizedProps` | 새로운 props와 이전에 처리한 props |
| 상태 | `memoizedState`, `updateQueue` | state, Hooks 및 업데이트 관련 정보 관리 |
| 외부 인스턴스 | `stateNode` | DOM 노드, 클래스 인스턴스, Root 컨테이너 등 연결 |
| 스케줄링 | `lanes`, `childLanes` | 현재 Fiber와 하위 트리에 남은 작업의 우선순위 |
| 변경사항 | `flags`, `subtreeFlags` | Commit 단계에서 처리할 변경사항 표시 |
| 다른 버전 | `alternate` | Current Fiber와 Work-in-Progress Fiber 연결 |

### 왜 Fiber에 트리 구조가 필요한가?

Stack Reconciler는 JavaScript의 재귀 호출을 이용해 컴포넌트 트리를 탐색했다. 이 경우 현재 처리 위치와 이후에 수행할 작업은 JavaScript 호출 스택에 저장된다.

Fiber Reconciler는 호출 스택에 의존하지 않고 React가 직접 작업 순서를 제어해야 한다. 따라서 각 Fiber Node는 `child`, `sibling`, `return`을 통해 다음 자식, 형제 및 부모 Fiber를 명시적으로 가리킨다.

React는 이 연결을 이용해 Fiber를 하나씩 작업 단위로 처리한다.
작업 정보가 호출 스택이 아닌 Fiber 객체에 남아 있기 때문에, Render Phase를 중단한 뒤 이어서 처리하거나 더 높은 우선순위의 업데이트를 먼저 수행할 수 있다.

## Fiber가 업데이트를 처리하는 방식

Fiber는 렌더링 파이프라인에 새롭게 추가되는 하나의 단계가 아니다.

업데이트가 발생한 위치를 식별하고, 처리할 작업의 우선순위를 기록하고, 다음 UI를 계산한 뒤 실제 환경에 반영할 변경사항을 전달하는 등 React의 렌더링 과정 전반에서 사용되는 내부 구조이다.

Fiber의 관점에서 하나의 업데이트는 다음과 같이 처리된다.

```
업데이트 발생
      ↓
대상 Fiber와 Root에 작업 표시
      ↓
처리할 Lane 선택
      ↓
Work-in-Progress Fiber 준비
      ↓
Fiber 단위로 Render 작업 수행
      ↓
변경사항을 flags에 기록
      ↓
Commit
      ↓
Work-in-Progress Tree를 Current Tree로 전환
```

### 업데이트와 Fiber

업데이트가 발생하면 React는 해당 업데이트가 React 트리의 어느 위치와 관련돼 있는지 알아야 한다.

함수 컴포넌트의 useState 또는 useReducer 업데이트는 해당 Hook이 가진 Queue에 저장된다. 클래스 컴포넌트와 Host Root의 업데이트는 Fiber의 updateQueue를 중심으로 관리된다.

즉, React 전체가 사용하는 하나의 전역 Update Queue가 존재하는 것이 아니라, 업데이트의 종류에 따라 관련된 Fiber 또는 Hook 구조에 Queue가 연결된다.

Fiber는 이러한 업데이트가 어느 컴포넌트의 작업인지 식별하는 기준점으로 사용된다.

업데이트가 Queue에 등록되더라도 현재 state나 실제 DOM이 즉시 변경되지는 않는다.

React는 이후 Render Phase에서 선택된 업데이트를 Queue에서 읽고 다음 상태와 UI를 계산한다.

### Lane과 작업의 우선순위

Fiber Reconciler는 업데이트의 긴급성을 구분하기 위해 Lane을 사용한다.

Lane은 업데이트의 우선순위와 함께 처리할 작업의 그룹을 표현하는 내부 구조이다.

Fiber.lanes
→ 현재 Fiber 자체에 남아 있는 작업

Fiber.childLanes
→ 하위 Fiber Tree에 남아 있는 작업

업데이트가 발생하면 해당 Fiber의 lanes에 작업이 표시된다.

React는 해당 Fiber의 return을 따라 Root 방향으로 이동하면서 부모 Fiber의 childLanes에도 하위 트리에 처리할 작업이 존재한다는 사실을 표시한다.

```
HostRoot Fiber
└─ App Fiber
   └─ Content Fiber
      └─ List Fiber ← 업데이트 발생
```

이 과정을 통해 React는 Root에서부터 어느 하위 트리에 작업이 남아 있는지 확인할 수 있다.

Scheduler는 Root에 남아 있는 Lane을 기준으로 이번 Render에서 어떤 우선순위의 작업을 처리할지 결정한다.

낮은 우선순위의 Render 작업이 진행되는 도중 더 높은 우선순위의 업데이트가 발생하면 현재 작업을 중단하고 긴급한 업데이트를 먼저 처리할 수 있다.

### Current Tree와 Work-in-Progress Tree

직전에 말한, React가 Render 작업을 안전하게 중단하거나 폐기하려면 현재 사용자에게 보여주고 있는 결과와 계산 중인 결과가 분리돼야 한다.

현재 커밋된 React의 내부 상태를 나타내는 Fiber Tree를 Current Tree라고 한다.

다음 렌더링 결과를 계산하고 있는 Fiber Tree를 Work-in-Progress Tree라고 한다.

```
Current Fiber ←── alternate ──→ Work-in-Progress Fiber
```

동일한 React 트리 위치의 Current Fiber와 Work-in-Progress Fiber는 alternate를 통해 서로 연결된다.

이러한 구조를 흔히 **Double Buffering**이라고 설명한다.

### Fiber Work Loop

React는 Work-in-Progress Fiber 하나를 하나의 작업 단위로 처리한다.

개념적인 Work Loop는 다음과 같이 표현할 수 있다.

while (nextUnitOfWork !== null) {
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
}

실제 구현은 동기 렌더링과 Concurrent Rendering에 따라 다르지만, 기본적인 처리 단위는 Fiber이다.

Fiber 하나를 처리하는 과정은 크게 beginWork와 completeWork로 나누어 볼 수 있다.

beginWork
→ 자식 방향으로 내려가며 다음 UI 계산

completeWork
→ 자식의 작업을 완료하며 부모 방향으로 복귀

React는 Fiber의 child, sibling, return을 이용해 다음 작업 위치를 결정한다.

현재 Fiber에 child가 있음
→ child로 이동

child가 없음
→ completeWork 수행

sibling이 있음
→ sibling으로 이동

sibling도 없음
→ return을 따라 부모로 이동

이 과정이 반복되면서 Fiber Tree가 깊이 우선 방식으로 처리된다.

### Reconciliation

React는 새로운 React 요소와 현재 Fiber의 기존 자식 Fiber를 비교한다.

```
기존 자식 Fiber
       ↕
새로운 자식 React 요소
```

이는 Virtual DOM과 실제 DOM을 직접 비교하는 과정이 아니며, 완성된 Current Tree와 Work-in-Progress Tree 전체를 한 번에 비교하는 과정도 아니다.

React는 부모 Fiber의 자식 단위로 비교를 수행하면서 Work-in-Progress Fiber Tree를 점진적으로 구성한다.

이때 트리에서의 위치와 요소의 type, key 등을 이용해 기존 Fiber의 정체성을 보존할 수 있는지 판단한다.

정체성을 유지할 수 있음
→ 기존 Fiber의 상태와 정보를 재사용

정체성을 유지할 수 없음
→ 기존 Fiber를 삭제 대상으로 표시
→ 새로운 Fiber 생성
→ 기존 상태 초기화

Reconciliation을 통해 React는 다음 내용을 결정한다.

```
재사용할 Fiber
새롭게 생성할 Fiber
삭제할 Fiber
위치가 변경된 Fiber
props 또는 내용이 변경된 Fiber
```

Reconciliation 중에는 실제 DOM을 변경하지 않는 대신 이후 Commit Phase에서 수행해야 할 작업을 Fiber의 flags와 deletions 등에 표시한다.

Placement
→ 새로운 노드 삽입 필요

Update
→ 기존 노드 변경 필요

Deletion
→ 기존 노드 제거 필요

### Render Phase를 중단할 수 있는 이유

Fiber 이전에는 다음 작업 위치가 JavaScript 호출 스택에 저장됐다.

Fiber에서는 작업의 진행 정보가 child, sibling, return으로 연결된 객체에 남아 있다.

따라서 Concurrent Rendering에서는 Fiber 하나의 작업이 끝난 뒤 브라우저에 제어권을 반환할 수 있다.

Fiber A 처리
→ Fiber B 처리
→ 브라우저에 제어권 반환
→ 이후 Fiber C부터 다시 처리

더 높은 우선순위의 업데이트가 발생하면 기존 Render 작업을 중단하고 긴급한 업데이트를 먼저 처리할 수도 있다.

Fiber의 핵심은 단순히 reconciliation을 작은 단위로 나눈 것만이 아니다.

각 작업의 진행 상태와 우선순위를 지속적인 객체에 보관함으로써 React가 작업을 직접 중단하고, 재개하고, 폐기할 수 있게 만든 것이 핵심이다.

Render Phase에서는 실제 DOM을 변경하지 않기 때문에 이러한 중단과 폐기가 가능하다.

이것이 React 컴포넌트의 렌더링 로직이 순수해야 하는 이유와도 연결된다. Render Phase가 여러 번 실행되거나 계산 결과가 폐기되더라도 외부 환경에 잘못된 변경을 남겨서는 안 된다.

### 변경사항과 Commit

Render Phase가 완료되면 Fiber에는 실제 환경에 적용해야 할 변경사항이 기록돼 있다.

flags
→ 현재 Fiber의 변경사항

subtreeFlags
→ 하위 트리의 변경사항

deletions
→ 제거해야 할 자식 Fiber

Commit Phase에서는 finishedWork에 기록된 변경사항을 확인하고 stateNode를 통해 실제 DOM에 접근한다.

Fiber의 flags 확인
→ stateNode를 통해 실제 DOM 접근
→ DOM 삽입·수정·삭제

대표적인 변경사항은 다음과 같다.

Placement
→ 새로운 DOM 노드 삽입

Update
→ 기존 DOM 속성이나 텍스트 변경

Deletion
→ 기존 DOM 노드 제거

Ref
→ ref 연결 또는 해제

Commit Phase는 Render Phase와 달리 일반적으로 중간에 중단하지 않는다.

실제 DOM 일부만 변경된 불완전한 상태를 사용자에게 보여주지 않고, Render Phase에서 계산한 일관된 결과를 한 번에 반영해야 하기 때문이다.

### Current Tree 전환

Commit이 완료되면 지금까지 계산한 Work-in-Progress Tree가 새로운 Current Tree가 된다.

root.current = finishedWork;

이는 실제 DOM Tree 전체를 새로운 DOM Tree로 교체한다는 의미가 아니다.

실제 DOM은 Fiber에 기록된 flags를 기준으로 필요한 부분만 변경된다. root.current의 변경은 어떤 Fiber Tree가 현재 커밋된 React의 내부 상태인지를 갱신하는 작업이다.

Commit 이전

Current Tree
→ 현재 화면에 반영된 상태

Work-in-Progress Tree
→ 다음 UI 계산이 완료된 상태

Commit 이후

기존 Work-in-Progress Tree
→ 새로운 Current Tree

기존 Current Tree
→ 다음 업데이트에서 재사용할 alternate

두 Fiber Tree가 alternate를 통해 연결돼 있기 때문에 React는 다음 업데이트에서 기존 객체를 다시 Work-in-Progress Fiber로 사용할 수 있다.

새로운 렌더링마다 전체 Fiber 객체를 처음부터 생성하지 않고 두 버전을 번갈아 재사용하는 것이다.

### Fiber와 state의 관계

즉, Fiber는 state를 저장하기 위해 처음 만들어진 구조는 아니다.

Fiber의 핵심 목적은 reconciliation 작업을 작은 단위로 분리하고, 각 작업의 진행 상태와 우선순위를 React가 직접 관리할 수 있도록 만드는 것이다.

그러나 Fiber가 React 트리에서 컴포넌트의 지속적인 위치와 정체성을 나타내기 때문에 state와 Hook을 연결하는 기준점으로도 사용된다.

함수 컴포넌트에서는 Fiber의 memoizedState가 첫 번째 Hook을 가리킨다.

```
Function Component Fiber
└─ memoizedState
   └─ 첫 번째 Hook
      └─ next
         └─ 두 번째 Hook
            └─ next
               └─ 세 번째 Hook
```

각 useState 또는 useReducer Hook은 자신의 상태와 Update Queue를 가진다.

따라서 함수 컴포넌트가 렌더링마다 다시 실행되더라도 React는 Fiber에 연결된 Hook 구조를 통해 이전 상태를 다시 찾을 수 있다.

Fiber의 정체성이 유지되면 해당 Fiber에 연결된 state도 보존된다.

반대로 요소의 type이나 key가 변경되어 기존 Fiber를 재사용할 수 없다면 새로운 Fiber가 생성되고, 기존 Fiber에 연결된 state도 함께 제거된다.

이것이 React에서 state가 컴포넌트 함수 자체가 아니라 React 트리의 위치에 연결돼 있다고 설명하는 내부적인 이유이다.

# 결론

Fiber의 핵심 가치는 reconciliation을 작업 단위로 나누고 각 작업의 진행 상태를 객체에 보관함으로써 Render Phase를 중단·재개·폐기하고, 업데이트의 우선순위를 조절할 수 있게 만든 데 있다.

사실, Fiber를 공부하기 전 React가 새로운 Virtual DOM을 만들고, 이전 결과와 비교하여 diff를 기반으로 실제 DOM을 수정한다! 정도로만 알고 있었다.

또한, useState나 useEffect를 각각 공부했을 때는 이러한 규칙들이 단순히 React 사용법처럼 느껴졌다. 그러나 Fiber를 기준으로 살펴보면 해당 규칙들이 React의 렌더링 구조에서 자연스럽게 나온 결과라는 것을 알 수 있었다.

React 공식 문서는 개발자가 의존해야하는 동작과 사용 방법을 중심으로 설명하기에 Fiber와 같은 내부 구조를 자세히 다루지 않는다.

그러나, Fiber를 이해함으로 React가 왜 이러한 규칙을 제공하는지 설명할 수 있는 기반이 되었다.

결국 Fiber는 단순한 JavaScript 객체 하나가 아니라, React가 선언적인 UI 모델을 유지하면서도 복잡한 렌더링 작업을 제어하기 위해 선택한 핵심임을 알 수 있었다.