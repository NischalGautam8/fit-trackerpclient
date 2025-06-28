"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Heart,
  Droplets,
  Timer,
  TrendingUp,
  Plus,
  Calendar,
  RefreshCw,
  Trash
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import React from "react"
import Navigation from "@/components/navigation"
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
import { useRouter } from "next/navigation"
import { activitiesAPI } from "@/lib/api"

export interface IActivity {
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

export default function Activities() {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchActivities()
    } else {
      router.push("/login")
    }
  }, [router])

  const handleDeleteActivity = async (id: string) => {
    try {
      await activitiesAPI.delete(id);
      fetchActivities();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchActivities = async () => {
    try {
      setError("")
      const data = await activitiesAPI.getAll()
      setActivities(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchActivities()
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "running":
      case "jogging":
        return "🏃"
      case "cycling":
        return "🚴"
      case "swimming":
        return "🏊"
      case "walking":
        return "🚶"
      case "yoga":
        return "🧘"
      case "weightlifting":
        return "🏋️"
      default:
        return "💪"
    }
  }

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80)
      return { status: "Normal", color: "bg-green-100 text-green-800" }
    if (systolic < 130 && diastolic < 80)
      return { status: "Elevated", color: "bg-yellow-100 text-yellow-800" }
    if (systolic < 140 || diastolic < 90)
      return { status: "High Stage 1", color: "bg-orange-100 text-orange-800" }
    return { status: "High Stage 2", color: "bg-red-100 text-red-800" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation user={user} setUser={setUser} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} setUser={setUser} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Activities</h1>
            <p className="text-gray-600">Track and monitor your fitness progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/activities/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <Button onClick={handleRefresh} className="ml-2" size="sm" variant="outline">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activities.map((activity) => {
              const bpStatus = getBPStatus(activity.systolicBloodPressure, activity.diastolicBloodPressure)

              return (
                <Card
                  key={activity._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/activities/${activity._id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getActivityIcon(activity.activityType)}</div>
                        <div>
                          <CardTitle className="text-lg">{activity.activityType}</CardTitle>
                          <CardDescription className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(activity.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Trash className="hover:bg-gray-100 h-6 w-6 p-1 rounded-full" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Are you sure you want to delete this activity?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteActivity(activity._id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDialogOpen(true)
                            setSelectedActivity(activity)
                          }}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm text-gray-600">Calories</p>
                            <p className="font-semibold">{activity.caloriesBurned} cal</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Timer className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-semibold">{activity.duration} min</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <div>
                            <p className="text-sm text-gray-600">Heart Rate</p>
                            <p className="font-semibold">{activity.heartRate} bpm</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Blood Pressure</p>
                            <p className="font-semibold">
                              {activity.systolicBloodPressure}/{activity.diastolicBloodPressure}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                          <div>
                            <p className="text-sm text-gray-600">Blood Oxygen</p>
                            <p className="font-semibold">{activity.bloodOxygenLevel}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Post Activity</DialogTitle>
              <DialogDescription>Add additional content to your post.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">Content</Label>
                <Textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                if (selectedActivity) {
                  fetch("http://localhost:5001/posts", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...selectedActivity,
                      content: postContent,
                      username: user.username,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.message === "Offensive language detected. Please revise your post.") {
                        setError("Offensive language detected. Please revise your post.");
                      } else {
                        setDialogOpen(false);
                        setPostContent("");
                        setSelectedActivity(null);
                        fetchActivities();
                      }
                    })
                    .catch((error) => {
                      setError("Failed to create post");
                      console.error("Error:", error);
                    });
                }
              }}>
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
