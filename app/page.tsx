"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Heart, Timer, TrendingUp, Plus, Award } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { activitiesAPI } from "@/lib/api"

interface IActivity {
  _id: string
  activityType: string
  caloriesBurned: number
  systolicBloodPressure: number
  diastolicBloodPressure: number
  bloodOxygenLevel: number
  duration: number
  heartRate: number
  date: string
  createdBy: string
}

export default function Dashboard() {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchActivities()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchActivities = async () => {
    try {
      setError("")
      const data = await activitiesAPI.getAll()
      setActivities(data)
    } catch (error: any) {
      console.error("Error fetching activities:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await fetchActivities()
  }

  const getStats = () => {
    const totalCalories = activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0)
    const avgHeartRate =
      activities.length > 0
        ? Math.round(activities.reduce((sum, activity) => sum + activity.heartRate, 0) / activities.length)
        : 0
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)
    const totalActivities = activities.length

    return { totalCalories, avgHeartRate, totalDuration, totalActivities }
  }

  const getChartData = () => {
    // Sort activities by date
    const sortedActivities = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group by date for daily trends
    const dailyData = sortedActivities.reduce((acc, activity) => {
      const date = new Date(activity.date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = {
          date,
          calories: 0,
          duration: 0,
          heartRate: [],
          systolic: [],
          diastolic: [],
          activities: 0,
        }
      }
      acc[date].calories += activity.caloriesBurned
      acc[date].duration += activity.duration
      acc[date].heartRate.push(activity.heartRate)
      acc[date].systolic.push(activity.systolicBloodPressure)
      acc[date].diastolic.push(activity.diastolicBloodPressure)
      acc[date].activities += 1
      return acc
    }, {} as any)

    // Convert to array and calculate averages
    const chartData = Object.values(dailyData).map((day: any) => ({
      date: day.date,
      calories: day.calories,
      duration: day.duration,
      avgHeartRate: Math.round(day.heartRate.reduce((a: number, b: number) => a + b, 0) / day.heartRate.length),
      avgSystolic: Math.round(day.systolic.reduce((a: number, b: number) => a + b, 0) / day.systolic.length),
      avgDiastolic: Math.round(day.diastolic.reduce((a: number, b: number) => a + b, 0) / day.diastolic.length),
      activities: day.activities,
    }))

    return chartData
  }

  const getActivityTypeData = () => {
    const typeCount = activities.reduce(
      (acc, activity) => {
        acc[activity.activityType] = (acc[activity.activityType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff", "#ff0000"]

    return Object.entries(typeCount).map(([type, count], index) => ({
      name: type,
      value: count,
      color: colors[index % colors.length],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-indigo-600">Welcome to FitTracker</CardTitle>
            <CardDescription>Please log in to access your fitness dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login">
              <Button className="w-full">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()
  const chartData = getChartData()
  const activityTypeData = getActivityTypeData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} setUser={setUser} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your comprehensive fitness overview</p>
        </div>

        {error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800">{error}</p>
                <Button onClick={refreshData} className="mt-2" size="sm">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalories}</div>
              <p className="text-xs opacity-80">calories burned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
              <Heart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgHeartRate}</div>
              <p className="text-xs opacity-80">beats per minute</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Timer className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDuration}</div>
              <p className="text-xs opacity-80">minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs opacity-80">activities logged</p>
            </CardContent>
          </Card>
        </div>

        {activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your fitness journey by adding your first activity.</p>
              <Link href="/activities/create">
                <Button>Create Your First Activity</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="health">Health Metrics</TabsTrigger>
              <TabsTrigger value="activities">Activity Types</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Calories Burned</CardTitle>
                    <CardDescription>Track your daily calorie burn progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        calories: {
                          label: "Calories",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="calories"
                            stroke="var(--color-calories)"
                            fill="var(--color-calories)"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Duration</CardTitle>
                    <CardDescription>Daily workout duration in minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        duration: {
                          label: "Duration (min)",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="duration" fill="var(--color-duration)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fitness Trends Over Time</CardTitle>
                  <CardDescription>Monitor your progress with key fitness metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      calories: {
                        label: "Calories",
                        color: "hsl(var(--chart-1))",
                      },
                      duration: {
                        label: "Duration",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="calories" stroke="var(--color-calories)" strokeWidth={2} />
                        <Line type="monotone" dataKey="duration" stroke="var(--color-duration)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Heart Rate Trends</CardTitle>
                    <CardDescription>Average heart rate during activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        avgHeartRate: {
                          label: "Heart Rate (bpm)",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="avgHeartRate"
                            stroke="var(--color-avgHeartRate)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Blood Pressure Trends</CardTitle>
                    <CardDescription>Systolic and diastolic blood pressure over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        avgSystolic: {
                          label: "Systolic",
                          color: "hsl(var(--chart-4))",
                        },
                        avgDiastolic: {
                          label: "Diastolic",
                          color: "hsl(var(--chart-5))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="avgSystolic"
                            stroke="var(--color-avgSystolic)"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="avgDiastolic"
                            stroke="var(--color-avgDiastolic)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Distribution</CardTitle>
                    <CardDescription>Breakdown of your activity types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        activities: {
                          label: "Activities",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={activityTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {activityTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Activity Count</CardTitle>
                    <CardDescription>Number of activities per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        activities: {
                          label: "Activities",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="activities" fill="var(--color-activities)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your fitness tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/activities/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </Link>
              <Link href="/activities">
                <Button variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activities
                </Button>
              </Link>
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {loading ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
