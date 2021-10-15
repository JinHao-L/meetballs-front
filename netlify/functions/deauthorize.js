const axios = require('axios');

exports.handler = function ({ headers, body }, context, callback) {
  const endpoint = `${process.env.REACT_APP_API_URL}/zoom/deauthorize`;

  return axios
    .post(endpoint, { body, headers })
    .then(({ data, status }) => {
      return {
        statusCode: status,
        body: JSON.stringify({ message: data }),
      };
    })
    .catch((error) => {
      if (error.response) {
        return {
          statusCode: error.response.status,
          body: JSON.stringify({ message: error.response.data }),
        };
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
};
