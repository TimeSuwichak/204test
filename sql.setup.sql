--
-- ลบข้อมูลเก่าออกก่อน
--
DROP USER IF EXISTS 'project'@'localhost';
DROP DATABASE IF EXISTS `project`;
CREATE DATABASE IF NOT EXISTS `project`;

--
-- สร้างผู้ใช้งานสำหรับโครงงาน เพื่อความปลอดภัยในการเข้าถึงข้อมูล
-- เนื่องจากบัญชีนี้ไม่สามารถลบตารางใด ๆ ได้แค่ เพิ่ม, แก้ไข, ลบ *ข้อมูล* เท่านั้น
--
CREATE USER IF NOT EXISTS 'project'@'%' IDENTIFIED BY 'project';
GRANT SELECT, INSERT, UPDATE, DELETE ON project.* TO 'project'@'%';

--
-- นำตั้งค่าไปใช้งาน
-- คำสั่งเฉพาะ MySQL
--
FLUSH PRIVILEGES;


--
-- สร้างแผนก
--
CREATE TABLE IF NOT EXISTS `project`.`Department`
(
    `Id`            BIGINT NOT NULL AUTO_INCREMENT     COMMENT 'รหัสแผนก' ,
    `Icon`          CHAR(255) NOT NULL DEFAULT ""      COMMENT 'รูปแผนก' ,
    `Background`    CHAR(255) NOT NULL DEFAULT ""      COMMENT 'รูปพื้นหลัง' ,
    `Name`          CHAR(64) NOT NULL                  COMMENT 'ชื่อแผนก' ,
    `Description`   VARCHAR(4096) NOT NULL DEFAULT ""  COMMENT 'คำอธิบายแผนก' ,
    `Created`       DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'เวลาที่สร้างแผนก' ,
    `Modified`      DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'เวลาที่แก้ไข' ,

    CONSTRAINT PK_Department PRIMARY KEY (`Id`) ,
    CONSTRAINT UC_Department UNIQUE (`Name`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลแผนก';

--
-- สร้างข้อมูลบัญชี
--
CREATE TABLE IF NOT EXISTS `project`.`Account` 
(
    `Id`            BIGINT NOT NULL AUTO_INCREMENT                      COMMENT 'รหัสบัญชี' , 
    `Icon`          CHAR(255) NOT NULL DEFAULT ""                       COMMENT 'รูปบัญชี' ,
    `Role`          INT NOT NULL DEFAULT 1                              COMMENT 'บทบาทบัญชี' , 
    `FirstName`     CHAR(32) NOT NULL DEFAULT ""                        COMMENT 'ชื่อจริง' ,
    `LastName`      CHAR(32) NOT NULL DEFAULT ""                        COMMENT 'นามสกุล' ,
    `Phone`         CHAR(32) NOT NULL DEFAULT ""                        COMMENT 'เบอร์โทรศัพท์' ,
    `Remark`        VARCHAR(4096) NOT NULL DEFAULT ""                   COMMENT 'โน็ตการปฏิบัติงาน' ,
    `DepartmentId`  BIGINT DEFAULT NULL                                 COMMENT 'รหัสแผนก' ,
    `Supervisor`    BIGINT DEFAULT NULL                                 COMMENT 'รหัสบัญชีหัวหน้า' ,
    `Position`      CHAR(32) DEFAULT ""                                 COMMENT 'ตำแหน่งงาน' ,
    `Created`       DATETIME DEFAULT CURRENT_TIMESTAMP                  COMMENT 'เวลาที่บัญชีถูกสร้าง' ,
    `Modified`      DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP   COMMENT 'เวลาที่แก้ไข' ,
    `Email`         CHAR(32) DEFAULT ""                                 COMMENT 'อีเมล' ,
    
    CONSTRAINT PK_Account           PRIMARY KEY (`Id`),
    CONSTRAINT FK_Account_Department FOREIGN KEY (`DepartmentId`)    REFERENCES Department (`Id`),
    CONSTRAINT FK_Account_Supervisor FOREIGN KEY (`Supervisor`)      REFERENCES Account (`Id`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลบัญชีผู้ใช้';

--
-- สร้างข้อมูลการเข้าสู่ระบบ (ชื่อ/รหัสผ่าน)
--
CREATE TABLE IF NOT EXISTS `project`.`Auth` 
(
    `Id`        CHAR(16) NOT NULL   COMMENT 'รหัสประจำตัว' , 
    `Password`  CHAR(128) NOT NULL  COMMENT 'รหัสผ่าน' , 
    `Link`      BIGINT NOT NULL     COMMENT 'รหัสบัญชี' , 
    
    CONSTRAINT PK_Auth PRIMARY KEY (`Id`), 
    CONSTRAINT FK_Auth FOREIGN KEY (`Link`) REFERENCES Account (`Id`) ,
    CONSTRAINT UC_Auth UNIQUE (`Link`)
) 
ENGINE = InnoDB COMMENT = 'ข้อมูลการเข้าสู่ระบบ';

-- 
-- สร้างข้อมูลการยืนยันสองชั้น
-- 
    -- CREATE TABLE IF NOT EXISTS `project`.`AuthMfa`
    -- (
    --     `Id`        BIGINT NOT NULL                 COMMENT 'รหัสบัญชี' ,
    --     `Totp`      CHAR(64) NOT NULL DEFAULT ""    COMMENT 'ข้อมูล TOTP' ,
    --     
    --     CONSTRAINT PK_AuthMfa PRIMARY KEY (`Id`) ,
    --     CONSTRAINT FK_AuthMfa FOREIGN KEY (`Id`) REFERENCES Account (`Id`) ,
    -- )
    -- ENGINE = InnoDB COMMENT = 'ข้อมูลการยืนยันตัวตนสองชั้น (MFA)';

--
-- สร้างใบงาน
--
CREATE TABLE IF NOT EXISTS `project`.`Job`
(
    `Id`            BIGINT NOT NULL AUTO_INCREMENT      COMMENT 'รหัสใบงาน' ,
    `Title`         CHAR(64) NOT NULL                   COMMENT 'ชื่องาน' ,
    `Description`   VARCHAR(4096) NOT NULL DEFAULT ""   COMMENT 'คำอธิบาย' ,
    `DepartmentId`  BIGINT NOT NULL                     COMMENT 'แผนก' ,
    `Status`        INT NOT NULL DEFAULT 1              COMMENT 'สถานะ' ,
    `Priority`      INT NOT NULL DEFAULT 1              COMMENT 'ลำดับความสำคัญ' ,
    `Modified`      DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'เวลาที่แก้ไข' ,
    `Created`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'เวลาที่สร้าง' ,
    `CreatedBy`     BIGINT NOT NULL                     COMMENT 'ผู้สร้างใบงาน' ,
    `Approved`      DATETIME DEFAULT NULL               COMMENT 'เวลาที่อนุมัติงาน' ,
    `ApprovedBy`    BIGINT DEFAULT NULL                 COMMENT 'ผู้ที่อนุมัติงาน' ,
    `Due`           DATETIME DEFAULT NULL               COMMENT 'เวลากำหนดส่ง' ,

    CONSTRAINT PK_Job               PRIMARY KEY (`Id`),
    CONSTRAINT FK_Job_Department    FOREIGN KEY (`DepartmentId`)    REFERENCES Department(`Id`) ,
    CONSTRAINT FK_Job_CreatedBy     FOREIGN KEY (`CreatedBy`)       REFERENCES Account(`Id`),
    CONSTRAINT FK_Job_ApprovedBy    FOREIGN KEY (`ApprovedBy`)      REFERENCES Account(`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลใบงาน';

--
-- สร้างการมอบงาน
--
CREATE TABLE IF NOT EXISTS `project`.`JobAssignment`
(
    `Id`            BIGINT NOT NULL AUTO_INCREMENT      COMMENT 'รหัสมอบมาย' ,
    `Job`           BIGINT NOT NULL                     COMMENT 'รหัสใบงาน' ,
    `Account`       BIGINT NOT NULL                     COMMENT 'รหัสบัญชี' ,
    `Assigned`      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'เวลาที่มอบหมาย' ,
    `AssignedBy`    BIGINT NOT NULL                     COMMENT 'ผู้ที่สร้างการมอบหมาย' ,
    `Modified`      DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'เวลาที่แก้ไข' ,
    `Status`        INT NOT NULL DEFAULT 1              COMMENT 'สถานะ' ,

    CONSTRAINT PK_JobAssignment             PRIMARY KEY (`Id`) ,
    CONSTRAINT FK_JobAssignment_Job         FOREIGN KEY (`Job`)         REFERENCES Job(`Id`) ON DELETE CASCADE,
    CONSTRAINT FK_JobAssignment_Account     FOREIGN KEY (`Account`)     REFERENCES Account(`Id`) ON DELETE CASCADE,
    CONSTRAINT FK_JobAssignment_AssignedBy  FOREIGN KEY (`AssignedBy`)  REFERENCES Account(`Id`)
)
ENGINE = InnoDB COMMENT 'ข้อมูลการมอบหมายใบงาน';

--
-- สร้างรายงาน
--
CREATE TABLE IF NOT EXISTS `project`.`JobReport`
(
    `Id`            BIGINT NOT NULL AUTO_INCREMENT      COMMENT 'รหัสรายงาน' ,
    `Job`           BIGINT NOT NULL                     COMMENT 'รหัสใบงาน' ,
    `Created`       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'เวลาที่สร้าง' ,
    `CreatedBy`     BIGINT NOT NULL                     COMMENT 'ผู้ที่สร้างรายงาน',
    `Modified`      DATETIME DEFAULT NULL               COMMENT 'เวลาที่แก้ไข' ,
    `Message`       VARCHAR(4096) NOT NULL DEFAULT ""   COMMENT 'ข้อความ' ,
    `Image`         VARCHAR(512) NOT NULL DEFAULT ""    COMMENT 'ข้อมูลอัพโหลด' ,

    CONSTRAINT PK_JobReport             PRIMARY KEY (`Id`) ,
    CONSTRAINT FK_JobReport_Job         FOREIGN KEY (`Job`)         REFERENCES Job(`Id`) ON DELETE CASCADE,
    CONSTRAINT FK_JobReport_CreatedBy   FOREIGN KEY (`CreatedBy`)   REFERENCES Account(`Id`)
)
ENGINE = InnoDB COMMENT = 'ข้อมูลรายงาน (สำหรับใบงาน)';