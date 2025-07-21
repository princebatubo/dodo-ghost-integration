import { DodoPayments } from "@dodopayments/node";

export const dodopayments = new DodoPayments({
  apiKey:
    process.env.NODE_ENV === "development"
      ? process.env.DODO_API_KEY_TEST
      : process.env.DODO_API_KEY_LIVE,
  environment:
    process.env.NODE_ENV === "development" ? "test_mode" : "live_mode",
});
