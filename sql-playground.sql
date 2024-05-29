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
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;

\echo '\n article 6 comments: \n'
SELECT c.comment_id, c.votes, c.created_at, c.author, c.body, c.article_id
    FROM comments c
    WHERE article_id = 6;

\echo '\n add new comment: \n'
INSERT INTO comments AS c (body, article_id, author, votes, created_at)
    SELECT 'my test data', a.article_id, a.author, 0, NOW()
        FROM articles a
    WHERE a.article_id = 7;

\echo '\n updated comments: \n'
SELECT * FROM comments;


-- exports.postCommentQuery = (comment, next) => {
--     return db.query(
--         `INSERT INTO comments AS c (body, article_id, author, votes, created_at)
--         SELECT $1, a.article_id, a.author, 0, NOW()
--             FROM articles a
--         WHERE a.article_id = $2;`, [comment.body, comment.id])
--     .catch(next);
-- };
    
    -- RETURNING *;

-- -- *** SINGLE INSERT EXAMPLE ***:
-- INSERT INTO item_tags (item_id, tag_id)
-- SELECT p.item_id, t.id
-- FROM  (SELECT item_id FROM properties WHERE name LIKE 'body') p
--     , (SELECT id FROM tags WHERE name ILIKE '%hoax%') t

-- -- *** BULK INSERT EXAMPLE ***:
-- INSERT INTO item_tags (item_id, tag_id)
-- SELECT p.item_id, t.id
-- FROM  (
--    VALUES
--       ('body',  'hoax')
--     , ('body2', 'fun')
--     , ('body3', 'love')
--   ) AS it(item, tag)
-- JOIN   properties p ON p.name LIKE it.item
-- JOIN   tags t ON t.name ILIKE ('%' || it.tag ||'%');