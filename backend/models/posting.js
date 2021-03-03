const db = require("../util/db");
const helper = require("../util/helper");

function postingToObj(result)
{
    const postings = result[0].map(
        (posting) => {
            return {
                id: posting.id,
                title: posting.title,
                content: posting.content,
                author_id: posting.author_id,
                parent_id: posting.parent_id,
                timestamp: posting.timestamp
            };
        }
    );
    return postings;
}
module.exports = class Posting{
    

    
  static async filter(query) {
    const condition = helper.queryToSqlCondition("posting", query);

    const sql = `select * from posting where ${condition.where}`;
    const result = await db.get({ sql: sql, values: condition.values });

    return postingToObj(result);
  }
  
  static async getByIds(ids) {
    let values = new Array(0);
    let sql = `select * from posting`;

    if (ids) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      sql = `${sql} where ${condition.where}`;
      values = condition.values;
    }

    const result = await db.get({ sql: sql, values: values });
    return postingToObj(result);
  }
}