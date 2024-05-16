DELIMITER //
-- Función para obtener respuestas por form_id
-- Parametros input
--  * form_id_check: ID del formulario para el que se desean obtener las respuestas.
-- Output
--  * JSON con las respuestas del formulario especificado.
CREATE FUNCTION get_answers_by_form_id(form_id_check INT)
RETURNS JSON
BEGIN
    DECLARE result JSON;
    DECLARE done INT DEFAULT FALSE;
    DECLARE answer_id_temp, form_id_temp INT;
    DECLARE answer_values_temp JSON;
    DECLARE answer_date_temp DATETIME;
    DECLARE location_temp GEOMETRY;
    
    -- Crear tabla temporal
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_answers (
        answer_id INT,
        form_id INT,
        answer_values JSON,
        answer_date DATETIME,
        location GEOMETRY
    );
    
    -- Insertar resultados en tabla temporal
    INSERT INTO temp_answers (answer_id, form_id, answer_values, answer_date, location)
    SELECT answer_id, form_id, answer_values, answer_date, location
    FROM answers
    WHERE form_id = form_id_check;
    
    -- Preparar JSON resultante con respuestas como columnas
    SET result = (SELECT JSON_OBJECTAGG(
        answer_id,
        JSON_OBJECT(
            'form_id', form_id,
            'answer_values', answer_values,
            'answer_date', answer_date,
            'location', ST_AsText(location)
        )
    ) FROM temp_answers);
    
    -- Eliminar tabla temporal
    DROP TEMPORARY TABLE IF EXISTS temp_answers;
    
    RETURN result;
END//
DELIMITER ;

DELIMITER //
-- Función para insertar una respuesta
-- Parametros input
--  * p_form_id: ID del formulario al que pertenece la respuesta.
--  * p_answer_values: Valores de la respuesta en formato JSON.
--  * p_lat: Latitud de la ubicación de la respuesta.
--  * p_lng: Longitud de la ubicación de la respuesta.
-- Resultado
--  * respuesta insertada.
CREATE FUNCTION insert_answer(
    p_form_id VARCHAR(10),
    p_answer_values JSON,
    p_lat DECIMAL(10, 8),
    p_lng DECIMAL(11, 8)
)
RETURNS INT
BEGIN
    DECLARE v_location GEOMETRY;
    DECLARE v_answer_id INT;
    
    -- Crear la ubicación usando latitud y longitud
    SET v_location = ST_GeomFromText(CONCAT('POINT(', p_lng, ' ', p_lat, ')'));

    -- Insertar el registro en la tabla 'answers'
    INSERT INTO answers (form_id, answer_values, answer_date, location)
    VALUES (p_form_id, p_answer_values, NOW(), v_location);
    
    -- Obtener el ID del registro insertado
    SET v_answer_id = LAST_INSERT_ID();
    
    -- Devolver el ID del registro insertado
    RETURN v_answer_id;
END//
DELIMITER ;

DELIMITER //
-- Procedimiento para obtener las ubicaciones de las respuestas por form_id
-- Parametros input
--  * p_form_id: ID del formulario para el que se desean obtener las ubicaciones de las respuestas.
-- Output
--  * Ubicaciones de las respuestas en formato de tabla.
CREATE PROCEDURE get_answers_locations(IN p_form_id VARCHAR(10))
BEGIN
    SELECT 
        answer_id, 
        ST_X(location) AS latitude, 
        ST_Y(location) AS longitude
    FROM answers
    WHERE form_id = p_form_id;
END //
DELIMITER ;

DELIMITER //
-- Procedimiento para obtener las respuestas cercanas a una ubicación
-- Parametros input
--  * p_latitude: Latitud de la ubicación central.
--  * p_longitude: Longitud de la ubicación central.
--  * p_distance: Distancia máxima a la que deben estar las respuestas de la ubicación central.
-- Output
--  * Respuestas cercanas a la ubicación central.
CREATE PROCEDURE get_nearby_answers(IN p_latitude FLOAT, IN p_longitude FLOAT, IN p_distance INT)
BEGIN
    SELECT 
        answer_id, 
        ST_X(location) AS latitude, 
        ST_Y(location) AS longitude,
        ST_Distance_Sphere(
            POINT(p_latitude, p_longitude),
            location
        ) AS distance
    FROM answers
    HAVING distance <= p_distance;
END //
DELIMITER ;
