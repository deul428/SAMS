// useState를 활용한 component별 데이터 이동
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function LoginForm() {
  const [testId, setTestId] = useState('');
  const [testPw, setTestPw] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(testId, testPw);
    // 브라우저 세션 유지
    navigate('/board', { state: { testId, testPw }});
  }
  return (
    <div id='login' className='wrap'>
      <div id='loginArea'>
          <form>
            <div className='inputFields idField'>
              <Form.Label htmlFor='inputId'>ID</Form.Label>
              <Form.Control defaultValue={testId} type='id' id='inputId' placeholder='User ID' onChange={(e) => setTestId(e.target.value)}/>
            </div>
            <div className='inputFields pwField'>
              <Form.Label htmlFor='inputPw'  >Password</Form.Label>
              <Form.Control defaultValue={testPw}
              type='password'
              id='inputPw' placeholder='Password' onChange={(e) => setTestPw(e.target.value)}
              aria-describedby='passwordHelpBlock'
              />
              <Form.Text id='passwordHelpBlock' muted>
              useState로 컴포넌트끼리 변수 넘겨 주는 Test Page
              </Form.Text>
            </div>
            <Button type='submit' variant='primary' onClick={handleSubmit}>확인</Button>
          </form>
          {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
      </div>
    </div>
  );
}

export default LoginForm;