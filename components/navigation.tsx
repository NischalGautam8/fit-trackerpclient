"use client"

import { Button } from "@/components/ui/button"
import { Activity, LogOut, User, Plus, List } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NavigationProps {
  user: any
  setUser: (user: any) => void
}

export default function Navigation({ user, setUser }: NavigationProps) {
  const router = useRouter()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">FitTracker</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/activities">
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4 mr-2" />
                Activities
              </Button>
            </Link>
            <Link href="/posts">
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4 mr-2" />
                Posts
              </Button>
            </Link>
            <Link href="/diet-plan-generator">
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4 mr-2" />
                Diet Plan Generator
              </Button>
            </Link>
            <Link href="/activities/create">
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will log you out of the application.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    authAPI.logout();
                    setUser(null);
                    router.push("/login");
                  }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </nav>
  )
}
