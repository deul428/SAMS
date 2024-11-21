import React from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import { Person } from 'react-bootstrap-icons';

/*
[rc-tree 라이브러리 설명]
    - 드래그 앤 드롭 X (드래그 앤 드롭을 사용하는 라이브러리들은 react 18에서 지원하지 않거나 dnd 이슈로 백엔드 충돌이 일어남.)
    - *는 필수값.
{속성}
    1) *title: 노드에 표시될 텍스트, 문자열 형식 작성.
    2) *key: 노드를 고유하게 식별하는 문자열, 유일한 key 값을 가져야 함. (트리 깊이에 따라 0-0-0 등의 구조로 작성)
    3) children: 하위 노드를 정의하는 배열, 여기서 depths 구성.
    4) isLeaf: 상위 노드가 하위 노드를 가질 수 없는 경우 true로 설정. 말단 노드를 명시적으로 표시 시 유용함.
    5) disabled: true 설정 시 노드 선택 및 클릭 비활성화.
    6) selectable: 특정 노드를 선택 가능하거나 불가능하게 만들 수 있음.
    7) icon: UI 아이콘 변경.
*/

// // 아이콘을 일괄적으로 지정하는 함수
// const assignIcons = (nodes) => {
//   return nodes.map(node => {
//     // '유저'가 포함된 title에는 사람 아이콘을 추가
//     if (node.title.includes('유저')) {
//       node.icon = <Person />;
//     }
//     // 하위 노드가 있으면 재귀적으로 아이콘을 할당
//     if (node.children) {
//       node.children = assignIcons(node.children);
//     }
//     return node;
//   });
// };

const treeData = [
  {
    title: 'AJICT', 
    key: '0-0',
    children: [
      {
        title: '본부 01',
        key: '0-0-0',
        children: [
          { 
            title: '팀 01', 
            key: '0-0-0-0', 
            // children: [
            //   { title: '유저 01',
            //     key: '0-0-0-0-0'
            //   },
            //   { title: '유저 02',
            //     key: '0-0-0-0-1'
            //   },
            //   { title: '유저 03',
            //     key: '0-0-0-0-2'
            //   },
            // ]
          },
          { 
            title: '팀 02', 
            key: '0-0-0-1', 
            // children: [
            //   { title: '유저 01',
            //     key: '0-0-0-1-0'
            //   },
            //   { title: '유저 02',
            //     key: '0-0-0-1-1'
            //   },
            //   { title: '유저 03',
            //     key: '0-0-0-1-2'
            //   },
            // ]
          },
        ],
      },
      {
        title: '본부 02',
        key: '0-0-1',
        children: [
            { 
                title: '팀 01', 
                key: '0-0-1-0',
                // children: [
                //   { title: '유저 01',
                //     key: '0-0-1-0-0'
                //   },
                //   { title: '유저 02',
                //     key: '0-0-1-0-1'
                //   },
                //   { title: '유저 03',
                //     key: '0-0-1-0-2'
                //   },
                // ]
            },
        ],
      },
    ],
  },
];

const TreeDepartUI = () => {
  // const dataWithIcons = assignIcons(treeData);

  return <Tree treeData={treeData} />;
};

export default TreeDepartUI;
