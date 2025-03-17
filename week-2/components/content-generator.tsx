"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
// import { Sparkles } from "lucide-react"

const styles = [
  { value: "dad-jokes", label: "Dad Jokes", emoji: "😂" },
  { value: "poetry", label: "Poetry", emoji: "📝" },
  { value: "story", label: "Story", emoji: "📚" },
  { value: "riddle", label: "Riddle", emoji: "🧩" },
]

const topics = [
  { value: "work", label: "Work", emoji: "📆" },
  { value: "people", label: "People", emoji: "👨" },
  { value: "animals", label: "Animals", emoji: "🐱" },
  { value: "food", label: "Food", emoji: "🍔" },
  { value: "television", label: "Television", emoji: "📺" },
]

const tones = [
  { value: "witty", label: "Witty", emoji: "🤣" },
  { value: "sarcastic", label: "Sarcastic", emoji: "😏" },
  { value: "silly", label: "Silly", emoji: "🤓" },
  { value: "dark", label: "Dark", emoji: "😈" },
  { value: "goofy", label: "Goofy", emoji: "🤪" },
]

const types = [
  { value: "pun", label: "Pun", emoji: "" },
  { value: "knock-knock", label: "Knock-Knock", emoji: "" },
  { value: "story", label: "Story", emoji: "" },
]

const languages = [
  { value: "english", label: "English", flag: "🇺🇸" },
  { value: "spanish", label: "Spanish", flag: "🇪🇸" },
  { value: "french", label: "French", flag: "🇫🇷" },
  { value: "german", label: "German", flag: "🇩🇪" },
]

export default function ContentGenerator() {
  const [context, setContext] = useState("")
  const [topic, setTopic] = useState("work")
  const [type, setType] = useState("pun")
  const [language, setLanguage] = useState("english")
  const [tone, setTone] = useState("witty")
  const [creativityLevel, setCreativityLevel] = useState([5])
  const [result, setResult] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "dad-jokes": "I'm afraid for the calendar. Its days are numbered!",
        poetry: "Whispers of wind through autumn leaves,\nDancing in the golden light of eve.",
        story: "Once upon a time in a digital realm, a developer created a content generator...",
        riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      }
      setResult(responses[topic as keyof typeof responses] || "Generated content will appear here.")
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
      <div className="space-y-6">
        <FormStep number={1} title="Provide specific words or context">
          <Textarea
            placeholder="Enter your text here."
            className="min-h-[120px] resize-none"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Example: • Tone: Witty • Context: Why did the bicycle fall over?
          </p>
        </FormStep>

        <FormStep number={2} title="Choose a Topic">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {topics.find((t) => t.value === topic)?.emoji} {topics.find((t) => t.value === topic)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="flex items-center">
                    <span className="mr-2">{t.emoji}</span>
                    {t.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormStep>


        <FormStep number={3} title="Choose Tone">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {tones.find((l) => l.value === tone)?.emoji} {tones.find((l) => l.value === tone)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tones.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  <span className="flex items-center">
                    <span className="mr-2">{l.emoji}</span>
                    {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormStep>

        <FormStep number={4} title="Choose Type">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue>
                  {tones.find((l) => l.value === type)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {types.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  <span className="flex items-center">
                    <span className="mr-2">{l.emoji}</span>
                    {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormStep>

        <FormStep number={5} title="Choose Language">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {languages.find((l) => l.value === language)?.flag} {languages.find((l) => l.value === language)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  <span className="flex items-center">
                    <span className="mr-2">{l.flag}</span>
                    {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormStep>

        <FormStep
          number={6}
          title="Choose Creativity Level, 5 for optimal balance, 10 for maximum creativity."
          subtitle={`(${creativityLevel[0]}/10)`}
        >
          <Slider
            defaultValue={[5]}
            max={10}
            step={1}
            value={creativityLevel}
            onValueChange={setCreativityLevel}
            className="py-4"
          />
        </FormStep>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
          disabled={isGenerating}
        >
          {/* <Sparkles className="mr-2 h-4 w-4" /> */}
          Generate
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-medium mb-2">Generated Content:</h3>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  )
}

interface FormStepProps {
  number: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

function FormStep({ number, title, subtitle, children }: FormStepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm">
          {number}
        </div>
        <h3 className="font-medium text-gray-800">
          {title}
          {subtitle && <span className="text-gray-500 ml-1 text-sm">{subtitle}</span>}
        </h3>
      </div>
      <div className="pl-11">{children}</div>
    </div>
  )
}

