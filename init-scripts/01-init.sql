CREATE TABLE stations (
    id serial PRIMARY KEY,
    station_code varchar(20) NOT NULL UNIQUE,
    station_name varchar(100),
    location_lat float,
    location_lon float,
    elevation float,
    country_code char(2)
);

INSERT INTO stations (station_code, station_name, location_lat, location_lon, elevation, country_code)
VALUES
    ('KNYC', 'NEW YORK CENTRAL PARK', 40.7789, -73.9692, 47.5, 'US'),
    ('KSFO', 'SAN FRANCISCO INTL AP', 37.6197, -122.3647, 2.4, 'US');

CREATE TABLE weather_records (
    id serial PRIMARY KEY,
    station_id integer REFERENCES stations(id),
    record_date date NOT NULL,
    temperature float,
    precipitation float,
    wind_speed float,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weather_station_date ON weather_records(station_id, record_date);

CREATE USER readonly_user WITH PASSWORD 'readonly_password';

GRANT CONNECT ON DATABASE noaa_weather TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_user;
