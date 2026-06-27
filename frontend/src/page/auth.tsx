import styled from "styled-components";
import LoginComponent from "#component/auth.tsx";
export default function Auth ()
{
  return <View>
      <LoginComponent/>
  </View>;
}

const View = styled.div `
  
      position: absolute;
      inset: 0px;
      width: 100%;
      height: 100%;
  
      display: flex; 
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
`