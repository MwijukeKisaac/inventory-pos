export async function getAirtelToken() {
  const res = await axios.post(
    "https://openapi.airtel.africa/auth/oauth2/token",
    {
      client_id: process.env.AIRTEL_CLIENT_ID,
      client_secret: process.env.AIRTEL_CLIENT_SECRET,
      grant_type: "client_credentials"
    }
  );
  return res.data.access_token;
}
