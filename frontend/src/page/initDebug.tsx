import react from "react";
import styled from "styled-components";
import logMain from "#util/common.log.ts";
import logConsole from "#util/common.logConsole.ts";
import logRemote from "#util/common.logRemote.ts";

import type { ReactNode } from "react";
import type {  CallbackData as LogCallbackData } from "#util/common.log.ts";

const content = function InitDebug ()
{
  return <>
    <content.ViewLog/>
  </>
}
content.ViewLog = function ViewLog ()
{
  const [logView, setLogView] = react.useState<ReactNode[]> ([]);
  const logHistory = react.useRef<LogCallbackData []> ([]);

  const onLogReceived = (x: LogCallbackData) =>
  {
    const backlog = 16;
    const backlogLimited = logHistory.current.length > backlog;
    const length = logHistory.current.length;
    const origin = logHistory.current.slice (
      (backlogLimited) ? 1 : 0,
      (backlogLimited) ? length - 1 : length
    );

    origin.push (x);
    logHistory.current = origin;
    onLogRender ();
    return;
  }
  const onLogRender = () =>
  {
    const view: ReactNode[] = [];
    const origin = logHistory.current;

    origin.forEach ((x, i) =>
    {
      const colorTag = "gray";
      const colorMsg = 
          x.level === logMain.LEVEL_INFO ? "white" :
          x.level === logMain.LEVEL_WARN ? "yellow" :
          x.level === logMain.LEVEL_ERROR ? "red" :
          x.level === logMain.LEVEL_FATAL ? "magenta" :
          x.level === logMain.LEVEL_VERBOSE ? "green" : "gray";

      const message = x.message.map ((y) => 
      {
          if (typeof y === "string") { 
            return y; 
          }
          if (typeof y === "number" || typeof y === "boolean") { 
            return String (y);
          }
          if (typeof y === "object" && y instanceof Date) {
            return y.toLocaleString ();
          }
          if (typeof y === "object" && y instanceof Error) {
            return decodeURI (String (y.stack));
          }
          return JSON.stringify (y, null, 4);
      });
      const messageId = String (i);
      const messageString = message.join (" ");
  
      view.push (
        <LogViewText key={messageId} $color={colorMsg}>
          <span style={{ color: colorTag }}>{x.tag}</span>
          <span>&nbsp;</span>
          {messageString}
        </LogViewText>
      );
    });
    setLogView (view);
    return;
  }

  react.useEffect (() => 
  { 
    logMain.addListener (onLogReceived);
    logConsole.init ();
    logRemote.init ();

    return () =>
    {
      logMain.removeListener (onLogReceived);
      logRemote.terminate ();
      logConsole.terminate ();
    };

  },[]);

  return <>
    <LogView>{logView}</LogView>
  </>;
}

const LogView = styled.pre`
  padding: 16px;
  position: fixed;
  pointer-events: none;
  inset: auto 0px 0px 0px;
  display: block;
  text-shadow: 1px 1px 0px #000000;
  font-family: 'font-code', 'monospace';
  font-weight: normal;
  font-style: normal;
  opacity: 0.50;
  overflow: hidden;
`;
const LogViewText = styled.p<{ $color: string }>`
  text-shadow: 1px 1px 0px #000000;
  font-family: 'font-code', 'monospace';
  font-size: 1rem;
  font-weight: normal;
  font-style: normal;
  color: ${prop => prop.$color};
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;