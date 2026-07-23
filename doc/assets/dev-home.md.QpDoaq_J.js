import{_ as a,o as n,c as i,ae as t}from"./chunks/framework.D9JM1nqk.js";const e="/UniversityCSI204/doc/assets/dev-diagram-use-case.drawio.8V4AKKML.svg",c=JSON.parse('{"title":"🏷️ ระบบเว็บไซต์ขายแผ่นและตลับเกม","description":"","frontmatter":{},"headers":[],"relativePath":"dev-home.md","filePath":"dev-home.md"}'),l={name:"dev-home.md"};function p(r,s,d,E,h,k){return n(),i("div",null,[...s[0]||(s[0]=[t('<h1 id="🏷️-ระบบเว็บไซต์ขายแผ่นและตลับเกม" tabindex="-1">🏷️ ระบบเว็บไซต์ขายแผ่นและตลับเกม <a class="header-anchor" href="#🏷️-ระบบเว็บไซต์ขายแผ่นและตลับเกม" aria-label="Permalink to &quot;🏷️ ระบบเว็บไซต์ขายแผ่นและตลับเกม&quot;">​</a></h1><ul><li>67168514 ปิยะบุตร อิ่มทอง - <a href="https://github.com/iKla47" target="_blank" rel="noreferrer">iKla47</a> (Customer / Database Administrator)</li><li>67163266 สิรภพ อ่วมแก้ว - <a href="https://github.com/SiRaCCC" target="_blank" rel="noreferrer">SiRaCCC</a> (Staff)</li><li>67117502 ชนันธร สะอาดจินดา - <a href="https://github.com/chananthornsaa" target="_blank" rel="noreferrer">chananthornsaa</a> (Project Manager / System Analyst)</li><li>67151039 ณัฐดนัย แสงศรี - <a href="https://github.com/Bek0saMa" target="_blank" rel="noreferrer">Beky0mi</a> (Customer)</li><li>67173119 สุวิจักขณ์ ทัพเจริญ - <a href="https://github.com/TimeSuwichak" target="_blank" rel="noreferrer">straycatalwaysstay</a> (Manager)</li></ul><h2 id="หลักการและเหตุผล-relationable" tabindex="-1">หลักการและเหตุผล (Relationable) <a class="header-anchor" href="#หลักการและเหตุผล-relationable" aria-label="Permalink to &quot;หลักการและเหตุผล (Relationable)&quot;">​</a></h2><p>ในปัจจุบันอุตสาหกรรมเกมมีการเติบโตอย่างต่อเนื่อง แม้ว่าการซื้อขายเกมในรูปแบบดิจิทัลดาวน์โหลด (Digital Download) จะได้รับความนิยม แต่ความต้องการในการซื้อขายแผ่นเกมและตลับเกมในรูปแบบรูปธรรม (Physical Copy) ทั้งในกลุ่มเกมเมอร์ยุคใหม่และกลุ่มนักสะสมเกมคลาสสิก (Retro Gamers) ยังคงมีมูลค่าการตลาดที่สูงมาก ปัญหาที่พบในปัจจุบันคือ ร้านขายแผ่นเกมส่วนใหญ่อาจยังไม่มีระบบการจัดการสินค้าออนไลน์ที่มีประสิทธิภาพเพียงพอ หรือแพลตฟอร์ม E-commerce ทั่วไปไม่มีการจัดหมวดหมู่ที่ตอบโจทย์เฉพาะกลุ่มผู้เล่นและนักสะสม เช่น การระบุแพลตฟอร์ม (Platform), โซนของแผ่นเกม (Zone), แนวเกม (Genre) และความหายากของตลับเกมเก่าอย่างชัดเจน</p><p>นอกจากนี้ การบริหารจัดการหลังร้านสำหรับผู้ประกอบการยังมีความยุ่งยากในการตัดสต็อก การติดตามสถานะการจัดส่ง และการสรุปยอดขาย ดังนั้น ผู้จัดทำจึงมีแนวคิดที่จะพัฒนา &quot;ระบบร้านขายแผ่นและตลับเกม&quot; ซึ่งเป็นระบบ E-Commerce ที่ออกแบบมาเพื่อตอบสนองความต้องการของร้านขายเกมโดยเฉพาะ เพื่ออำนวยความสะดวกให้แก่ลูกค้าในการค้นหาและสั่งซื้อสินค้า และช่วยให้พนักงานและผู้จัดการสามารถบริหารจัดการสินค้า สต็อก ออเดอร์ และดูรายงานยอดขายได้อย่างเป็นระบบและมีประสิทธิภาพสูงสุด</p><h2 id="วัตถุประสงค์ของโครงงาน-objectives" tabindex="-1">วัตถุประสงค์ของโครงงาน (Objectives) <a class="header-anchor" href="#วัตถุประสงค์ของโครงงาน-objectives" aria-label="Permalink to &quot;วัตถุประสงค์ของโครงงาน (Objectives)&quot;">​</a></h2><ol><li>เพื่อพัฒาระบบพาณิชย์อิเล็กทรอนิกส์ (E-Commerce) สำหรับร้านขายแผ่นและตลับเกม ทั้งแพลตฟอร์มยุคปัจจุบันและยุคคลาสสิก</li><li>เพื่อสร้างระบบการจัดการข้อมูลสินค้า (Product Management) ที่สามารถแบ่งหมวดหมู่และรายละเอียดเฉพาะของแผ่นและตลับเกมได้อย่างเป็นระบบ</li><li>เพื่อพัฒนาระบบจัดการคำสั่งซื้อ (Order Management) และจำลองการติดตามสถานะการจัดส่งพัสดุ (Mock Shipping API) ที่ช่วยให้กระบวนการซื้อขายครบวงจร</li><li>เพื่อสร้างระบบรายงานยอดขาย (Revenue Dashboard) สำหรับผู้บริหาร เพื่อนำข้อมูลไปใช้ในการวิเคราะห์และวางแผนการตลาด</li><li>เพื่อศึกษาและประยุกต์ใช้ความรู้ด้านการพัฒนาระบบซอฟต์แวร์ตามวงจรการพัฒนาระบบ (SDLC) ในสถานการณ์จำลองจริง</li></ol><h2 id="ขอบเขตของระบบ-system-scope" tabindex="-1">ขอบเขตของระบบ (System Scope) <a class="header-anchor" href="#ขอบเขตของระบบ-system-scope" aria-label="Permalink to &quot;ขอบเขตของระบบ (System Scope)&quot;">​</a></h2><p>ผู้ใช้งาน (Actors) และความสามารถหลักของระบบ (Main Functions):</p><ol><li>ลูกค้า (Customer) - ผู้ซื้อ</li></ol><ul><li><p>ระบบสมาชิก (Register / Login)</p></li><li><p>ระบบค้นหาและคัดกรองสินค้าแบบละเอียด (Advanced Filter)</p></li><li><p>ระบบรายการสินค้าที่ชอบ (Add / Delete)</p></li><li><p>ระบบตะกร้าสินค้า (Add / Edit / Delete)</p></li><li><p>ระบบการชำระเงิน (Mock Payment)</p></li><li><p>ระบบติดตามสถานะการจัดส่งพัสดุ (Mock Shipping API)</p></li><li><p>ระบบรายงานสินค้า</p></li></ul><ol start="2"><li>พนักงาน (Staff) - ผู้ดูแลการจัดส่งสต็อกและออเดอร์</li></ol><ul><li><p>ระบบเข้าสู่ระบบ (Login)</p></li><li><p>ระบบจัดการข้อมูลสินค้าและสต็อก (Add / Edit)</p></li><li><p>ระบบจัดการคำสั่งซื้อและอัปเดตสถานะการจัดส่ง (Edit / Update)</p></li><li><p>ระบบรับเรื่องรีพอร์ตเกี่ยวกับสินค้า</p></li></ul><ol start="3"><li>ผู้จัดการ (Manager) - ผู้ดูแลระบบ / Admin</li></ol><ul><li><p>ระบบเข้าสู่ระบบ (Login)</p></li><li><p>ระบบรายงานยอดขายและสถิติ (Revenue Dashboard) - ดูภาพรวมรายได้ ดูสถิติคำสั่งซื้อ สัดส่วนยอดขายตามแพลตฟอร์ม และอันดับเกมขายดี</p></li><li><p>ระบบแจ้งเตือนสินค้าใกล้หมดสต็อก (Low Stock Alert System)</p></li><li><p>ระบบจัดการบัญชีผู้ใช้งาน (User Management) - จัดการบัญชีของพนักงานและลูกค้า (Add / Edit / Delete)</p></li><li><p>ระบบจัดการโปรโมชันและคูปองส่วนลด (Promotions &amp; Coupons) (Add / Edit / Delete)</p></li><li><p>ระบบตั้งค่าข้อมูลหลักของร้าน (System Settings) - จัดการหมวดหมู่ แพลตฟอร์ม และแนวเกม (Add / Edit / Delete)</p></li><li><p>สิทธิ์การทำงานครอบคลุมพนักงาน (Staff Override) - สามารถจัดการข้อมูลสินค้า สต็อก และคำสั่งซื้อได้ทั้งหมด (Add / Edit / Delete / Update)</p></li></ul><h2 id="แนวทางการพัฒนาตาม-sdlc-system-development-life-cycle" tabindex="-1">แนวทางการพัฒนาตาม SDLC (System Development Life Cycle) <a class="header-anchor" href="#แนวทางการพัฒนาตาม-sdlc-system-development-life-cycle" aria-label="Permalink to &quot;แนวทางการพัฒนาตาม SDLC (System Development Life Cycle)&quot;">​</a></h2><table tabindex="0"><thead><tr><th>ขั้นตอน (Phase)</th><th>รายละเอียดโดยย่อ (Brief Description)</th></tr></thead><tbody><tr><td>1.Planing</td><td>วิเคราะห์ความต้องการและกำหนดขอบเขตของระบบ</td></tr><tr><td>2.Analysis</td><td>วิเคราะห์กระบวนการทำงานและจำลองระบบ (Use Case, ER-Diagram)</td></tr><tr><td>3.Design</td><td>ออกแบบสถาปัตยกรรมระบบ ฐานข้อมูล และหน้าจอผู้ใช้งาน (UI/UX)</td></tr><tr><td>4.Development</td><td>พัฒนา Frontend ด้วย React และ HTML/CSS พร้อมพัฒนา Backend API ด้วย Node.js โดยควบคุมเวอร์ชั่นโค้ดผ่าน GitHub</td></tr><tr><td>5.Testing</td><td>ทดสอบการทำงานแบบ Manual Testing, ตรวจสอบ API ด้วย Postman และทำการทดสอบการยอมรับของผู้ใช้</td></tr><tr><td>6.Deployment</td><td>นำระบบขึ้นเผยแพร่ (Deploy) ให้ใช้งานได้จริง</td></tr><tr><td>7.Maintenance</td><td>บำรุงรักษาและปรับปรุงระบบตามข้อเสนอแนะ</td></tr></tbody></table><h2 id="🛠️-เครื่องมือและเทคโนโลยี-tools-technologies" tabindex="-1">🛠️ เครื่องมือและเทคโนโลยี (Tools &amp; Technologies) <a class="header-anchor" href="#🛠️-เครื่องมือและเทคโนโลยี-tools-technologies" aria-label="Permalink to &quot;🛠️ เครื่องมือและเทคโนโลยี (Tools &amp; Technologies)&quot;">​</a></h2><p><em>(รายการนี้สถานะไม่คงที่ และอาจเปลี่ยนแปลงได้ในอนาคต)</em></p><p>ส่วนหน้า (Frontend)</p><ul><li>NodeJS: รันไทม์สำหรับภาษาโปรแกรม JavaScript (ใช้ระหว่างพัฒนา)</li><li>TypeScript: ภาษาเพิ่มเติมจาก JavaScript ที่ช่วยจับข้อผิดพลาดผ่าน Type-Checking และ Interface</li><li>Vite: เครื่องมือในการสร้างเว็บไซต์และรันเซิร์ฟเวอร์ในระหว่างการพัฒนา (Development Server),</li><li>React: ไลบรารีอำนวยความสะดวกในการสร้าง UI ผ่านแนวคิดส่วนประกอบ (Component)</li><li>Styled Components: อำนวยความสะดวกในการใช้งาน CSS ร่วมกับ React</li><li>ESLint: ตรวจจับความผิดพลาดเชิงตรรกะในโค้ด</li></ul><p>ส่วนหลัง (Backend)</p><ul><li>Node.js: รันไทม์สำหรับภาษาโปรแกรม JavaScript</li><li>TypeScript: ภาษาเพิ่มเติมจาก JavaScript ที่ช่วยจับข้อผิดพลาดผ่าน Type-Checking และ Interface</li><li>Express: ระบบจัดการเชื่อมต่อระหว่างผู้ใช้บน HTTP/HTTPS</li><li>Express RateLimit: เพิ่มการจำกัดเข้าถึงทรัพยากรบนเซิร์ฟเวอร์ด้วยช่วงเวลา</li><li>Cors: เพิ่มการจำกัดเข้าถึงทรัพยากรบนเซิร์ฟเวอร์กับผู้ใช้บางส่วน</li><li>Compression: เพิ่มการบีบอัดข้อมูลระหว่างการเชื่อมต่อกับเซิร์ฟเวอร์</li><li>ESLint: ตรวจจับความผิดพลาดเชิงตรรกะในโค็ด</li><li>Nodemon: อำนวยความสำดวกในการพัฒนาระบบ</li></ul><p>ส่วนข้อมูล (Database)</p><ul><li><p>MySQL: สำหรับการจัดเก็บข้อมูลผู้ใช้, ข้อมูลสินค้า, ข้อมูลชำระเงิน, ข้อมูลจัดส่ง, ประวัติ, และรวมไปถึงกิจกรรมระบบ</p></li><li><p>ส่วนออกแบบ (Design Tool)</p><ul><li>Draw.io: ใช้งานสำหรับการเขียนวาดภาพไดอะแกรม Use Cases Diagram, Sequences Diagram</li></ul></li></ul><h2 id="แนวทางการทดสอบ-testing-approach" tabindex="-1">แนวทางการทดสอบ (Testing Approach) <a class="header-anchor" href="#แนวทางการทดสอบ-testing-approach" aria-label="Permalink to &quot;แนวทางการทดสอบ (Testing Approach)&quot;">​</a></h2><p>ประเภทการทดสอบ (Test Types):</p><ul><li>Functional Testing</li><li>User Acceptance Testing (UAT) เครื่องมือที่ใช้ (Tools):</li><li>Postman (สำหรับทดสอบ API)</li><li>Manual Testing (ทดสอบการทำงานของระบบด้วยตนเองตามฟังก์ชันที่พัฒนา)</li></ul><h2 id="ผลลัพธ์ที่คาดว่าจะได้รับ-expected-outcomes" tabindex="-1">ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes) <a class="header-anchor" href="#ผลลัพธ์ที่คาดว่าจะได้รับ-expected-outcomes" aria-label="Permalink to &quot;ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)&quot;">​</a></h2><ol><li>ได้ระบบร้านขายแผ่นและตลับเกม (E-Commerce) ที่สามารถใช้งานได้จริงผ่านเว็บเบราว์เซอร์</li><li>ลูกค้าสามารถค้นหาสินค้า สั่งซื้อ และติดตามสถานการณ์จัดส่งได้อย่างสะดวกและรวดเร็ว</li><li>พนักงานมีเครื่องมือที่ช่วยในการจัดการสต็อกสินค้าและสถานะคำสั่งซื้อได้อย่างถูกต้องแม่นยำ ลดข้อผิดพลาดในการทำงานผู้จัดการมีระบบสรุปข้อมูลยอดขาย (Dashboard) ที่แสดงผลแบบภาพรวม ช่วยในการตัดสินใจทางธุรกิจ</li><li>ผู้จัดทำโครงงานได้รับทักษะและประสบการณ์ตรงในการพัฒนาระบบแบบ Full-stack และเข้าใจกระบวนการทำงานแบบวิศวกรรมซอฟต์แวร์</li></ol><h2 id="แผนการดําเนินงาน-4-สัปดาห์-work-plan-4-weeks" tabindex="-1">แผนการดำเนินงาน 4 สัปดาห์ (Work Plan: 4 Weeks) <a class="header-anchor" href="#แผนการดําเนินงาน-4-สัปดาห์-work-plan-4-weeks" aria-label="Permalink to &quot;แผนการดำเนินงาน 4 สัปดาห์ (Work Plan: 4 Weeks)&quot;">​</a></h2><table tabindex="0"><thead><tr><th>สัปดาห์ (Week)</th><th>กิจกรรม (Activities)</th><th>รายละเอียดโดยย่อ (Brief Description)</th></tr></thead><tbody><tr><td>1</td><td>วิเคราะห์และออกแบบระบบ (Analysis &amp; Design)</td><td>วิเคราะห์ความต้องการของระบบ ออกแบบ Use Case, ER-Diagram และ UI/UX</td></tr><tr><td>2</td><td>พัฒนา Frontend (Frontend Development)</td><td>พัฒนาหน้าจอผู้ใช้ส่วนหน้าโดยใช้ React</td></tr><tr><td>3</td><td>พัฒนา Backend และฐานข้อมูล (Backend &amp; Database Development)</td><td>สร้าง API จัดการสินค้า, เชื่อมต่อ API สำหรับชำระเงิน และทำ Mock Shipping</td></tr><tr><td>4</td><td>ทดสอบระบบและนำเสนอผลงาน (Testing &amp; Presentation)</td><td>ทำ Manual Testing/UAT ตรวจสอบบัค และเตรียมพรีเซนต์โปรเจกต์</td></tr></tbody></table><h3 id="ข้อกําหนดที่ไม่ใช่เชิงหน้าที่-non-functional-requirements-nfrs" tabindex="-1">ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements: NFRs) <a class="header-anchor" href="#ข้อกําหนดที่ไม่ใช่เชิงหน้าที่-non-functional-requirements-nfrs" aria-label="Permalink to &quot;ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements: NFRs)&quot;">​</a></h3><table tabindex="0"><thead><tr><th>หมวดหมู่</th><th>ข้อกำหนดที่ไม่ใช่เชิงหน้าที่</th></tr></thead><tbody><tr><td><strong>ประสิทธิภาพ (Performance)</strong></td><td>ระบบควรแสดงผลการค้นหาสินค้า รายละเอียดสินค้า และข้อมูลคำสั่งซื้อได้ภายในระยะเวลาที่เหมาะสม (เช่น ไม่เกิน 3 วินาทีในสภาวะการใช้งานปกติ)</td></tr><tr><td><strong>ความพร้อมใช้งาน (Availability)</strong></td><td>ระบบควรพร้อมให้บริการสำหรับลูกค้าในการค้นหาสินค้า สั่งซื้อสินค้า และติดตามสถานะคำสั่งซื้อได้ตลอดเวลาที่เซิร์ฟเวอร์ทำงาน</td></tr><tr><td><strong>ความง่ายในการใช้งาน (Usability)</strong></td><td>ระบบควรมีส่วนติดต่อผู้ใช้ที่เข้าใจง่าย ใช้งานสะดวก และเหมาะสมสำหรับ Customer, Staff และ Manager</td></tr><tr><td><strong>ความน่าเชื่อถือ (Reliability)</strong></td><td>ระบบต้องสามารถบันทึกข้อมูลผู้ใช้ ตะกร้าสินค้า คำสั่งซื้อ รีวิว รายการโปรด และข้อมูลสต็อกได้อย่างถูกต้องโดยไม่สูญหาย</td></tr><tr><td><strong>ความถูกต้องของข้อมูล (Data Integrity)</strong></td><td>จำนวนสินค้าคงเหลือต้องถูกอัปเดตอย่างถูกต้องหลังการยืนยันคำสั่งซื้อ และระบบต้องสร้าง Low Stock Alert เมื่อจำนวนสินค้าเหลือต่ำกว่าค่าที่กำหนด</td></tr><tr><td><strong>ความปลอดภัย (Security)</strong></td><td>ผู้ใช้ต้องเข้าสู่ระบบก่อนเข้าถึงฟังก์ชันที่มีการป้องกัน เช่น การจัดการข้อมูลส่วนตัว ประวัติการสั่งซื้อ การจัดการสต็อก และการจัดการระบบ</td></tr><tr><td><strong>การกำหนดสิทธิ์ (Authorization)</strong></td><td>ระบบต้องจำกัดสิทธิ์การเข้าถึงตามบทบาทของผู้ใช้ (Customer, Staff, Manager/Admin)</td></tr><tr><td><strong>ความสามารถในการบำรุงรักษา (Maintainability)</strong></td><td>ระบบควรออกแบบแบบแยกส่วน (React Frontend, Node.js Backend และ MySQL Database) เพื่อให้สามารถพัฒนาและแก้ไขระบบได้ง่ายในอนาคต</td></tr><tr><td><strong>ความสามารถในการขยายระบบ (Scalability)</strong></td><td>ระบบควรรองรับการเพิ่มจำนวนสินค้า ผู้ใช้งาน หมวดหมู่ โปรโมชั่น และคำสั่งซื้อในอนาคตได้โดยไม่ต้องปรับเปลี่ยนสถาปัตยกรรมหลัก</td></tr><tr><td><strong>ความเข้ากันได้ (Compatibility)</strong></td><td>ระบบควรทำงานได้บนเว็บเบราว์เซอร์สมัยใหม่ เช่น Google Chrome, Microsoft Edge และ Firefox</td></tr><tr><td><strong>การเชื่อมต่อระบบภายนอก (External Integration)</strong></td><td>ระบบต้องสามารถเชื่อมต่อกับ Mock Shipping API เพื่อสร้างข้อมูลการจัดส่งและติดตามสถานะสินค้าได้</td></tr><tr><td><strong>การจัดเก็บและกู้คืนข้อมูล (Backup &amp; Recovery)</strong></td><td>ข้อมูลผู้ใช้ คำสั่งซื้อ สินค้า และสต็อกต้องถูกจัดเก็บอย่างถาวรในฐานข้อมูล MySQL เพื่อป้องกันข้อมูลสูญหาย</td></tr></tbody></table><h2 id="หลักการออกแบบสถาปัตยกรรมซอฟต์แวร์-software-architectural-design-principles" tabindex="-1">หลักการออกแบบสถาปัตยกรรมซอฟต์แวร์ (Software Architectural Design Principles) <a class="header-anchor" href="#หลักการออกแบบสถาปัตยกรรมซอฟต์แวร์-software-architectural-design-principles" aria-label="Permalink to &quot;หลักการออกแบบสถาปัตยกรรมซอฟต์แวร์ (Software Architectural Design Principles)&quot;">​</a></h2><ul><li><p>Client-Server Architecture: แยกการทำงานระหว่างส่วนแสดงผล (Frontend) และส่วนประมวลผล (Backend) ออกจากกันอย่างชัดเจน เพื่อให้ระบบสามารถบำรุงรักษาและขยายสเกล (Scalability) ได้ง่ายในอนาคต</p></li><li><p>RESTful API Integration: การสื่อสารข้อมูลระหว่าง Frontend และ Backend จะใช้มาตรฐาน API เป็นตัวกลางในการส่งผ่านข้อมูล</p></li><li><p>Relational Data Structure: ออกแบบโครงสร้างข้อมูลที่เน้นความสัมพันธ์ของเอนทิตี (Entity) ผ่านการจำลองระบบด้วย ER-Diagram เพื่อให้การจัดเก็บข้อมูลสินค้า หมวดหมู่ แพลตฟอร์ม และคำสั่งซื้อมีความเป็นระบบและลดความซ้ำซ้อน</p></li></ul><h2 id="การออกแบบสถาปัตยกรรมระบบ-system-architecture-design" tabindex="-1">การออกแบบสถาปัตยกรรมระบบ (System Architecture Design) <a class="header-anchor" href="#การออกแบบสถาปัตยกรรมระบบ-system-architecture-design" aria-label="Permalink to &quot;การออกแบบสถาปัตยกรรมระบบ (System Architecture Design)&quot;">​</a></h2><p>ระบบถูกแบ่งออกเป็น 4 ส่วนหลัก เพื่อให้การประมวลผลสอดคล้องกับแนวทางการพัฒนาซอฟต์แวร์ ดังนี้:</p><p>ระบบถูกแบ่งออกเป็น 4 ส่วนหลัก เพื่อให้การประมวลผลสอดคล้องกับแนวทางการพัฒนาซอฟต์แวร์ ดังนี้:</p><ol><li>Frontend Architecture (ส่วนติดต่อผู้ใช้งาน)</li></ol><p>• หน้าที่: ทำหน้าที่แสดงผลหน้าจอผู้ใช้งาน (UI/UX) และรับคำสั่งจากผู้ใช้งานทั้ง 3 กลุ่มผ่านเว็บเบราว์เซอร์</p><p>• เทคโนโลยีที่ใช้: พัฒนาด้วย React ร่วมกับ HTML/CSS</p><ol start="2"><li>Backend Architecture (ส่วนประมวลผลหลัก)</li></ol><p>• หน้าที่: ควบคุมตรรกะทางธุรกิจ (Business Logic) เช่น การคำนวณเงินในตะกร้าสินค้า การตรวจสอบสิทธิ์การเข้าใช้งาน (Authentication) และการจัดการคำสั่งซื้อ พร้อมทั้งควบคุมเวอร์ชันของโค้ดผ่าน GitHub</p><p>• เทคโนโลยีที่ใช้: พัฒนา Backend API ด้วย Node.js</p><ol start="3"><li>Database Architecture (ระบบจัดเก็บข้อมูล)</li></ol><p>• หน้าที่: จัดเก็บข้อมูลทุกอย่างในระบบ เช่น ข้อมูลผู้ใช้ สินค้า สต็อก และออเดอร์</p><p>• เทคโนโลยีที่ใช้: เชื่อมต่อฐานข้อมูล MySQL</p><ol start="4"><li>External Services (บริการภายนอก)</li></ol><p>• หน้าที่: บริการภายนอกที่นำมาเชื่อมต่อเพื่อเติมเต็มฟังก์ชันของ E-Commerce ให้กระบวนการซื้อขายครบวงจร</p><p>• เทคโนโลยีที่ใช้: Mock Shipping API สำหรับจำลองการอัปเดตและติดตามสถานะการจัดส่งพัสดุ</p><table tabindex="0"><thead><tr><th>ID</th><th>ระบบ/ฟีเจอร์ (Feature)</th><th>ผู้ใช้งาน (Actor)</th><th>คำอธิบาย (Description)</th></tr></thead><tbody><tr><td><strong>FR-AUTH-01</strong></td><td>สมัครสมาชิก (Register)</td><td>ลูกค้า</td><td>ผู้ใช้งานสามารถกรอกข้อมูลส่วนตัวเพื่อสร้างบัญชีใหม่ในระบบได้</td></tr><tr><td><strong>FR-AUTH-02</strong></td><td>เข้าสู่ระบบ (Login)</td><td>ลูกค้า, พนักงาน, ผู้จัดการ</td><td>ผู้ใช้งานเข้าสู่ระบบด้วย Username และ Password โดยระบบจะตรวจสอบสิทธิ์และนำไปยังหน้าจอตามบทบาท (Role-based Access Control)</td></tr><tr><td><strong>FR-PROD-01</strong></td><td>จัดการข้อมูลสินค้า</td><td>พนักงาน</td><td>พนักงานสามารถเพิ่ม แก้ไข และลบข้อมูลเกม รวมถึงอัปเดตแพลตฟอร์ม หมวดหมู่ ราคา รายละเอียด และจำนวนสินค้าในคลัง</td></tr><tr><td><strong>FR-PROD-02</strong></td><td>ค้นหาและกรองสินค้า</td><td>ลูกค้า</td><td>ลูกค้าสามารถค้นหาสินค้าตามชื่อเกม และกรองสินค้าตามแพลตฟอร์ม หมวดหมู่ และช่วงราคา</td></tr><tr><td><strong>FR-CART-01</strong></td><td>จัดการตะกร้าสินค้า</td><td>ลูกค้า</td><td>ลูกค้าสามารถเพิ่มสินค้า แก้ไขจำนวน หรือลบสินค้าออกจากตะกร้า พร้อมคำนวณยอดรวมและส่วนลดอัตโนมัติ</td></tr><tr><td><strong>FR-CART-02</strong></td><td>รายการโปรด (Favorite)</td><td>ลูกค้า</td><td>ลูกค้าสามารถเพิ่มหรือลบเกมออกจากรายการโปรดเพื่อกลับมาดูภายหลังได้</td></tr><tr><td><strong>FR-ORD-01</strong></td><td>สร้างคำสั่งซื้อ</td><td>ลูกค้า</td><td>ลูกค้าสามารถยืนยันการสั่งซื้อ ระบุที่อยู่จัดส่ง และยืนยันการชำระเงินแบบจำลอง (Mock Payment) เพื่อสร้างคำสั่งซื้อ</td></tr><tr><td><strong>FR-ORD-02</strong></td><td>ตัดสต็อกอัตโนมัติ</td><td>ระบบ (System)</td><td>เมื่อคำสั่งซื้อได้รับการยืนยัน ระบบจะตัดจำนวนสินค้าในคลังโดยอัตโนมัติ</td></tr><tr><td><strong>FR-ORD-03</strong></td><td>ติดตามสถานะคำสั่งซื้อ</td><td>ลูกค้า</td><td>ลูกค้าสามารถตรวจสอบสถานะคำสั่งซื้อและสถานะการจัดส่งได้จากหน้าประวัติการสั่งซื้อ</td></tr><tr><td><strong>FR-STF-01</strong></td><td>จัดการคำสั่งซื้อ</td><td>พนักงาน</td><td>พนักงานสามารถตรวจสอบคำสั่งซื้อ ยืนยันคำสั่งซื้อ และอัปเดตสถานะการจัดส่งสินค้า</td></tr><tr><td><strong>FR-STK-01</strong></td><td>จัดการสต็อกสินค้า</td><td>พนักงาน</td><td>พนักงานสามารถเพิ่ม แก้ไข และอัปเดตจำนวนสินค้าคงเหลือในระบบ</td></tr><tr><td><strong>FR-STK-02</strong></td><td>แจ้งเตือนสินค้าใกล้หมด (Low Stock Alert)</td><td>ระบบ (System)</td><td>ระบบจะตรวจสอบจำนวนสินค้าคงเหลือและแจ้งเตือนเมื่อจำนวนต่ำกว่าค่าขั้นต่ำที่กำหนด</td></tr><tr><td><strong>FR-REV-01</strong></td><td>รีวิวสินค้า</td><td>ลูกค้า</td><td>ลูกค้าสามารถให้คะแนน รีวิว และแนบรูปภาพหลังจากได้รับสินค้าแล้ว</td></tr><tr><td><strong>FR-API-01</strong></td><td>จำลองการจัดส่งสินค้า</td><td>ระบบ (System)</td><td>ระบบเชื่อมต่อกับ Mock Shipping API เพื่อสร้างข้อมูลการจัดส่งและอัปเดตสถานะพัสดุ</td></tr><tr><td><strong>FR-MGR-01</strong></td><td>จัดการโปรโมชั่น</td><td>ผู้จัดการ</td><td>ผู้จัดการสามารถสร้าง แก้ไข และลบโปรโมชั่นหรือส่วนลดสำหรับสินค้าได้</td></tr><tr><td><strong>FR-MGR-02</strong></td><td>จัดการผู้ใช้งาน</td><td>ผู้จัดการ</td><td>ผู้จัดการสามารถดู แก้ไข และจัดการบัญชีผู้ใช้งานในระบบได้</td></tr><tr><td><strong>FR-MGR-03</strong></td><td>รายงานยอดขาย (Dashboard)</td><td>ผู้จัดการ</td><td>ระบบแสดงข้อมูลยอดขาย รายได้ และสถิติคำสั่งซื้อในรูปแบบ Dashboard เพื่อใช้ในการวิเคราะห์ภาพรวมของธุรกิจ</td></tr></tbody></table><h2 id="แผนภาพ" tabindex="-1">แผนภาพ <a class="header-anchor" href="#แผนภาพ" aria-label="Permalink to &quot;แผนภาพ&quot;">​</a></h2><h3 id="use-case-diagram" tabindex="-1">Use Case Diagram <a class="header-anchor" href="#use-case-diagram" aria-label="Permalink to &quot;Use Case Diagram&quot;">​</a></h3><p><img src="'+e+`" alt="Use Case Diagram"></p><h3 id="class-diagram" tabindex="-1">Class Diagram <a class="header-anchor" href="#class-diagram" aria-label="Permalink to &quot;Class Diagram&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">classDiagram</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class User{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String userId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String name</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String email</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String phone</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String password</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String role</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +login(email:String,password:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +logout(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +editProfile(name:String,email:String,phone:String): User</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Customer{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String customerId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +search(keyword:String): Game[]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +viewItem(gameId:String): Game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addToCart(gameId:String,qty:int): Cart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +editCart(cartId:String): Cart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +placeOrder(cartId:String): Order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +checkOrderStatus(orderId:String): String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +viewOrderHistory(): Order[]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addReview(gameId:String,rating:int,comment:String): Review</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addFavorite(gameId:String): Favorite</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +submitInquiry(subject:String,message:String): Inquiry</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Staff{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String staffId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +viewOrders(): Order[]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +verifyOrder(orderId:String): Order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateOrderStatus(orderId:String,status:String): Order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +cancelOrder(orderId:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +editStock(gameId:String,qty:int): Stock</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Admin{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String adminId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +checkDashboard(): Dashboard</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +manageItems(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +manageUsers(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +managePromotion(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +manageShipment(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +manageReview(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +manageWebsite(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Game{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String gameId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String title</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String platform</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String category</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double price</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +viewInformation(): Game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateInformation(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +checkStock(): int</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Cart{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String cartId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double totalPrice</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addItem(gameId:String,qty:int): CartItem</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +removeItem(gameId:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateQuantity(gameId:String,qty:int): CartItem</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +calculateTotal(): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +applyDiscount(code:String): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class CartItem{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String cartItemId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +int quantity</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double price</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +calculateSubtotal(): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Order{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String orderId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +Date orderDate</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String status</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double totalAmount</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +createOrder(): Order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +confirmOrder(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +cancelOrder(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateStatus(status:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +calculateTotal(): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Shipment{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String shipmentId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String trackingNumber</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String shipmentStatus</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateShipmentStatus(status:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Promotion{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String promotionId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String discountCode</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double discountPercent</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +validateCode(code:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +calculateDiscount(total:double): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Review{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String reviewId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +int rating</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String comment</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addReview(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +editReview(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +deleteReview(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Favorite{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String favoriteId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +addFavorite(gameId:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +removeFavorite(gameId:String): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Inquiry{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String inquiryId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String subject</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String message</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +submitInquiry(): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Stock{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +String stockId</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +int quantity</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +updateStock(qty:int): boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class Dashboard{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double dailySales</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double monthlySales</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double quarterlySales</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +double earnings</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    +viewSales(): double</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">User &lt;|-- Customer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">User &lt;|-- Staff</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">User &lt;|-- Admin</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Customer &quot;1&quot; --&gt; &quot;1&quot; Cart : owns</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Cart &quot;1&quot; --&gt; &quot;1..*&quot; CartItem : contains</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">CartItem &quot;*&quot; --&gt; &quot;1&quot; Game : references</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Customer &quot;1&quot; --&gt; &quot;0..*&quot; Order : places</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Order &quot;1&quot; --&gt; &quot;0..1&quot; Shipment : shipped by</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Order &quot;0..1&quot; --&gt; &quot;0..1&quot; Promotion : uses</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Customer &quot;1&quot; --&gt; &quot;0..*&quot; Review : writes</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Review &quot;*&quot; --&gt; &quot;1&quot; Game : reviews</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Customer &quot;1&quot; --&gt; &quot;0..*&quot; Favorite : saves</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Favorite &quot;*&quot; --&gt; &quot;1&quot; Game : references</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Customer &quot;1&quot; --&gt; &quot;0..*&quot; Inquiry : submits</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Game &quot;1&quot; --&gt; &quot;1&quot; Stock : has</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Staff &quot;1&quot; --&gt; &quot;0..*&quot; Order : manages</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Staff &quot;1&quot; --&gt; &quot;0..*&quot; Stock : updates</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;1&quot; Dashboard : views</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;0..*&quot; Game : manages</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;0..*&quot; User : manages</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;0..*&quot; Promotion : manages</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;0..*&quot; Shipment : manages</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Admin &quot;1&quot; --&gt; &quot;0..*&quot; Review : manages</span></span></code></pre></div><h3 id="sequence-diagram" tabindex="-1">Sequence Diagram <a class="header-anchor" href="#sequence-diagram" aria-label="Permalink to &quot;Sequence Diagram&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actor Customer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Frontend as React Frontend</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Backend as Node.js Server</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant DB as MySQL Database</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Shipping as Mock Shipping API</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Browse Products</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Search for a game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Request matching games</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Retrieve game list</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Return available games</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display search results</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: View game details</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Request game information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Retrieve game details and stock</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Return game information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display game details</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Shopping Cart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Add game to cart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Submit selected game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Verify stock availability</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Stock available</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Save cart item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Cart updated</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display updated cart</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Modify cart and apply promotion</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Submit updated cart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Update cart information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Validate promotion code</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Return updated total price</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display updated cart</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Checkout</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Proceed to checkout</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Enter shipping address</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Submit order information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Create new order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Order created</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display order summary</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Mock Payment</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Confirm mock payment</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Confirm order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Update order status to Confirmed</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Deduct product stock</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Check low stock level</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    alt Stock is below minimum threshold</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Backend-&gt;&gt;DB: Generate low stock alert</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;Shipping: Create shipment request</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Shipping--&gt;&gt;Backend: Return tracking number</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Save shipment information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Shipment recorded</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display order confirmation</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Track Order</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Check order status</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Request order status</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Retrieve order and shipment information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Return order status</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display shipment status</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Review</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Submit product review</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Send review information</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Save review</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Review saved</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display review confirmation</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    %% Favorite</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Customer-&gt;&gt;Frontend: Add game to favorites</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Frontend-&gt;&gt;Backend: Submit favorite game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend-&gt;&gt;DB: Save favorite game</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;Backend: Favorite saved</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Backend--&gt;&gt;Frontend: Display favorite confirmation</span></span></code></pre></div><h3 id="wireframe" tabindex="-1">Wireframe <a class="header-anchor" href="#wireframe" aria-label="Permalink to &quot;Wireframe&quot;">​</a></h3><h3 id="prototype" tabindex="-1">Prototype <a class="header-anchor" href="#prototype" aria-label="Permalink to &quot;Prototype&quot;">​</a></h3>`,61)])])}const g=a(l,[["render",p]]);export{c as __pageData,g as default};
