"use client";

import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IPost {
  _id: string;
  content: string;
  username: string;
  activityType: string;
  caloriesBurned: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  bloodOxygenLevel: number;
  duration: number;
  heartRate: number;
  date: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError("");
        const response = await fetch("http://localhost:5001/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>  
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4"> Public Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="flex flex-col items-start p-4">
              <CardTitle className="text-lg font-semibold">{post.username}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {moment(post.createdAt).format("MMMM D, YYYY h:mm A")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-gray-700 mb-4">{post.content}</CardDescription>
              <div className="text-sm text-gray-500">
                Activity Type: {post.activityType}
              </div>
              <div className="text-sm text-gray-500">
                Calories Burned: {post.caloriesBurned}
              </div>
              <div className="text-sm text-gray-500">
               Blood Oxygen: {post.bloodOxygenLevel}
              </div>
              <div className="text-sm text-gray-500">
                Diastolic Burned: {post.diastolicBloodPressure}
              </div>
              <div className="text-sm text-gray-500">
                Systolic BloodPressure: {post.systolicBloodPressure}
              </div>
              <div className="text-sm text-gray-500">
                HeartRate: {post.heartRate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
