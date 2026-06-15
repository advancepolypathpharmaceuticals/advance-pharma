const response = await axios.post(
  "https://www.google.com/recaptcha/api/siteverify",
  null,
  {
    params: {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    },
  }
);

console.log("RECAPTCHA RESPONSE:", response.data);


return response.data.success && response.data.score > 0.5;
