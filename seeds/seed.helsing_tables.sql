BEGIN;

TRUNCATE
  helsing_timeandmaterial,
  helsing_sustainment,
  helsing_reservestudy,
  helsing_employee
  RESTART IDENTITY CASCADE;

INSERT INTO helsing_employee (employee_firstname, employee_lastname, employee_email)
VALUES
('Zach', 'Glocke', 'zglocke@helsing.com'),
('Zack', 'Smith', 'zsmith@helsing.com'),
('Byron', 'Lee', 'blee@helsing.com'),
('Jordan', 'Henn', 'jhenn@helsing.com'),
('Ryan', 'Leptien', 'rleptien@helsing.com');

INSERT INTO helsing_reservestudy (association)
VALUES
('Test Association 1'),
('Test Association 2'),
('Test Association 3'),
('Test Association 4'),
('Test Association 5');

INSERT INTO helsing_sustainment (association)
VALUES
('Test Association 1'),
('Test Association 2'),
('Test Association 3'),
('Test Association 4'),
('Test Association 5');

INSERT INTO helsing_timeandmaterial (association)
VALUES
('Test Association 1'),
('Test Association 2'),
('Test Association 3'),
('Test Association 4'),
('Test Association 5');

COMMIT;
