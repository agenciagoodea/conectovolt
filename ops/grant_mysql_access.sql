SELECT Host, User FROM mysql.user WHERE User='conectovolt';
GRANT ALL PRIVILEGES ON conectovolt.* TO 'conectovolt'@'%' IDENTIFIED BY 'CvDb8fL2zQ6mR9xT4N7pK3sW5';
FLUSH PRIVILEGES;
