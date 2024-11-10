import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginModalProps {
  setUser: (user: { username: string; token: string; role: string }) => void;
}

export function LoginModal({
  setUser,
}: {
  setUser: (user: { username: string; token: string; role: string }) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok && result.data) {
        setUser({
          username: result.data.username,
          token: result.data.token,
          role: String(result.data.role),
        });
        setIsOpen(false); // Tutup dialog
      } else {
        alert("Login gagal");
      }
    } catch (error) {
      alert("Terjadi kesalahan, silakan coba lagi");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, name }),
        }
      );

      if (response.ok) {
        alert("Registrasi berhasil, silakan login.");
        setIsRegisterMode(false); // Kembali ke mode login setelah registrasi sukses
      } else {
        alert("Registrasi gagal");
      }
    } catch (e) {
      alert("Terjadi kesalahan, silakan coba lagi");
    }
  };

  const handleSubmit = () => {
    if (isRegisterMode) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegisterMode ? "Register" : "Login"}</DialogTitle>
          {!isRegisterMode && (
            <DialogDescription>
              Login sebagai Admin atau Customer
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isRegisterMode && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="link"
            className="text-sm text-gray-500"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? "Kembali ke Login" : "Belum punya akun? Register"}
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isRegisterMode ? "Register" : "Login"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
