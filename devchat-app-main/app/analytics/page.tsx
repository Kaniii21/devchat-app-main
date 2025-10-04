"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Layout/Navbar"
import Sidebar from "@/components/Layout/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { getSentimentAnalysis } from "@/utils/sentimentAnalysis"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("week")
  const [sentimentData, setSentimentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (user) {
      loadAnalytics()
    }
  }, [user, loading, router, timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch data from your backend
      const data = await getSentimentAnalysis(user!.uid, timeRange)
      setSentimentData(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Sample data for charts
  const sentimentOverTime = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Positive",
        data: [65, 59, 80, 81, 56, 55, 70],
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
      {
        label: "Neutral",
        data: [28, 48, 40, 19, 86, 27, 40],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
      {
        label: "Negative",
        data: [10, 20, 30, 15, 12, 8, 5],
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
      },
    ],
  }

  const messageActivity = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Messages Sent",
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  }

  const sentimentDistribution = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(59, 130, 246, 0.7)", "rgba(239, 68, 68, 0.7)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(59, 130, 246)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Chat Analytics</h1>
                <p className="text-muted-foreground">Analyze your communication patterns and sentiment</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Last 24 hours</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="sentiment" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
              </TabsList>

              <TabsContent value="sentiment" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
                      <CardDescription>Distribution of message sentiment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={sentimentDistribution}
                        className="aspect-square"
                        options={{
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Sentiment Over Time</CardTitle>
                      <CardDescription>How your communication sentiment has changed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LineChart
                        data={sentimentOverTime}
                        className="aspect-[2/1]"
                        options={{
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Insights</CardTitle>
                    <CardDescription>Key takeaways from your communication patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="font-medium mb-2">Positive Communication</h3>
                        <p className="text-sm text-muted-foreground">
                          Your communication is mostly positive (60%), which helps create a supportive environment.
                          Continue using encouraging language and positive feedback.
                        </p>
                      </div>

                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="font-medium mb-2">Areas for Improvement</h3>
                        <p className="text-sm text-muted-foreground">
                          There's a small percentage of negative communication (10%). Consider reviewing these
                          interactions to identify patterns and improve team dynamics.
                        </p>
                      </div>

                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="font-medium mb-2">Channel Recommendations</h3>
                        <p className="text-sm text-muted-foreground">
                          The "React" channel shows the most positive sentiment. Consider applying similar communication
                          approaches to other channels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Message Activity</CardTitle>
                    <CardDescription>Number of messages sent over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={messageActivity}
                      className="aspect-[3/2]"
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Hours</CardTitle>
                      <CardDescription>When you're most active in chat</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Activity heatmap visualization
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time</CardTitle>
                      <CardDescription>Average time to respond to messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Response time visualization
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Activity</CardTitle>
                    <CardDescription>Your participation across different channels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Channel activity visualization
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Active Channel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold">React</div>
                        <p className="text-muted-foreground">42 messages this week</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Fastest Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold">JavaScript</div>
                        <p className="text-muted-foreground">Avg. 2.5 min response time</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Most Positive</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold">Beginners</div>
                        <p className="text-muted-foreground">85% positive sentiment</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
