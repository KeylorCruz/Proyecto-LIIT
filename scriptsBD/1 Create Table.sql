CREATE TABLE users (
  user_id VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE forms (
  form_id VARCHAR(10) NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(250) NOT NULL,
  creation_date DATETIME NOT NULL,
  questions JSON NOT NULL,
  PRIMARY KEY (form_id)
);

CREATE TABLE answers (
  answer_id INT NOT NULL AUTO_INCREMENT,
  form_id VARCHAR(10) NOT NULL,
  answer_values JSON NOT NULL,
  answer_date DATETIME NOT NULL,
  location GEOMETRY NOT NULL,
  PRIMARY KEY (answer_id),
  FOREIGN KEY (form_id) REFERENCES forms (form_id) ON DELETE CASCADE
);
