"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, HeartPulse, Utensils, Users } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import LandingNavigation from "@/components/landing-navigation";
import { useState, useEffect } from "react";
import Dashboard from "@/components/dashboard";

function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <LandingNavigation />
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-center py-40">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 text-white">Powerful Features for Your Fitness Success</h1>
          <p className="text-xl mb-8 text-white/80">Everything you need to achieve your fitness goals in one comprehensive platform</p>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center">
              <CardHeader>
                <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-4 w-max mb-4">
                  <Dumbbell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Activity Logging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Track your workouts, runs, and daily activities with precision. Log duration, intensity, and calories burned.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center">
              <CardHeader>
                <div className="mx-auto bg-pink-100 dark:bg-pink-900/50 rounded-full p-4 w-max mb-4">
                  <HeartPulse className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle>Progress Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Visualize your fitness journey with comprehensive charts and analytics. Monitor your improvement over time.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-4 w-max mb-4">
                  <Utensils className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Diet Plan Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Get personalized meal plans based on your fitness goals, dietary preferences, and nutritional needs.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center">
              <CardHeader>
                <div className="mx-auto bg-orange-100 dark:bg-orange-900/50 rounded-full p-4 w-max mb-4">
                  <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Social Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Share your achievements, workouts, and milestones with your friends and fitness community.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} FitTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <Navigation user={user} setUser={setUser} />
        <Dashboard user={user} />
      </div>
    );
  }

  return <LandingPage />;
}
