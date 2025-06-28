"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/navigation";

export default function DietPlanGenerator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dietType, setDietType] = useState("non-veg");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [goal,setGoal]=useState('');
  const handleGoalChange=(event)=>{
    setGoal(event.target.value)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDietPlan("");

    try {
      const response = await fetch(
        "http://localhost:5001/diet/generate-diet-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weight: `${weight}`,
            height: `${height}`,
            goal:`${goal}`,
            dietType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate diet plan");
      }

      const result = await response.json();
      setDietPlan(result.dietPlan);
    } catch (error) {
      console.error(error);
      setDietPlan("Failed to generate diet plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation user={user} setUser={setUser} />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Diet Plan Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="goal">Goal</Label>
          <Input
            id="goal"
            type="text"
            value={goal}
            onChange={handleGoalChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="dietType">Diet Type</Label>
          <Select onValueChange={setDietType} defaultValue={dietType}>
            <SelectTrigger>
              <SelectValue placeholder="Select diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
              <SelectItem value="veg">Vegetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Diet Plan"}
        </Button>
      </form>

      {dietPlan && (
        <div className="mt-8 prose">
          <h2 className="text-xl font-bold">Your Diet Plan</h2>
          <ReactMarkdown>{dietPlan}</ReactMarkdown>
        </div>
      )}
    </div>
    </div>
  );
}
