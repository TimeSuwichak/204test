import Self from "#component/customer.home.tsx";

const content = () =>
{
  return <>
    <Self.Opening/>
    <Self.Recommendation/>
    <Self.Favorite/>
    <Self.Ending/>
  </>;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;