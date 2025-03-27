"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Share2, Trophy, Users, Heart, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function SocialFeatures() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("achievements")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const achievements = [
    {
      id: 1,
      name: "Hydration Hero",
      description: "Reached your water goal for 7 consecutive days",
      icon: "💧",
      unlocked: true,
      date: "2023-10-15",
    },
    {
      id: 2,
      name: "BMI Tracker",
      description: "Recorded your BMI 5 times",
      icon: "📊",
      unlocked: true,
      date: "2023-10-10",
    },
    {
      id: 3,
      name: "Calorie Counter",
      description: "Logged your meals for 10 days",
      icon: "🍎",
      unlocked: false,
    },
    {
      id: 4,
      name: "Weight Loss Journey",
      description: "Lost 5% of your starting weight",
      icon: "⚖️",
      unlocked: false,
    },
    {
      id: 5,
      name: "Consistency King",
      description: "Used the app for 30 consecutive days",
      icon: "👑",
      unlocked: false,
    },
  ]

  const leaderboard = [
    { id: 1, name: "Sarah J.", avatar: "/placeholder.svg?height=40&width=40", points: 1250, streak: 45 },
    { id: 2, name: "Michael T.", avatar: "/placeholder.svg?height=40&width=40", points: 980, streak: 30 },
    { id: 3, name: "You", avatar: "/placeholder.svg?height=40&width=40", points: 750, streak: 15, isCurrentUser: true },
    { id: 4, name: "Jessica K.", avatar: "/placeholder.svg?height=40&width=40", points: 720, streak: 12 },
    { id: 5, name: "David M.", avatar: "/placeholder.svg?height=40&width=40", points: 650, streak: 8 },
  ]

  const challenges = [
    {
      id: 1,
      name: "Water Week",
      description: "Drink your daily water goal for 7 consecutive days",
      participants: 245,
      daysLeft: 3,
      joined: true,
    },
    {
      id: 2,
      name: "Calorie Control",
      description: "Stay within your calorie goal for 5 days this week",
      participants: 189,
      daysLeft: 5,
      joined: false,
    },
    {
      id: 3,
      name: "BMI Improvement",
      description: "Reduce your BMI by 1 point in 30 days",
      participants: 312,
      daysLeft: 22,
      joined: false,
    },
  ]

  const handleShare = () => {
    toast({
      title: "Shared Successfully",
      description: "Your progress has been shared with your friends",
    })
    setShareDialogOpen(false)
  }

  const handleJoinChallenge = (challengeId: number) => {
    toast({
      title: "Challenge Joined",
      description: "You've successfully joined the challenge",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Community & Achievements
        </CardTitle>
        <CardDescription>Track your progress and connect with others</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="text-3xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{achievement.name}</h4>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="ml-2">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && achievement.date && (
                        <p className="text-xs text-muted-foreground mt-1">Achieved on {achievement.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="space-y-2">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg ${
                    user.isCurrentUser ? "bg-primary/5 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="font-bold text-lg w-8 text-center">{index + 1}</div>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{user.name}</h4>
                      {user.isCurrentUser && (
                        <Badge variant="outline" className="ml-2">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.streak} day streak</p>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{user.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{challenge.name}</h4>
                    <Badge variant={challenge.daysLeft < 4 ? "destructive" : "outline"}>
                      {challenge.daysLeft} days left
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <Users className="h-4 w-4 inline mr-1" />
                      {challenge.participants} participants
                    </div>
                    {challenge.joined ? (
                      <Badge variant="secondary">Joined</Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleJoinChallenge(challenge.id)}>
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setActiveTab("achievements")}>
          <Trophy className="mr-2 h-4 w-4" />
          View Achievements
        </Button>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Progress</DialogTitle>
              <DialogDescription>Share your health journey with friends and family</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Your Progress</h4>
                    <p className="text-xs text-muted-foreground">Today at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                <p className="text-sm mb-2">
                  I've been tracking my health with HealthTrack! I've reached my water goal for 15 days and improved my
                  BMI by 0.5 points.
                </p>
                <div className="flex space-x-2 text-sm text-muted-foreground">
                  <button className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>

              <Textarea placeholder="Add a message to your share..." />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare}>Share</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

