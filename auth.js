let CLIENT_ID = process.env.CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
  let email;
  await client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((response) => {
      email = response.getPayload().email;
    })
    .catch(() => {
      email = "";
    });
  return email;
}

const auth = async (req, res, next) => {
  const temp = req.headers.authorization;
  if (!temp) return res.send("invalid token");
  const token = temp.slice(7);
  let email = await verify(token);
  if (!email) return res.send("invalid token");
  req.owner = email;
  next();
};

module.exports = auth;
