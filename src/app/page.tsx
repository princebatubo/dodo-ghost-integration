import ProductCard from "./components/ProductCard"

export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: 'no-store'
  });
  const products = await response.json();
  
  type Product = {
    product_id: number;
    name: string;
    description: string;
    price: number;
    is_recurring: boolean;
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dodo Payments Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}
