import { useState } from "react";
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
  name: string;
  sku: string;
  stock: number;
  type: string;
  price: number;
}

interface ProductFormProps {
  token: string;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>; // Function to update products
}

function ProductForm({ token, setProducts }: ProductFormProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [type, setType] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  // Handle the form submission and post the product
  const handleAddProduct = async () => {
    const newProduct: Product = {
      name,
      sku,
      stock,
      type,
      price,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-TOKEN": token, // Send token with the request
        },
        body: JSON.stringify(newProduct), // Convert product object to JSON
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prevProducts) => [...prevProducts, data.data]); // Add new product to the products state
        alert("Product added successfully!");
        // Reset the form
        setName("");
        setSku("");
        setType("");
        setStock(0);
        setPrice(0);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      alert("An error occurred while adding the product");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tambah Produk (Admin)</CardTitle>
        <CardDescription>Tambahkan produk ke etalase</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sku">Product SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Tipe Produk</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Alat Musik">Alat Musik</SelectItem>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Harga (Rp.)</Label>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleAddProduct}>Add Product</Button>
      </CardFooter>
    </Card>
  );
}

export default ProductForm;
