import react from "react";
import styled from "styled-components";
import logMain from "#util/log.ts";
import logConsole from "#util/logConsole.ts";
import logInject from "#util/logInject.ts";
import logRemote from "#util/logRemote.ts";

import type { ReactNode } from "react";
import type {  CallbackData as LogCallbackData } from "#util/log.ts";

const content = function InitDebug ()
{
  return <>
    <content.ViewLog/>
  </>
}
content.ViewLog = function ViewLog ()
{
  const [log, setLog] = react.useState<ReactNode[]> ([]);
  const logHistory = react.useRef<LogCallbackData []> ([]);

  const onLogMessage = (x: LogCallbackData) =>
  {
    const backlog = 16;
    const backlogLimited = logHistory.current.length > backlog;
    const length = logHistory.current.length;
    const origin = logHistory.current.slice (
      (backlogLimited) ? 1 : 0,
      (backlogLimited) ? length - 1 : length
    );
    const view: ReactNode[] = [];

    origin.push (x);
    origin.forEach ((x, i) =>
    {
      const colorTag = "gray";
      const colorMsg = 
          x.level === logMain.LEVEL_INFO ? "white" :
          x.level === logMain.LEVEL_WARN ? "yellow" :
          x.level === logMain.LEVEL_ERROR ? "red" :
          x.level === logMain.LEVEL_FATAL ? "magenta" :
          x.level === logMain.LEVEL_VERBOSE ? "green" : "gray";
  
      view.push (
        <span key={String (i)}>
          <span style={{ color: colorTag }}>{x.tag}</span>
          <span>&nbsp;</span>
          <span style={{ color: colorMsg }}>{x.message.map ((y) => 
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

          }).join (" ")}</span>
          <br/>
        </span>
      );
    });

    logHistory.current = origin;
    setLog (view);
    return;
  }

  react.useEffect (() => 
  { 
    logMain.addListener (onLogMessage);
    logConsole.init ();
    logInject.init ();
    logRemote.init ();

    return () =>
    {
      logMain.removeListener (onLogMessage);
      logRemote.terminate ();
      logInject.terminate ();
      logConsole.terminate ();
    };

  },[]);

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
  font-family: 'font-code', 'monospace';
  font-weight: normal;
  font-style: normal;
  opacity: 0.25;
`;

export default content;