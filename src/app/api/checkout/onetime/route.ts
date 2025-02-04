
import { dodopayments } from "@/lib/dodopayments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const productWithQuantity = {product_id: productId as string, quantity: 1}

    const response = await dodopayments.payments.create({
        billing: {
            city: "Sydney",
            country: "AU",
            state: "New South Wales",
            street: "1, Random address",
            zipcode: "2000",
          },
          customer: {
            email: "test@example.com",
            name: `Customer Name`,
          },
          payment_link: true,
          product_cart: [productWithQuantity],
          return_url: process.env.NEXT_PUBLIC_BASE_URL,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
