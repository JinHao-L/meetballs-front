const axios = require('axios');

exports.handler = function ({ headers, body }, context, callback) {
  const endpoint = `https://meetballs-dev.herokuapp.com/zoom/deauthorize`;

  return axios
    .post(endpoint, JSON.parse(body), {
      headers: {
        Authorization: headers.authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      return {
        statusCode: result.status,
        body: JSON.stringify({ message: result.data }),
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
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Netlify function error' }),
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        };
      }
    });
};
