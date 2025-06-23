import api from "./axios"

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/users/login", { email, password })
      const { user, token, userId } = response.data

      // Store authentication data
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/users/register", { name, email, password })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  },
}

// Activities API
export const activitiesAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/activities")
      return response.data
    } catch (error: any) {
      console.error("Error fetching activities:", error)
      throw new Error(error.response?.data?.message || "Failed to fetch activities")
    }
  },

  create: async (activityData: any) => {
    try {
      const userId = localStorage.getItem("userId")
      const payload = {
        ...activityData,
        createdBy: userId,
      }
      const response = await api.post("/activities", payload)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create activity")
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/activities/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch activity")
    }
  },

  update: async (id: string, activityData: any) => {
    try {
      const response = await api.put(`/activities/${id}`, activityData)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update activity")
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/activities/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete activity")
    }
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile")
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch profile")
    }
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await api.put("/users/profile", userData)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update profile")
    }
  },
}
