CREATE USER "db_username"@"%" IDENTIFIED BY "db_password";
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO "db_username"@"%";
GRANT ALL ON foodforests.* TO 'db_username'@'%';
FLUSH PRIVILEGES;
