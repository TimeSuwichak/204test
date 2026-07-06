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
CREATE TABLE IF NOT EXISTS `project`.`account` 
(
    `id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT 'รหัสบัญชี' , 
    `name`      CHAR(32) NOT NULL DEFAULT "" COMMENT 'ชื่อผู้ใช้',
    `icon`      CHAR(255) NOT NULL DEFAULT "" COMMENT 'รูปบัญชี' ,
    `role`      INT NOT NULL DEFAULT 1 COMMENT 'บทบาทบัญชี' , 

    `created`   DATETIME DEFAULT CURRENT_TIMESTAMP 
                COMMENT 'เวลาที่บัญชีถูกสร้าง' ,

    `modified`  DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
                COMMENT 'เวลาที่แก้ไข' ,

    `email`     CHAR(32) DEFAULT "" COMMENT 'อีเมล' ,
    
    CONSTRAINT PK_Account PRIMARY KEY (`id`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้';

--
-- สร้างข้อมูลการเข้าสู่ระบบ (ชื่อ/รหัสผ่าน)
--
CREATE TABLE IF NOT EXISTS `project`.`auth` 
(
    `id`        CHAR(16) NOT NULL   COMMENT 'รหัสประจำตัว' , 
    `password`  CHAR(128) NOT NULL  COMMENT 'รหัสผ่าน' , 
    `link`      BIGINT NOT NULL     COMMENT 'รหัสบัญชี' , 
    
    CONSTRAINT PK_Auth PRIMARY KEY (`id`), 
    CONSTRAINT FK_Auth FOREIGN KEY (`link`) REFERENCES Account (`id`) ,
    CONSTRAINT UC_Auth UNIQUE (`link`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลการเข้าสู่ระบบ';

-- 
-- สร้างข้อมูลการยืนยันสองชั้น
-- 
CREATE TABLE IF NOT EXISTS `project`.`authMfa`
(
    `id`        BIGINT NOT NULL                 COMMENT 'รหัสบัญชี' ,
    `totp`      CHAR(64) NOT NULL DEFAULT ""    COMMENT 'ข้อมูล TOTP' ,
    
    CONSTRAINT PK_AuthMfa PRIMARY KEY (`id`) ,
    CONSTRAINT FK_AuthMfa FOREIGN KEY (`id`) REFERENCES Account (`id`) ,
)
ENGINE = InnoDB COMMENT = 'ข้อมูลการยืนยันตัวตนสองชั้น (MFA)';
