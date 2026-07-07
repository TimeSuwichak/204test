import react from "react";
import styled from "styled-components";
import logRemote from "#util/api.logRemote.ts";

import type { ReactNode } from "react";
import type {  CallbackMessage } from "#util/api.logRemote.ts";

const content = function InitDebug ()
{
  const [log, setLog] = react.useState<ReactNode[]> ([]);
  const logHistory = react.useRef<CallbackMessage []> ([]);
  const mounted = react.useRef (false);

  const onLogMessage = (x: CallbackMessage) =>
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
          x.level === logRemote.LEVEL_INFO ? "white" :
          x.level === logRemote.LEVEL_WARN ? "yellow" :
          x.level === logRemote.LEVEL_ERROR ? "red" :
          x.level === logRemote.LEVEL_FATAL ? "magenta" :
          x.level === logRemote.LEVEL_VERBOSE ? "green" : "gray";
  
      view.push (
        <span key={String (i)}>
          <span style={{ color: colorTag }}>{x.tag}</span>
          <span>&nbsp;</span>
          <span style={{ color: colorMsg }}>{x.message.map ((y) => 
          {
            switch (y.key)
            {
              case 0: return JSON.stringify (y.value);
              case 1: return String (y.value);
              case 2: return String (y.value);
              case 3: return new Date (y.value).toLocaleString ();
              case 4: return String (y.stack);
            }
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
    if (mounted.current) {
      return;
    }
    void logRemote.init ();

    logRemote.onMessage.add (onLogMessage);
    mounted.current = true;

    return () =>
    {
      void logRemote.close ();

      logRemote.onMessage.remove (onLogMessage);
      mounted.current = false;
    }
  },
  []);

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
  font-weight: normal;
  font-style: normal;
`;

export default content;