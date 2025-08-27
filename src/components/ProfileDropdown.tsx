// src/components/ProfileDropdown.tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem
} from "./ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import { selectAuth, logout } from "@/features/auth/authSlice"
import { User, LogOut } from "lucide-react"
import { Button } from "./ui/Button"
import { AppDispatch } from "@/store"

export const ProfileDropdown = () => {
  const { user } = useSelector(selectAuth)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = () => {
     dispatch(logout()) 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  size="sm" className="gap-2">
          <User className="w-4 h-4" />
          {user?.username || "Profile"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-sm">
          {user?.username || "Anonymous"}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-sm">
          {user?.role || "Anonymous"}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {user?.email || "No email"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
