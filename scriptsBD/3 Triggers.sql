-- Trigger para la tabla users
DELIMITER $$
CREATE TRIGGER users_insert_trigger
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO users_log (user_id, password, action)
    VALUES (NEW.user_id, NEW.password, 'insert');
END$$

CREATE TRIGGER users_update_trigger
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.password != NEW.password THEN
        INSERT INTO users_log (user_id, password,action)
        VALUES (NEW.user_id, NEW.password, 'update_password');
    END IF;
END$$

DELIMITER ;

-- Trigger para la tabla forms
DELIMITER $$
CREATE TRIGGER forms_insert_trigger
AFTER INSERT ON forms
FOR EACH ROW
BEGIN
    INSERT INTO forms_log (form_id, title, description, creation_date, questions, action)
    VALUES (NEW.form_id, NEW.title, NEW.description, NEW.creation_date, NEW.questions, 'insert');
END$$

CREATE TRIGGER forms_update_trigger
AFTER UPDATE ON forms
FOR EACH ROW
BEGIN
    IF OLD.title != NEW.title OR OLD.description != NEW.description THEN
        INSERT INTO forms_log (form_id, title, description, creation_date, questions, action)
        VALUES (NEW.form_id, NEW.title, NEW.description, NEW.creation_date, NEW.questions, 'update');
    END IF;
END$$

DELIMITER ;

-- Trigger para la tabla answers (sin update)
DELIMITER $$
CREATE TRIGGER answers_insert_trigger
AFTER INSERT ON answers
FOR EACH ROW
BEGIN
    INSERT INTO answers_log (answer_id, answer_values, answer_date, location, action)
    VALUES (NEW.answer_id, NEW.answer_values, NEW.answer_date, NEW.location, 'insert');
END$$

DELIMITER ;