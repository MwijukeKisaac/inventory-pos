import axios from "axios";

export async function getMtnToken() {
  const res = await axios.post(
    `${process.env.MTN_BASE_URL}/collection/token/`,
    {},
    {
      auth: {
        username: process.env.MTN_USER_ID,
        password: process.env.MTN_API_KEY
      },
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY
      }
    }
  );

  return res.data.access_token;
}
import { v4 as uuid } from "uuid";

export async function requestMtnPayment(phone, amount) {
  const token = await getMtnToken();
  const reference = uuid();

  await axios.post(
    `${process.env.MTN_BASE_URL}/collection/v1_0/requesttopay`,
    {
      amount: amount,
      currency: "UGX",
      externalId: reference,
      payer: {
        partyIdType: "MSISDN",
        partyId: phone
      },
      payerMessage: "POS Payment",
      payeeNote: "Order payment"
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": reference,
        "X-Target-Environment": process.env.MTN_ENV,
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY
      }
    }
  );

  return reference;
}
