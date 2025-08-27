import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { selectCart } from "../features/cart/cartSlice";
import { selectAuth } from "../features/auth/authSlice";
import { Button } from "./ui/Button";
import SignInDialog from "./SignInDialog";
import { ProfileDropdown } from "./ProfileDropdown";
import NotificationPopover from "./NotificationPopover";

export default function Navbar() {
  const items = useSelector(selectCart);
  const auth = useSelector(selectAuth);
  const count = items.reduce((s, i) => s + i.qty, 0);
const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 bg-[#ed3b5f] text-white shadow-md px-6">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          Online <span className="opacity-80">Shop</span>
        </Link>

        <nav className="ml-auto hidden sm:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 py-1 rounded hover:bg-white/20 ${
                isActive ? "bg-white/20" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-2 py-1 rounded hover:bg-white/20 ${
                isActive ? "bg-white/20" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) =>
              `px-2 py-1 rounded hover:bg-white/20 ${
                isActive ? "bg-white/20" : ""
              }`
            }
          >
            Checkout
          </NavLink>
        </nav>

        <div className="ml-auto sm:ml-4 flex items-center gap-2">
          {auth.user && <NotificationPopover />}
          <Button
            variant="ghost"
            aria-label="Open cart"
            className="relative text-white hover:bg-white/20"
            onClick={() => navigate("/cart")}
          >
            🛒
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white rounded-full w-5 h-5 grid place-items-center">
                {count}
              </span>
            )}
          </Button>
          {auth.user ? (
            <ProfileDropdown />
          ) : (
            <SignInDialog />
          )}
        </div>
      </div>
    </header>
  );
}
