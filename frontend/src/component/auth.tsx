import styled from "styled-components";

const content = function ()
{
  return <>
   <Box>
   <h1>Welcome To Our Website!</h1>
    <LoginBox>
        <InsertDisplay>
          Username
          <InsertBox type="text" placeholder="Username"/>
        </InsertDisplay>
        <InsertDisplay>
          Password
          <InsertBox type="text" placeholder="Password"/>
        </InsertDisplay>
    <div style={{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      width:'100%',
    }}>
      <p style={{color:'blue',fontSize:'0.9rem'}}>Forgot Password?</p> 
      <p style={{color:'blue',fontSize:'0.9rem'}}>Create account</p>
    </div>
    </LoginBox>
    <a href="/" style={{width:'100%'}}><LoginButton>LOGIN</LoginButton></a>
   </Box>
  </>;
}
export default content;

const Box = styled.div `
  display: flex; 
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  /* border: 1px solid white; */
  width: 30%;
  height: 40%;
  gap: 1rem;
`

const LoginBox = styled.div `

  background-color:white;
  border: 1px solid white;
  border-radius: 0.5rem;
  padding:1rem;
  font-size: 1.5rem;
  width: 100%;
  height: 100%;
  color: black;
`

const LoginButton = styled.button `
  background-color:blue;
  color:white;
  border: 0px solid white;
  border-radius: 0.3rem;
  padding:0.5rem;
  width: 100%;
  font-size: 1.5rem;
`

const InsertDisplay = styled.div `
  color: black;
`

const InsertBox = styled.input `
  background-color:white;
  border-radius: 0.3rem;
  padding:0.7rem;
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0.2rem;
  border: 1px solid black;  
  color: black;
  font-size: 0.9rem;
`

// const RegisterButton = styled.button `
//   background-color:green;
//   color:white;
//   border: 1px solid white;
//   border-radius: 0.3rem;
//   padding:0.5rem;
//   margin-top: 1rem;
// `