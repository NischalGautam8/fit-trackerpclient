"use client";
import React, { useEffect } from 'react'
import { useState } from 'react';
import { IActivity } from "@/app/activities/page";
import { activitiesAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, Heart, Droplets, Timer, TrendingUp, Calendar, Lightbulb, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

interface IRecommendation {
  ActivityId: string
  activityType: string
  recommendation: string
  date: string
  createdBy: string
  _id: string
  __v: number
}

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
    const [activity, setActivity] = useState<IActivity | null>(null)
    const [recommendations, setRecommendations] = useState<IRecommendation | null>(null)
    const [recommendationsError, setRecommendationsError] = useState("")
    const [error,setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  console.log("Activity ID:", id);
  useEffect(()=>{
    fetchActivity(id);
  },[id])
   const fetchActivity = async (id:string) => {
      try {
        setError("")
        const data = await activitiesAPI.getById(id)
        console.log("Fetched Activity:", data);
        setActivity(data);
        // Fetch recommendations after getting activity data
        if (data) {
          fetchRecommendations(data);
        }
      } catch (error: any) {
        console.error("Error fetching activities:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecommendations = async (activityData: IActivity) => {
      try {
        setLoadingRecommendations(true)
        setRecommendationsError("")
        const response = await axios.post('http://localhost:5001/recommendations', {
          activityId: activityData._id,
          activityType: activityData.activityType,
          caloriesBurned: activityData.caloriesBurned,
          heartRate: activityData.heartRate.toString(),
          systolicBloodPressure: activityData.systolicBloodPressure,
          diastolicBloodPressure: activityData.diastolicBloodPressure,
          duration: activityData.duration,
          bloodOxygenLevel: activityData.bloodOxygenLevel,
          createdBy: activityData.createdBy,})
          console.log(response)
        setRecommendations(response.data)
      } catch (error: any) {
        console.error("Error fetching recommendations:", error)
        setRecommendationsError(error.response?.data?.message || "Failed to fetch recommendations")
      } finally {
        setLoadingRecommendations(false)
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/activities">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Activities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity Details
          </h1>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}

        {activity && (
          <div className="space-y-6">
            {/* Main Activity Card */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">
                        {activity.activityType}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Duration */}
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <Timer className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">{activity.duration}</p>
                    <p className="text-sm text-purple-600">Minutes</p>
                  </div>
                  
                  {/* Calories */}
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-700">{activity.caloriesBurned}</p>
                    <p className="text-sm text-orange-600">Calories</p>
                  </div>
                  
                  {/* Heart Rate */}
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-700">{activity.heartRate}</p>
                    <p className="text-sm text-red-600">BPM</p>
                  </div>
                  
                  {/* Blood Oxygen */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{activity.bloodOxygenLevel}%</p>
                    <p className="text-sm text-blue-600">Blood O₂</p>
                  </div>
                </div>
                
                {/* Blood Pressure */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-gray-600" />
                    Blood Pressure
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{activity.systolicBloodPressure}</p>
                      <p className="text-xs text-gray-600">Systolic</p>
                    </div>
                    <div className="text-gray-400">/</div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{activity.diastolicBloodPressure}</p>
                      <p className="text-xs text-gray-600">Diastolic</p>
                    </div>
                    <div className="text-gray-600">mmHg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Section */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                 Get Recommendations from AI based on your activity data.
                </CardDescription>              </CardHeader>
              <CardContent>
                {recommendationsError && (
                  <Alert className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800">
                    <AlertDescription>{recommendationsError}</AlertDescription>
                  </Alert>
                )}
                {loadingRecommendations ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    <span className="ml-2 text-gray-600">Generating recommendations...</span>
                  </div>                ) : recommendations ? (
                  <div className="space-y-3">
                    <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {recommendations.activityType}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Generated {new Date(recommendations.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          AI Generated
                        </Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                          {recommendations.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>) : (
                  <div className="text-center py-8 text-gray-600">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="mb-4">No recommendations available at the moment.</p>
                    {recommendationsError && (
                      <Button 
                        variant="outline" 
                        onClick={() => activity && fetchRecommendations(activity)}
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page