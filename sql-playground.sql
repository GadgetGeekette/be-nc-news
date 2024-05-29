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

\echo '\n articles with comment count: \n'
SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, count(a.article_id) as comment_count
    FROM articles a
    JOIN comments c
        ON a.article_id = c.article_id
    GROUP BY a.article_id;
