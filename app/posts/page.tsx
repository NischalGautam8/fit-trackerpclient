"use client";

import { Activity } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  image?: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:5001/posts?page=${page}&limit=6`);
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <div>
      <Navigation user={user} setUser={setUser} />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Feed</h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post._id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <CardHeader className="p-4 flex flex-row items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                  {post.username && post.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-bold text-gray-900">{post.username}</CardTitle>
                </div>
              </CardHeader>
              {post.image && (
                <div className="w-full bg-gray-100">
                  <img src={post.image} alt="Post image" className="w-full h-full object-cover" style={{ aspectRatio: '4/5' }} />
                </div>
              )}
              <CardContent className="p-4">
                <p className="text-gray-800 text-base mb-4">
                  {post.content}
                </p>

                {post.activityType && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="font-medium text-indigo-600">{post.activityType}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <span>Calories: <span className="font-medium">{post.caloriesBurned}</span></span>
                      <span>Duration: <span className="font-medium">{post.duration} min</span></span>
                      <span>Heart Rate: <span className="font-medium">{post.heartRate} bpm</span></span>
                      <span>Blood Oxygen: <span className="font-medium">{post.bloodOxygenLevel}%</span></span>
                      <span className="col-span-2">BP: <span className="font-medium">{post.systolicBloodPressure}/{post.diastolicBloodPressure}</span></span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {moment(post.createdAt).fromNow()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none text-gray-400" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none text-gray-400" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
    </div>
  );
}
