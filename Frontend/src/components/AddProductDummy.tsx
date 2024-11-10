import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  productId: number;
  name: string;
  type: string;
  stock: number;
  price: number;
}

function AddProductDummy() {
  const [token, setToken] = useState<string | null>(null); // Replace with your token logic
  const [products, setProducts] = useState<Product[]>([]); // Hold products in state
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [promo, setPromo] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Disable button if token is not available

  // Filter products based on name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    setName(inputName);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(inputName.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Handle selection of a product from suggestions
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name); // Set the input name to selected product name
    setQuantity(1); // Default quantity
    setTotalPrice(product.price); // Calculate total price based on selected product's price
    setFilteredProducts([]); // Clear suggestions after selecting
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Math.min(
      Number(e.target.value),
      selectedProduct ? selectedProduct.stock : 0
    );
    setQuantity(qty);

    if (selectedProduct) {
      setTotalPrice(qty * selectedProduct.price); // Recalculate total price based on quantity
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tambahkan Keranjang</CardTitle>
        <CardDescription>Tambahkan produk ke keranjang</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="productName2">Name</Label>
              <Input
                id="productName2"
                value={name}
                onChange={handleNameChange}
              />
              {filteredProducts.length > 0 && (
                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="productType2">Tipe Produk</Label>
              <Select value={selectedProduct?.type || ""} disabled>
                <SelectTrigger id="productType2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {selectedProduct && (
                    <SelectItem value={selectedProduct.type}>
                      {selectedProduct.type}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="quantity">Kuantitas</Label>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={selectedProduct?.stock || 0}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="promo">Promo Code (Optional)</Label>
              <Input
                id="promo"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Total Harga: {totalPrice} IDR
        </h3>
        <Button disabled={true}>Add Product</Button>
      </CardFooter>
    </Card>
  );
}

export default AddProductDummy;
