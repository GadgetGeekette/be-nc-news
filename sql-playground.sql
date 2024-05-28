-- \c nc_news

-- \echo '\n *** DEV DB *** \n'

-- SELECT * FROM articles;
-- SELECT * FROM comments;
-- SELECT * FROM topics;
-- SELECT * FROM users;

\c nc_news_test

\echo '\n *** TEST DB *** \n'

\echo '\n articles: \n'
SELECT * FROM articles;
\echo '\n comments: \n'
SELECT * FROM comments;
\echo '\n topics: \n'
SELECT * FROM topics;
\echo '\n users: \n'
SELECT * FROM users;