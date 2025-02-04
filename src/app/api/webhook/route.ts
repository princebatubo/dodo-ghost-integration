import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayments";


const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);


export async function POST(request: Request) {
  const headersList =  await headers();

  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.data.status) {
        case "active":
          const subscription = await dodopayments.subscriptions.retrieve(payload.data.subscription_id);
          console.log(subscription)
          break;
        case "failed":
          break;
        case "cancelled":
          break;
        case "renewed":
          break;
        case "on_hold":
          break
        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
        switch (payload.data.status) {
            case "succeeded":
                break;
            default:
                break;
        }
    }
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(" ----- webhoook verification failed -----")
    console.log(error)
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  }
}