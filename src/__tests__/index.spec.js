import {
  dropTables,
  createItems,
  initConnection,
  createStructure,
} from '../index';

describe('SQL', () => {
  let client;
  beforeAll(async () => {
    client = await initConnection();
    await client.connect();
    await createStructure();
  });
  afterAll(async () => {
    await client.end();
    await dropTables();
  });
  it('users', async () => {
    const names = ['Bohdan', 'Roman', 'Ivan'];

    const promises = names.map((name) =>
      client.query(`INSERT INTO users(name) VALUES ('${name}')`)
    );
    await Promise.all(promises);
    const { rows: users } = await client.query('SELECT * FROM users;');

    users.forEach((user, index) => {
      expect(Object.keys(user)).toStrictEqual(['id', 'name', 'date']);
      expect(user.name).toStrictEqual(names[index]);
    });
  });

  it('categories', async () => {
    const categories = ['Horror', 'Advantages'];

    const categoriesPromises = categories.map((category) =>
      client.query(`INSERT INTO categories(name) VALUES ('${category}');`)
    );
    await Promise.all(categoriesPromises);

    const { rows: categoriesFromDB } = await client.query(
      'SELECT * FROM categories;'
    );

    categoriesFromDB.forEach((category, index) => {
      expect(Object.keys(category)).toStrictEqual(['id', 'name']);
      expect(category.name).toStrictEqual(categories[index]);
    });
  });

  it('authors', async () => {
    const authors = ['Stephen King', 'Bill Skarsgård'];

    const authorsPromises = authors.map((author) =>
      client.query(`INSERT INTO authors(name) VALUES ('${author}');`)
    );
    await Promise.all(authorsPromises);

    const { rows: authorsFromDB } = await client.query(
      'SELECT * FROM authors;'
    );

    authorsFromDB.forEach((author, index) => {
      expect(Object.keys(author)).toStrictEqual(['id', 'name']);
      expect(author.name).toStrictEqual(authors[index]);
    });
  });

  it('books', async () => {
    const books = ['It', 'Doctor sleep'];

    const booksPromises = books.map((book, index) =>
      client.query(
        `INSERT INTO books(title, userid, authorid, categoryid) VALUES ('${book}', ${
          index + 1
        }, ${index + 1}, ${index + 1});`
      )
    );
    await Promise.all(booksPromises);

    const { rows: booksFromDB } = await client.query('SELECT * FROM books;');

    booksFromDB.forEach((book, index) => {
      expect(Object.keys(book)).toStrictEqual([
        'id',
        'title',
        'userid',
        'authorid',
        'categoryid',
      ]);
      expect(book.title).toStrictEqual(books[index]);
    });
  });

  it('book cant create without existing values', async () => {
    try {
      await client.query(
        `INSERT INTO books(title, userid, authorid, categoryid) VALUES ('book', 2, 2, 2);`
      );
    } catch (error) {
      expect(error.message).toStrictEqual(
        'insert or update on table "books" violates foreign key constraint "books_userid_fkey"'
      );
    }
  });

  it('descriptions', async () => {
    const descriptions = ['Very cool book', 'I hate this stupid book'];

    const descriptionsPromises = descriptions.map((description, index) =>
      client.query(
        `INSERT INTO descriptions(description, bookid) VALUES ('${description}', ${
          index + 1
        });`
      )
    );
    await Promise.all(descriptionsPromises);

    const { rows: descriptionsFromDB } = await client.query(
      'SELECT * FROM descriptions;'
    );

    descriptionsFromDB.forEach((description, index) => {
      expect(Object.keys(description)).toStrictEqual([
        'id',
        'description',
        'bookid',
      ]);
      expect(description.description).toStrictEqual(descriptions[index]);
    });
  });

  it('reviews', async () => {
    const reviews = ['Very cool book', 'I hate this stupid book'];

    const reviewsPromises = reviews.map((review, index) =>
      client.query(
        `INSERT INTO reviews(message, userid, bookid) VALUES ('${review}', ${
          index + 1
        }, ${index + 1});`
      )
    );
    await Promise.all(reviewsPromises);

    const { rows: reviewsFromDB } = await client.query(
      'SELECT * FROM reviews;'
    );

    reviewsFromDB.forEach((review, index) => {
      expect(Object.keys(review)).toStrictEqual([
        'id',
        'message',
        'userid',
        'bookid',
      ]);
      expect(review.message).toStrictEqual(reviews[index]);
    });
  });
});
