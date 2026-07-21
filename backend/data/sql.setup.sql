-- #
-- # ลบข้อมูลเก่าออกก่อน
-- #
DROP USER IF EXISTS 'project'@'localhost';
DROP DATABASE IF EXISTS `project`;
CREATE DATABASE IF NOT EXISTS `project`;

-- #
-- # สร้างผู้ใช้งานสำหรับโครงงาน เพื่อความปลอดภัยในการเข้าถึงข้อมูล
-- # เนื่องจากบัญชีนี้ไม่สามารถลบตารางใด ๆ ได้แค่เพิ่ม,
-- # แก้ไข, และลบข้อมูลเท่านั้น
-- #
CREATE USER IF NOT EXISTS 'project'@'%' IDENTIFIED BY 'project';
GRANT SELECT, INSERT, UPDATE, DELETE ON project.* TO 'project'@'%';

-- #
-- # นำตั้งค่าไปใช้งาน
-- # คำสั่งเฉพาะ MySQL
-- #
FLUSH PRIVILEGES;

-- #
-- # สร้างข้อมูลบัญชี
-- #
CREATE TABLE IF NOT EXISTS `project`.`Account` 
(
    `Id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `Name`      CHAR(32) NOT NULL DEFAULT "" COMMENT 'ชื่อผู้ใช้',
    `Icon`      CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปบัญชี' ,
    `Role`      INT NOT NULL DEFAULT 1 COMMENT 'บทบาทบัญชี' , 
    `Created`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
                COMMENT 'เวลาที่บัญชีถูกสร้าง' ,
    `Modified`  DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
                COMMENT 'เวลาที่แก้ไข' ,
    `Status`    INT NOT NULL DEFAULT 0 COMMENT 'สถานะบัญชี' ,
    
    CONSTRAINT  PK_Account_Id PRIMARY KEY (`Id`) ,
    CONSTRAINT  UK_Account_Id UNIQUE (`Id`)
) 
ENGINE = InnoDB 
COMMENT = 'ข้อมูลบัญชีผู้ใช้';
-- #
-- # ข้อมูลติดต่อ
-- #
CREATE TABLE IF NOT EXISTS `project`.`AccountContact`
(
    `Id`        BIGINT NOT NULL COMMENT 'รหัสบัญชี' , 
    `Email`     CHAR(32) DEFAULT "" COMMENT 'อีเมล' ,

    CONSTRAINT  PK_AccountContact_Id PRIMARY KEY (`Id`),
    CONSTRAINT  UK_AccountContact_Id UNIQUE (`Id`) ,
    CONSTRAINT  FK_AccountContact_Id FOREIGN KEY (`Id`) 
        REFERENCES Account (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลบัญชีผู้ใช้ (ติดต่อ)';

-- #
-- # ข้อมูลการจัดส่งของผู้ใช้
-- #

--
-- สร้างข้อมูลการเข้าสู่ระบบ (ชื่อ/รหัสผ่าน)
--
CREATE TABLE IF NOT EXISTS `project`.`Auth` 
(
    `Id` CHAR(16) NOT NULL COMMENT 'รหัสประจำตัว' , 
    `Password` CHAR(128) NOT NULL COMMENT 'รหัสผ่าน' , 
    `Link` BIGINT NOT NULL COMMENT 'รหัสบัญชี' , 
    
    CONSTRAINT PK_Auth_Id PRIMARY KEY (`Id`) , 
    CONSTRAINT UK_Auth_Id UNIQUE (`Id`) ,
    CONSTRAINT FK_Auth_Link 
        FOREIGN KEY (`Link`) 
        REFERENCES Account (`Id`) ,
    CONSTRAINT UC_Auth_Link
        UNIQUE (`Link`)
) 
ENGINE = InnoDB 
COMMENT = 'ข้อมูลการเข้าสู่ระบบ';

CREATE TABLE IF NOT EXISTS `project`.`AuthFacebook`
(
    `Id` BIGINT NOT NULL COMMENT 'รหัสประจำตัว' , 
    `Link` BIGINT NOT NULL COMMENT 'รหัสบัญชี' , 
    
    CONSTRAINT PK_AuthFacebook_Id PRIMARY KEY (`Id`) , 
    CONSTRAINT UK_AuthFacebook_Id UNIQUE (`Id`) ,
    CONSTRAINT FK_AuthFacebook_Link 
        FOREIGN KEY (`Link`) 
        REFERENCES Account (`Id`) ,
    CONSTRAINT UC_AuthFacebook_Link
        UNIQUE (`Link`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลการเข้าสู่ระบบด้วย Facebook';

-- #
-- # ข้อมูลสินค้า
-- # 
CREATE TABLE IF NOT EXISTS `project`.`Product`
(
    `Id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสสินค้า' ,
    `Name`      CHAR(64) NOT NULL DEFAULT "" COMMENT 'ชื่อสินค้า' ,
    `Description` VARCHAR(4096) NOT NULL DEFAULT "" COMMENT 'คำอธิบาย' ,
    `Price`     FLOAT NOT NULL DEFAULT 0 COMMENT 'ราคา' ,
    `PriceCode` INT NOT NULL DEFAULT 1 COMMENT 'สกุลเงินราคา' ,
    `Platform`  INT NOT NULL DEFAULT 0 COMMENT 'แพลตฟอร์ม' ,
    `Background` CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปพื้นหลัง' ,
    `Cover`     CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปสินค้า' ,

    CONSTRAINT  PK_Product_Id PRIMARY KEY (`Id`),
    CONSTRAINT  UK_Product_Id UNIQUE (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลสินค้า';
-- #
-- # ข้อมูลการรีวิวสินค้าจากนักรีวิวเกม
-- #
CREATE TABLE IF NOT EXISTS `project`.`ProductReview`
(
    `ReviewId`  BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสรีวิว' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Mime`      CHAR(16) NOT NULL COMMENT 'ประเภทลิงค์' ,
    `Link`      CHAR(255) NOT NULL COMMENT 'ลิงค์' ,

    CONSTRAINT  PK_ProductReview_ReviewId PRIMARY KEY (`ReviewId`) ,
    CONSTRAINT  UK_ProductReview_ReviewId UNIQUE (`ReviewId`) ,
    CONSTRAINT  FK_ProductReview_ProductId 
        FOREIGN KEY (`ProductId`) 
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลการแนะนำสินค้า';
-- #
-- # ข้อมูลการแสดงความคิดเห็นสินค้าจากผู้ซื้อสินค้า
-- #
CREATE TABLE IF NOT EXISTS `project`.`ProductComment`
(
    `CommentId` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Author`    BIGINT NOT NULL COMMENT 'รหัสบัญชี' ,
    `Title`     CHAR(64) NOT NULL COMMENT 'หัวเรื่อง' ,
    `Text`      VARCHAR(4096) NOT NULL COMMENT 'ข้อความ' ,
    `Rating`    INT NOT NULL COMMENT 'คะแนน' ,

    CONSTRAINT  PK_ProductComment_CommentId PRIMARY KEY (`CommentId`) ,
    CONSTRAINT  UK_ProductComment_CommentId UNIQUE (`CommentId`) ,
    CONSTRAINT  FK_ProductComment_ProductId 
        FOREIGN KEY (`ProductId`) 
        REFERENCES Product (`Id`) ,
    CONSTRAINT FK_ProductComment_Author 
        FOREIGN KEY (`Author`) 
        REFERENCES Account (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลการแสดงความคิดเห็นสินค้า';
-- #
-- # ข้อมูลสต็อกสินค้า
-- #
CREATE TABLE IF NOT EXISTS `project`.`ProductStock`
(
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Quantity`  INT NOT NULL DEFAULT 0 COMMENT 'จำนวน' ,

    CONSTRAINT  PK_ProductStock_ProductId PRIMARY KEY (`ProductId`) ,
    CONSTRAINT  UK_ProductStock_ProductId UNIQUE (`ProductId`) ,
    CONSTRAINT  FK_ProductStock 
        FOREIGN KEY (`ProductId`)
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'สต็อกสินค้า';
-- #
-- # ข้อมูลหมวดหมู่สินค้า
-- #
CREATE TABLE IF NOT EXISTS `project`.`ProductCategory`
(
    `CategoryId` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสเอกลักษณ์' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Value` INT NOT NULL COMMENT 'รหัสหมวดหมู่' ,

    CONSTRAINT PK_ProductCategory_CategoryId PRIMARY KEY (`CategoryId`) ,
    CONSTRAINT UK_ProductCategory_CategoryId UNIQUE (`CategoryId`) ,
    CONSTRAINT FK_ProductCategory
        FOREIGN KEY (`ProductId`)
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลหมวดหมู่สินค้า';

-- #
-- # ข้อมูลคำสั่งซื้อสินค้า
-- #
CREATE TABLE IF NOT EXISTS `project`.`OrderList`
(
    `OrderId`   BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสคำสั่งซื้อ' ,
    `AccountId`    BIGINT NOT NULL COMMENT 'ลูกค้าที่สั่งซื้อ' ,
    `Created`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                COMMENT 'วันที่สั่งซื้อ' ,
    `Delivered` DATETIME COMMENT 'วันที่รับสินค้า' , 
    `Status`    INT NOT NULL COMMENT 'สถานะคำ' ,

    CONSTRAINT PK_Order_OrderId PRIMARY KEY (`OrderId`) ,
    CONSTRAINT UK_Order_OrderId UNIQUE (`OrderId`) ,
    CONSTRAINT FK_Order_AccountId
        FOREIGN KEY (`AccountId`)
        REFERENCES Account (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'รายการคำสั่งซื้อ';
-- #
-- # สินค้าที่อยู่ในคำสั่งซื้อสินค้า
-- #
CREATE TABLE IF NOT EXISTS `project`.`OrderItem`
(
    `ItemId`  BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสไอเท็ม' ,
    `OrderId` BIGINT NOT NULL COMMENT 'รหัสคำสั่งซื้อ' ,
    `ProductId` BIGINT NOT NULL COMMENT 'รหัสสินค้า' ,
    `Quantity` INT NOT NULL COMMENT 'จำนวน' ,

    CONSTRAINT PK_OrderItem_ItemId PRIMARY KEY (`ItemId`) ,
    CONSTRAINT UK_OrderItem_ItemId UNIQUE (`ItemId`) ,
    CONSTRAINT FK_OrderItem_OrderId
        FOREIGN KEY (`OrderId`)
        REFERENCES OrderList (`OrderId`) ,
    CONSTRAINT FK_OrderItem_ProductId
        FOREIGN KEY (`ProductId`)
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'สินค้าที่อยู่ในคำสั่งซื้อสินค้า';

-- #
-- # ข้อมูลตะกร้าสินค้าของผู้ใช้
-- #
CREATE TABLE IF NOT EXISTS `project`.`AccountCart`
(
    `ItemId`    BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสเอกลักษณ์' ,
    `AccountId` BIGINT NOT NULL COMMENT 'เจ้าของตะกร้า' ,
    `ProductId` BIGINT NOT NULL COMMENT 'สินค้าที่เลือก' ,
    `Quantity`  INT NOT NULL COMMENT 'จำนวนที่เลือก' ,

    CONSTRAINT  UK_AccountCart UNIQUE (`AccountId`, `ProductId`) ,
    CONSTRAINT  PK_AccountCart_ItemId PRIMARY KEY (`ItemId`),
    CONSTRAINT  FK_AccountCart_AccountId 
        FOREIGN KEY (`AccountId`) 
        REFERENCES Account (`Id`) ,
    CONSTRAINT  FK_AccountCart_ProductId
        FOREIGN KEY (`ProductId`) 
        REFERENCES Product (`Id`)
)
ENGINE = InnoDB 
COMMENT = 'ข้อมูลตะกร้าสินค้า';
