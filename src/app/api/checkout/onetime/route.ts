import { dodopayments } from "@/lib/dodopayments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const productWithQuantity = {
      product_id: productId as string,
      quantity: 1,
    };

    const response = await dodopayments.payments.create({
      billing: {
        city: "New York",
        country: "US",
        state: "NY",
        street: "123 Example Street",
        zipcode: "10001",
      },
      customer: {
        email: "test@example.com",
        name: "John Doe",
      },
      payment_link: true,
      product_cart: [productWithQuantity],
      return_url: process.env.NEXT_PUBLIC_BASE_URL,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
