import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'test',
    password: POSTGRES_PASSWORD || 'otosel45',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query('CREATE TABLE users ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, name varchar(30) NOT NULL, date date NOT NULL DEFAULT (CURRENT_DATE), PRIMARY KEY (id) );');
  await client.query('CREATE TABLE categories ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, name varchar(30) NOT NULL, PRIMARY KEY (id) );');
  await client.query('CREATE TABLE authors ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, name varchar(30) NOT NULL, PRIMARY KEY (id) );');
  await client.query('CREATE TABLE books ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, title varchar(30) NOT NULL, userid int REFERENCES users ON DELETE CASCADE, authorid int REFERENCES authors ON DELETE CASCADE, categoryid int REFERENCES categories ON DELETE CASCADE, PRIMARY KEY (id) );');
  await client.query('CREATE TABLE descriptions ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, description varchar(10000) NOT NULL, bookid int REFERENCES books ON DELETE CASCADE, PRIMARY KEY (id) );');
  await client.query('CREATE TABLE reviews ( id int NOT NULL GENERATED BY DEFAULT AS IDENTITY, message varchar(10000) NOT NULL,  userid int REFERENCES users ON DELETE CASCADE, bookid int REFERENCES books ON DELETE CASCADE, PRIMARY KEY (id) );');

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query('INSERT INTO authors (name) VALUES (\'Лев Толстой\'), (\'Гюстав Флобер\'), (\'Владимир Набоков\'), (\'Джеймс Джойс\'), (\'Уильям Фолкнер\'),  (\'Вирджинии Вулф\'), (\'Чарльз Диккенс\'), (\'Фёдор Достоевский\'), (\'Джейн Остин\'), (\'Антон Чехов\')');
  await client.query('INSERT INTO users (name) VALUES (\'Лев\'), (\'Гюстав\'), (\'Владимир\'), (\'Джеймс\'), (\'Уильям\'),  (\'Вирджинии\'), (\'Чарльз\'), (\'Фёдор\'), (\'Джейн\'), (\'Антон\')');
  await client.query('INSERT INTO categories (name) VALUES (\'учебные\'), (\'научно-популярные\'), (\'научные\'), (\'справочные\'), (\'художественные\'),  (\'исторические\'), (\'философские\'), (\'искусствоведческие\'), (\'универсальные\'), (\'многоотраслевые\')');

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
