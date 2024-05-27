CREATE TABLE users_log (
  log_id INT NOT NULL AUTO_INCREMENT,
  user_id VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE forms_log (
  log_id INT NOT NULL AUTO_INCREMENT,
  form_id VARCHAR(10) NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(250) NOT NULL,
  creation_date DATETIME NOT NULL,
  questions JSON NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  FOREIGN KEY (form_id) REFERENCES forms (form_id)
);

CREATE TABLE answers_log (
  log_id INT NOT NULL AUTO_INCREMENT,
  answer_id INT NOT NULL,
  answer_values JSON NOT NULL,
  answer_date DATETIME NOT NULL,
  location GEOMETRY NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
);