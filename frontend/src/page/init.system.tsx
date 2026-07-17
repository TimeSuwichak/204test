import { useEffect } from "react";
import { useNavigate } from "react-router";

import utilLog from "#util/common.log.ts";
import utilNav from "#util/common.navigation.ts";

import apiAuth from "#util/api.auth.ts";

const content = function InitSystem (
  { onComplete }: { onComplete: () => void; })
{
  const navigate = useNavigate ();

  /**
   * ทำงานเมื่อระบบเริ่มโหลดข้อมูล
  */
  const onInit = () =>
  {
    utilLog.init ();
    utilNav.init (navigate);

    apiAuth.saveLoad ();
  }
  /**
   * ทำงานเมื่อระบบเริ่มหยุดการทำงาน
  */
  const onTerminate = () =>
  {
    utilNav.terminate ();
    utilLog.terminate ();

    apiAuth.saveReset ();
  }
  const onCompleteEvent = () =>
  {
    onComplete ();
    return;
  }
  useEffect (() =>
  {
    onInit ();
    onCompleteEvent ();

    return () =>
    {
      onTerminate ();
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (<></>);
}
export default content;