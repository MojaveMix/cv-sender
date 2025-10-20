const db = require("../database/db");
const RequestQuery = (query, data = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = { RequestQuery };
