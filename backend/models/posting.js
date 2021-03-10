const db = require("../util/db");
const helper = require("../util/helper");

function postingToObj(result)
{
    const postings = result[0].map(
        (posting) => {
            return {
                id: posting.id,
                userid: posting.userId,
                firstname: posting.firstname,
                lastname: posting.lastname,
                avatar: posting.avatar,
                title: posting.title,
                content: posting.content,
                author_id: posting.author_id,
                parent_id: posting.parent_id,
                timestamp: posting.timestamp,
                upvote: posting.upvote,
                downvote: posting.downvote
            };
        }
    );
    return postings;
}


module.exports = class Posting{
    

    
  static async filter(query) {
    const condition = helper.queryToSqlCondition("posting", query);

    const sql = `select posting.id, author_id, firstname, lastname, avatar, title, content, timestamp, 
    (Select Count(*) from vote where isupvote = 1 AND vote.posting_id = posting.id) upvote,
    (Select Count(*) from vote where isupvote = 0 AND vote.posting_id = posting.id) downvote
   from posting left join user on posting.author_id = user.id where ${condition.where}`;
    const result = await db.get({ sql: sql, values: condition.values });

    return postingToObj(result);
  }

  static async getByIds(ids) {
    let values = new Array(0);
    let sql = `select posting.id, author_id, firstname, lastname, avatar, title, content, timestamp, 
    (Select Count(*) from vote where isupvote = 1 AND vote.posting_id = posting.id) upvote,
    (Select Count(*) from vote where isupvote = 0 AND vote.posting_id = posting.id) downvote
   from posting left join user on posting.author_id = user.id`;

    if (ids) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      sql = `${sql} where ${condition.where}`;
      values = condition.values;
    }

    const result = await db.get({ sql: sql, values: values });



    return postingToObj(result);
  }
}