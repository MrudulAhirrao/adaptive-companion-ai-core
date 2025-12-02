"use client"

import { useState } from "react"
import { Send, User, Bot, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Message = { role: "user" | "agent"; content: string }
type MemoryData = {
  user_profile: { key_facts: string[]; key_preferences: string[] }
  emotional_patterns: { dominant_emotion: string }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [tone, setTone] = useState("Calm Mentor")
  const [loading, setLoading] = useState(false)
  const [memory, setMemory] = useState<MemoryData | null>(null)
  const [lastPrompt, setLastPrompt] = useState<string>("")

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const newHistory = [...messages, { role: "user" as const, content: input }]
    setMessages(newHistory)
    setLoading(true)
    setInput("")

    try {
      const BACKEND_URL = "https://didactic-guide-wjj57g99774f5xj-8000.app.github.dev/chat";

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          tone: tone,
          history: newHistory.map(m => `${m.role}: ${m.content}`)
        }),
      })


      const data = await res.json()
      setMessages([...newHistory, { role: "agent", content: data.response }])
      setMemory(data.memory)
      setLastPrompt(data.applied_prompt)
    } catch (error) {
      console.error(error)
      // Display the actual error message in the chat bubble for easier debugging
      setMessages(prev => [...prev, { 
        role: "agent", 
        content: `Error: ${error instanceof Error ? error.message : "Something went wrong. Check backend terminal logs."}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 p-4 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Companion AI Chat</CardTitle>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Calm Mentor">Calm Mentor</SelectItem>
                <SelectItem value="Witty Friend">Witty Friend</SelectItem>
                <SelectItem value="Therapist-Style">Therapist Style</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
            <ScrollArea className="h-[calc(100vh-200px)] p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex mb-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${m.role === "user" ? "bg-blue-500 text-white" : "bg-slate-200"}`}>
                      {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-slate-100"} whitespace-pre-wrap`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && <div className="text-sm text-muted-foreground ml-12">Thinking...</div>}
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..." 
            />
            <Button onClick={sendMessage} disabled={loading}><Send size={16} /></Button>
          </div>
        </Card>
      </div>

      <div className="w-[350px] flex flex-col gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain size={20} className="text-purple-500" />
              Live Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!memory ? (
              <div className="text-sm text-muted-foreground">Start chatting to generate memory extraction.</div>
            ) : (
              <>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Detected Emotion</h4>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                    {memory.emotional_patterns.dominant_emotion}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Facts</h4>
                  <ul className="text-sm list-disc pl-4 text-slate-600 space-y-1">
                    {memory.user_profile.key_facts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {memory.user_profile.key_preferences.map((pref, i) => (
                      <Badge key={i} variant="outline">{pref}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Updated Debug Card Structure */}
        <Card className="h-1/3 flex flex-col overflow-hidden">
           <CardHeader className="pb-2"><CardTitle className="text-sm">System Prompt (Debug)</CardTitle></CardHeader>
           <CardContent className="flex-1 min-h-0">
             <ScrollArea className="h-full">
               <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                 {lastPrompt || "Waiting for prompt generation..."}
               </pre>
             </ScrollArea>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}