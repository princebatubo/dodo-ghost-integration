import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayments";
import GhostAdminAPI from "@tryghost/admin-api";

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);

export async function POST(request) {
  const headersList = await headers();
  const rawBody = await request.text();
  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  try {
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    const ghostApi = new GhostAdminAPI({
      url: process.env.GHOST_API_URL,
      key: process.env.GHOST_ADMIN_API_KEY,
      version: "v5.0",
    });

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await dodopayments.subscriptions.retrieve(payload.data.subscription_id);
          console.log("-------SUBSCRIPTION DATA START---------");
          console.log(subscription);
          console.log("-------SUBSCRIPTION DATA END---------");
          const { email, name } = subscription.customer || {};
          if (email) {
            await ghostApi.members.add({
              email,
              name: name || "Subscriber",
              status: "paid",
              labels: [{ name: "Dodo Subscriber" }],
            });
            console.log(`Member created: ${email}`);
          }
          break;
        case "subscription.failed":
        case "subscription.cancelled":
        case "subscription.renewed":
        case "subscription.on_hold":
          break;
        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payment.type) {
        case "payment.succeeded":
          const paymentData = await dodopayments.payments.retrieve(payload.data.payment_id);
          console.log("-------PAYMENT DATA START---------");
          console.log(paymentData);
          console.log("-------PAYMENT DATA END---------");
          const { email, name } = paymentData.customer || {};
          if (email) {
            await ghostApi.members.add({
              email,
              name: name || "Subscriber",
              status: "paid",
              labels: [{ name: "Dodo Subscriber" }],
            });
            console.log(`Member created: ${email}`);
          }
          break;
        default:
          break;
      }
    }

    return new Response(JSON.stringify({ message: "Webhook processed successfully" }), { status: 200 });
  } catch (error) {
    console.error("-----Webhook verification failed-----");
    console.error(error);
    return new Response(JSON.stringify({ error: "Webhook verification failed" }), { status: 400 });
  }
    }
