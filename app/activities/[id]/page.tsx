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
  recommendation: string
}

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
    const [activity, setActivity] = useState<IActivity | null>(null)
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([])
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
        const response = await axios.post('http://localhost:5001/recommendations', {
          activityId: activityData._id,
          activityType: activityData.activityType,
          caloriesBurned: activityData.caloriesBurned,
          heartRate: activityData.heartRate.toString(),
          systolicBloodPressure: activityData.systolicBloodPressure,
          diastolicBloodPressure: activityData.diastolicBloodPressure,
          duration: activityData.duration,
          bloodOxygenLevel: activityData.bloodOxygenLevel,
          createdBy: activityData.createdBy
        })
        setRecommendations(response.data)
      } catch (error: any) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoadingRecommendations(false)
      }
    }
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {activity && (
        <div>
          <h2>{activity.activityType}</h2>
          <p>Calories Burned: {activity.caloriesBurned}</p>
          <p>Duration: {activity.duration} minutes</p>
          <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  )
}

export default Page