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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Public Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden border-0">
            <CardHeader className="flex flex-col items-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center w-full mb-2">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                  {post.username &&post.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">{post.username}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {moment(post.createdAt).format("MMMM D, YYYY h:mm A")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-gray-700 mb-4 text-base leading-relaxed">{post.content}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-3">
                  <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-medium text-indigo-600">{post.activityType}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-2 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                      <span className="text-gray-600">Calories: <span className="font-medium">{post.caloriesBurned}</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <span className="text-gray-600">Duration: <span className="font-medium">{post.duration} min</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-2 rounded-full bg-pink-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>
                      <span className="text-gray-600">Heart Rate: <span className="font-medium">{post.heartRate} bpm</span></span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-gray-600">Blood Oxygen: <span className="font-medium">{post.bloodOxygenLevel}%</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-4 h-4 mr-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>
                      <span className="text-gray-600">BP: <span className="font-medium">{post.systolicBloodPressure}/{post.diastolicBloodPressure}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Posted {moment(post.createdAt).fromNow()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
