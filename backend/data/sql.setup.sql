--
-- ลบข้อมูลเก่าออกก่อน
--
DROP USER IF EXISTS 'project'@'localhost';
DROP DATABASE IF EXISTS `project`;
CREATE DATABASE IF NOT EXISTS `project`;

--
-- สร้างผู้ใช้งานสำหรับโครงงาน เพื่อความปลอดภัยในการเข้าถึงข้อมูล
-- เนื่องจากบัญชีนี้ไม่สามารถลบตารางใด ๆ ได้แค่เพิ่ม, แก้ไข, และลบข้อมูลเท่านั้น
--
CREATE USER IF NOT EXISTS 'project'@'%' IDENTIFIED BY 'project';
GRANT SELECT, INSERT, UPDATE, DELETE ON project.* TO 'project'@'%';

--
-- นำตั้งค่าไปใช้งาน
-- คำสั่งเฉพาะ MySQL
--
FLUSH PRIVILEGES;

--
-- สร้างข้อมูลบัญชี
--
CREATE TABLE IF NOT EXISTS `project`.`Account` 
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `Name` CHAR(32) NOT NULL DEFAULT "" COMMENT 'ชื่อผู้ใช้',
    `Icon` CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปบัญชี' ,
    `Role` INT NOT NULL DEFAULT 1 COMMENT 'บทบาทบัญชี' , 
    `Created` DATETIME DEFAULT CURRENT_TIMESTAMP 
                COMMENT 'เวลาที่บัญชีถูกสร้าง' ,
    `Modified` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
                COMMENT 'เวลาที่แก้ไข' ,
    
    CONSTRAINT PK_Account PRIMARY KEY (`Id`) ,
    CONSTRAINT UC_Account UNIQUE (`Id`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้';

--
-- ข้อมูลติดต่อ
-- 
CREATE TABLE IF NOT EXISTS `project`.`AccountContact`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `Email` CHAR(32) DEFAULT "" COMMENT 'อีเมล' ,

    CONSTRAINT UC_AccountContact UNIQUE (`Id`) ,
    CONSTRAINT FK_AccountContact FOREIGN KEY (`Id`) REFERENCES Account (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้ (ติดต่อ)';

--
-- ข้อมูลสินค้า
--
CREATE TABLE IF NOT EXISTS `project`.`Product`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสสินค้า' ,
    `Name` CHAR(64) NOT NULL COMMENT 'ชื่อสินค้า' ,
    `Description` VARCHAR(4096) NOT NULL COMMENT 'คำอธิบาย' ,
    `Price` DECIMAL(19, 4) NOT NULL COMMENT 'ราคา' ,
    `PriceCode` CHAR(3) NOT NULL COMMENT 'สกุลเงินราคา' ,

    CONSTRAINT PK_Product PRIMARY KEY (`Id`),
    CONSTRAINT UC_Product UNIQUE (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductPreview`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสรีวิว' ,
    `Inherited` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Mime` CHAR(16) NOT NULL COMMENT 'ประเภทลิงค์' ,
    `Link` CHAR(255) NOT NULL COMMENT 'ลิงค์' ,

    CONSTRAINT PK_ProductPreview PRIMARY KEY (`Id`) ,
    CONSTRAINT UC_ProductPreview UNIQUE (`Id`) ,
    CONSTRAINT FK_ProductPreview_Inherited 
        FOREIGN KEY (`Inherited`) 
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลการแนะนำสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductComment`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น' ,
    `Inherited` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Author` BIGINT NOT NULL COMMENT 'รหัสบัญชี' ,
    `Title` CHAR(64) NOT NULL COMMENT 'หัวเรื่อง' ,
    `Text` VARCHAR(4096) NOT NULL COMMENT 'ข้อความ' ,
    `Rating` INT NOT NULL COMMENT 'คะแนน' ,

    CONSTRAINT PK_ProductPreview PRIMARY KEY (`Id`) ,
    CONSTRAINT UC_ProductPreview UNIQUE (`Id`) ,
    CONSTRAINT FK_ProductComment_Inherited 
        FOREIGN KEY (`Inherited`) 
        REFERENCES Product (`Id`) ,
    CONSTRAINT FK_ProductPreview_Author 
        FOREIGN KEY (`Author`) 
        REFERENCES Account (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลการแสดงความคิดเห็นสินค้า';


--
-- สร้างข้อมูลการเข้าสู่ระบบ (ชื่อ/รหัสผ่าน)
--
CREATE TABLE IF NOT EXISTS `project`.`Auth` 
(
    `Id` CHAR(16) NOT NULL COMMENT 'รหัสประจำตัว' , 
    `Password` CHAR(128) NOT NULL COMMENT 'รหัสผ่าน' , 
    `Link` BIGINT NOT NULL COMMENT 'รหัสบัญชี' , 
    `Totp` CHAR(64) NOT NULL DEFAULT "" COMMENT 'ข้อมูล TOTP' ,
    
    CONSTRAINT PK_Auth PRIMARY KEY (`Id`) , 
    CONSTRAINT FK_Auth_Link 
        FOREIGN KEY (`Link`) 
        REFERENCES Account (`Id`) ,
    CONSTRAINT UC_Auth_Link
        UNIQUE (`Link`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลการเข้าสู่ระบบ';
