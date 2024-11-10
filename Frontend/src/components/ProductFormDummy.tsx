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

function ProductFormDummy() {
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
              <Input id="name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sku">Product SKU</Label>
              <Input id="sku" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Tipe Produk</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Laptop</SelectItem>
                  <SelectItem value="sveltekit">Book</SelectItem>
                  <SelectItem value="astro">Alat Musik</SelectItem>
                  <SelectItem value="nuxt">Stationery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input type="number" id="stock" defaultValue="0" min="0" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Harga (Rp.)</Label>
              <Input type="number" id="price" defaultValue="0" min="0" />{" "}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button disabled={true}>Add Product</Button>
      </CardFooter>
    </Card>
  );
}

export default ProductFormDummy;
