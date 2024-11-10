import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { Button } from "./ui/button";

interface NavigationProps {
  user: { username: string; token: string } | null;
  setUser: (user: { username: string; token: string }) => void;
}

export default function Navigation({ user, setUser }: NavigationProps) {
  const handleLogout = async () => {
    if (!user?.token) return;

    try {
      await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "DELETE",
        headers: {
          "X-API-TOKEN": user.token,
        },
      });
      setUser(null); // Hapus data user setelah logout sukses
    } catch (error) {
      alert("Gagal logout, coba lagi.");
    }
  };

  return (
    <nav className="mt-10 inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {user ? (
            <span className="text-left">Halo, {user.username}</span>
          ) : (
            <span />
          )}
          <nav className="ml-auto flex items-center space-x-4">
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <LoginModal setUser={setUser} />
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
