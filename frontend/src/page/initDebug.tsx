import react from "react";
import styled from "styled-components";

const content = function InitDebug ()
{
  const [log, setLog] = react.useState ([<></>]);

  react.useEffect (() =>
  {
    return;
  });

  return <>
    <LogView>{log}</LogView>
  </>;
}

const LogView = styled.pre`
  padding: 16px;
  position: fixed;
  pointer-events: none;
  inset: auto 0px 0px 0px;
  display: block;
  font-family: monospace;
`;

export default content;