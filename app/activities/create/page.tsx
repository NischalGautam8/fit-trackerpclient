"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { useRouter } from "next/navigation"
import { activitiesAPI } from "@/lib/api"

export default function CreateActivity() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Form state
  const [activityType, setActivityType] = useState("")
  const [caloriesBurned, setCaloriesBurned] = useState("")
  const [duration, setDuration] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [systolicBP, setSystolicBP] = useState("")
  const [diastolicBP, setDiastolicBP] = useState("")
  const [bloodOxygen, setBloodOxygen] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      // Set default date to today
      setDate(new Date().toISOString().split("T")[0])
    } else {
      router.push("/login")
    }
  }, [router])

  const activityTypes = [
    "Running",
    "Walking",
    "Cycling",
    "Swimming",
    "Yoga",
    "Weightlifting",
    "Basketball",
    "Tennis",
    "Soccer",
    "Dancing",
    "Hiking",
    "Pilates",
  ]

  const resetForm = () => {
    setActivityType("")
    setCaloriesBurned("")
    setDuration("")
    setHeartRate("")
    setSystolicBP("")
    setDiastolicBP("")
    setBloodOxygen("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const activityData = {
        activityType,
        caloriesBurned: Number.parseInt(caloriesBurned),
        duration: Number.parseInt(duration),
        heartRate: Number.parseInt(heartRate),
        systolicBloodPressure: Number.parseInt(systolicBP),
        diastolicBloodPressure: Number.parseInt(diastolicBP),
        bloodOxygenLevel: Number.parseInt(bloodOxygen),
        date: new Date(date).toISOString(),
      }

      await activitiesAPI.create(activityData)
      setSuccess("Activity created successfully!")
      resetForm()

      setTimeout(() => {
        router.push("/activities")
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} setUser={setUser} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/activities" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activities
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Activity</h1>
            <p className="text-gray-600">Record your fitness activity and health metrics</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                Activity Details
              </CardTitle>
              <CardDescription>Fill in the details of your fitness activity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Select value={activityType} onValueChange={setActivityType} required disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g., 30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="e.g., 250"
                      value={caloriesBurned}
                      onChange={(e) => setCaloriesBurned(e.target.value)}
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="e.g., 120"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      min="40"
                      max="220"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodOxygen">Blood Oxygen Level (%)</Label>
                    <Input
                      id="bloodOxygen"
                      type="number"
                      placeholder="e.g., 98"
                      value={bloodOxygen}
                      onChange={(e) => setBloodOxygen(e.target.value)}
                      min="70"
                      max="100"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systolicBP">Systolic Blood Pressure</Label>
                    <Input
                      id="systolicBP"
                      type="number"
                      placeholder="e.g., 120"
                      value={systolicBP}
                      onChange={(e) => setSystolicBP(e.target.value)}
                      min="70"
                      max="200"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diastolicBP">Diastolic Blood Pressure</Label>
                    <Input
                      id="diastolicBP"
                      type="number"
                      placeholder="e.g., 80"
                      value={diastolicBP}
                      onChange={(e) => setDiastolicBP(e.target.value)}
                      min="40"
                      max="120"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Creating Activity..." : "Create Activity"}
                  </Button>
                  <Link href="/activities">
                    <Button type="button" variant="outline" disabled={loading}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
