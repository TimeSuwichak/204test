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
CREATE TABLE IF NOT EXISTS `project`.`User` 
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `Name` CHAR(32) NOT NULL DEFAULT "" COMMENT 'ชื่อผู้ใช้',
    `Icon` CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปบัญชี' ,
    `Role` INT NOT NULL DEFAULT 1 COMMENT 'บทบาทบัญชี' , 
    `Created` DATETIME DEFAULT CURRENT_TIMESTAMP 
                COMMENT 'เวลาที่บัญชีถูกสร้าง' ,
    `Modified` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
                COMMENT 'เวลาที่แก้ไข' ,
    
    CONSTRAINT PK_User PRIMARY KEY (`Id`) ,
    CONSTRAINT UC_User UNIQUE (`Id`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้';

--
-- ข้อมูลติดต่อ
--
CREATE TABLE IF NOT EXISTS `project`.`UserContact`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `Email` CHAR(32) DEFAULT "" COMMENT 'อีเมล' ,

    CONSTRAINT PK_UserContact PRIMARY KEY (`Id`),
    CONSTRAINT FK_UserContact FOREIGN KEY (`Id`) REFERENCES User (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้ (ติดต่อ)';

-- CREATE TABLE IF NOT EXISTS `project`.`UserCart`
-- (
--     `CartId` BIGINT NOT NULL COMMENT 'รหัสเอกลักษณ์' ,
--     `UserId` BIGINT NOT NULL COMMENT 'รหัสบัญชี' ,
--     `ProductId` BIGINT NOT NULL COMMENT ''
-- )
-- ENGINE = InnoDB COMMENT = 'ตะกร้าผู้ใช้'

--
-- ข้อมูลสินค้า
--
CREATE TABLE IF NOT EXISTS `project`.`Product`
(
    `Id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสสินค้า' ,
    `Name` CHAR(64) NOT NULL COMMENT 'ชื่อสินค้า' ,
    `Description` VARCHAR(4096) NOT NULL COMMENT 'คำอธิบาย' ,
    `Price` DECIMAL(19, 4) NOT NULL COMMENT 'ราคา' ,
    `PriceCode` INT NOT NULL COMMENT 'สกุลเงินราคา' ,

    CONSTRAINT PK_Product PRIMARY KEY (`Id`),
    CONSTRAINT UC_Product UNIQUE (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductReview`
(
    `ReviewId` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสรีวิว' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Mime` CHAR(16) NOT NULL COMMENT 'ประเภทลิงค์' ,
    `Link` CHAR(255) NOT NULL COMMENT 'ลิงค์' ,

    CONSTRAINT PK_ProductReview PRIMARY KEY (`ReviewId`) ,
    CONSTRAINT UC_ProductReview UNIQUE (`ReviewId`) ,
    CONSTRAINT FK_ProductReview_ProductId 
        FOREIGN KEY (`ProductId`) 
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลการแนะนำสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductComment`
(
    `CommentId` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Author` BIGINT NOT NULL COMMENT 'รหัสบัญชี' ,
    `Title` CHAR(64) NOT NULL COMMENT 'หัวเรื่อง' ,
    `Text` VARCHAR(4096) NOT NULL COMMENT 'ข้อความ' ,
    `Rating` INT NOT NULL COMMENT 'คะแนน' ,

    CONSTRAINT PK_ProductComment PRIMARY KEY (`CommentId`) ,
    CONSTRAINT UC_ProductComment UNIQUE (`CommentId`) ,
    CONSTRAINT FK_ProductComment_ProductId 
        FOREIGN KEY (`ProductId`) 
        REFERENCES Product (`Id`) ,
    CONSTRAINT FK_ProductComment_Author 
        FOREIGN KEY (`Author`) 
        REFERENCES User (`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลการแสดงความคิดเห็นสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductStock`
(
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Quantity` INT NOT NULL COMMENT 'จำนวน' ,

    CONSTRAINT PK_ProductStock PRIMARY KEY (`ProductId`) ,
    CONSTRAINT FK_ProductStock 
        FOREIGN KEY (`ProductId`)
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB COMMENT = 'สต็อกสินค้า';

CREATE TABLE IF NOT EXISTS `project`.`ProductCategory`
(
    `CategoryId` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสเอกลักษณ์' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Value` INT NOT NULL COMMENT 'รหัสหมวดหมู่' ,

    CONSTRAINT PK_ProductCategory PRIMARY KEY (`CategoryId`) ,
    CONSTRAINT FK_ProductCategory
        FOREIGN KEY (`ProductId`)
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB COMMENT = 'หมวดหมู่';

--
-- สร้างข้อมูลการเข้าสู่ระบบ (ชื่อ/รหัสผ่าน)
--
CREATE TABLE IF NOT EXISTS `project`.`Auth` 
(
    `Id` CHAR(16) NOT NULL COMMENT 'รหัสประจำตัว' , 
    `Password` CHAR(128) NOT NULL COMMENT 'รหัสผ่าน' , 
    `Link` BIGINT NOT NULL COMMENT 'รหัสบัญชี' , 
    
    CONSTRAINT PK_Auth PRIMARY KEY (`Id`) , 
    CONSTRAINT FK_Auth_Link 
        FOREIGN KEY (`Link`) 
        REFERENCES User (`Id`) ,
    CONSTRAINT UC_Auth_Link
        UNIQUE (`Link`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลการเข้าสู่ระบบ';

--
-- Order
--
CREATE TABLE IF NOT EXISTS `project`.`ProductOrder`
(
    `OrderId` BIGINT NOT NULL COMMENT 'รหัสคำสั่งซื้อ' ,
    `UserId` BIGINT NOT NULL COMMENT 'ลูกค้าที่สั่งซื้อ' ,
    `Created` DATETIME NOT NULL COMMENT 'วันที่สั่งซื้อ' ,
    `Delivered` DATETIME NOT NULL COMMENT 'วันที่รับสินค้า' , 
    `Status` INT NOT NULL COMMENT 'สถานะคำ' ,

    CONSTRAINT PK_Order PRIMARY KEY (`OrderId`) ,
    CONSTRAINT FK_Order_UserId
        FOREIGN KEY (`UserId`)
        REFERENCES User (`Id`)
)
ENGINE = InnoDB COMMENT = 'รายการคำสั่งซื้อ';

CREATE TABLE IF NOT EXISTS `project`.`ProductOrderItem`
(
    `ItemId` BIGINT NOT NULL COMMENT 'รหัสไอเท็ม' ,
    `OrderId` BIGINT NOT NULL COMMENT 'รหัสคำสั่งซื้อ' ,
    `Product` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Quanity` INT NOT NULL COMMENT 'จำนวน' ,

    CONSTRAINT PK_OrderItem PRIMARY KEY (`ItemId`) ,
    CONSTRAINT FK_OrderItem_OrderId
        FOREIGN KEY (`OrderId`)
        REFERENCES ProductOrder (`OrderId`)
)
ENGINE = InnoDB COMMENT = 'สินค้าในคำสั่งซื้อ';