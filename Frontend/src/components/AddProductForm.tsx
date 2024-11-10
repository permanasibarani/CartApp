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
import { AutoComplete } from "@/components/ui/autocomplete";
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

interface AddProductProps {
  token: string;
  username: string;
  products: Product[]; // Receive products as prop
}

function AddProduct({ token, username, products }: AddProductProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [promo, setPromo] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const options = products.map((product) => ({
    value: product.productId,
    label: product.name,
    price: product.price,
    stock: product.stock,
    type: product.type,
    productId: product.productId,
  }));

  // Disable button if token is not available
  //   const isButtonDisabled = !token || !selectedProduct;
  // Handle selection of a product from suggestions
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1); // Default quantity
    setTotalPrice(product.price);
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

  // Handle adding product to cart
  const handleAddProduct = async () => {
    if (!selectedProduct || !username || !token) return;

    const body = {
      productId: selectedProduct.productId,
      username: username,
      qty: quantity,
      status: 0, // Default status
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-TOKEN": token, // Pass the token in the header
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Product added to cart", result);
        alert("Produk berhasil ditambahkan ke keranjang");

        // Reset the form fields
        setSelectedProduct(null);
        setQuantity(0);
        setPromo("");
        setTotalPrice(0);
      } else {
        console.error("Failed to add product to cart", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product to cart", error);
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
              <AutoComplete
                options={options}
                onValueChange={(selected) => {
                  handleProductSelect(selected);
                }}
              />
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
        <Button onClick={handleAddProduct}>Add Product</Button>
      </CardFooter>
    </Card>
  );
}

export default AddProduct;
