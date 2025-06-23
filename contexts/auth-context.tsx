"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  userId: string | null
  login: (userData: any) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored authentication data on mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")

    if (storedUser && storedToken && storedUserId) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      setUserId(storedUserId)
    }

    setIsLoading(false)
  }, [])

  const login = (userData: any) => {
    setUser(userData.user)
    setToken(userData.token)
    setUserId(userData.userId)

    localStorage.setItem("user", JSON.stringify(userData.user))
    localStorage.setItem("token", userData.token)
    localStorage.setItem("userId", userData.userId)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setUserId(null)

    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, userId, login, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
