INSERT INTO Account 
    (Id, Role, FirstName, LastName, Phone, Remark, Department, Supervisor)
    VALUES
    (1, 1, "Jeremie", "Bellie", "0123456789", "Excellent Guy", NULL, NULL);

INSERT INTO Auth 
    (Id, Password, Link) 
    VALUES ("ItsJeremie", "$2b$10$Kh/ZtEEUsEd0OMtHHx.jee.3GKmBBXgySpJqOCenYZeAMaupXTekC", 1);

