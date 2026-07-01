import react, { useState } from "react";
import styled from "styled-components";
import image from "#asset/image/home.testImage.jpg"
import { useNavigate } from "react-router-dom";

export default function Home ()
{
  const navigate = useNavigate ();
  const [uptime, setUptime] = useState ("00:00:00");

  react.useEffect (() =>
  {
      const interval = setInterval (() => 
      {
          const host = location.hostname;
          const url = `http://${host}:51000/uptime`;

          void fetch (url)
            .then ((x) => x.json ())
            .then ((x: Record<string, unknown>) => 
            { 
              const raw = Number (x.value);
              const hour = Math.floor (raw / 3600000).toString ().padStart (2, "0");
              const min = Math.floor ((raw / 60000) % 60).toString ().padStart (2, "0");
              const sec = Math.floor ((raw / 1000) % 60).toString ().padStart (2, "0");

              setUptime (`${hour}:${min}:${sec}`); 

            });
      }, 
      1000);

      return () =>
      {
          clearInterval (interval);
      }
  });

  return <>
    <View>
      <img src={image} height={384}/>
      <h1>สวัสดีชาวออกซิเจน</h1>
      <p>เวลาของเซิร์ฟเวอร์: {uptime}</p>
      <button onClick={() => void navigate ("/docs")}>ไปหน้าเอกสาร</button>
      <button onClick={() => void navigate ("/auth")}>ไปหน้าล็อคอิน</button>
      <button onClick={() => void navigate ("/product")}>ไปร้านค้า</button>
      <button onClick={() => void navigate ("/settings")}>ไปตั้งค่า</button>
    </View>
  </>;
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
`;