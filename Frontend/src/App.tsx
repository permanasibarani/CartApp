import { useState, useEffect } from "react";
import "./App.css";
import AddProduct from "./components/AddProductForm";
import ProductForm from "./components/ProductForm";
import DataTableDemo from "./components/DataTable";
import Navigation from "./components/Navigation";
import ProductFormDummy from "./components/ProductFormDummy";
import AddProductDummy from "./components/AddProductDummy";
import DataTableDummy from "./components/DataTableDummy";
import { DataTableOrder } from "./components/DataTableOrder";
import { Separator } from "@/components/ui/separator";

function App() {
  const [user, setUser] = useState<{
    username: string;
    token: string;
    role: string;
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]); // Add state to hold products

  useEffect(() => {
    // Fetch products when the user is logged in
    if (user?.token) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/v1/product/all",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": user.token, // Pass token to header
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setProducts(data.data); // Set fetched products
          } else {
            console.log(user.token);
            alert("Gagal mengambil produk");
          }
        } catch (error) {
          alert("Terjadi kesalahan, silakan coba lagi");
        }
      };

      fetchProducts();
    }
  }, [user]);
  const onProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };
  return (
    <>
      <Navigation user={user} setUser={setUser} />
      <div className="grid grid-cols-2 gap-8 flex content-start justify-center mt-10">
        <div>
          {user && user.role === "0" ? (
            <ProductForm token={user.token} setProducts={setProducts} />
          ) : (
            <ProductFormDummy />
          )}
        </div>
        <div>
          {/* Render AddProduct even if user is null, but provide a fallback UI */}
          {user ? (
            <AddProduct
              token={user.token}
              products={products}
              username={user.username}
              onProductAdded={onProductAdded}
            />
          ) : (
            <AddProductDummy />
          )}
        </div>
      </div>
      <div>
        <div className="mb-5 mt-10">
          {/* Render AddProduct even if user is null, but provide a fallback UI */}
          {user ? (
            <DataTableDemo username={user.username} products={products} />
          ) : (
            <DataTableDummy />
          )}
        </div>
      </div>
      <Separator />
      <div>
        <div className="mb-20 mt-5">
          {/* Render AddProduct even if user is null, but provide a fallback UI */}
          {user ? <DataTableOrder username={user.username} /> : null}
        </div>
      </div>
    </>
  );
}

export default App;
