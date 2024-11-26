// useLocation을 활용한 데이터 받아오기 
import React from 'react';
import { useLocation } from 'react-router-dom';

function Board() {
  const location = useLocation(); 
  const { testId, testPw } = location.state || {};
  return (
    <p>
      {`id: ${testId}\npw: ${testPw}`}
    </p>
  );
}

export default Board;
