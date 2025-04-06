"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { abi } from "@/abis/prompt"
import { useReadContract, useAccount, useWriteContract } from "wagmi"
import { parseEther } from "viem"

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

const promptContractAddress = "0x3c8Cd1714AC9c380702D160BE4cee0D291Eb89C0"
const modelId = 11

export default function ContentGenerator() {
  const [context, setContext] = useState("")
  const [type, setType] = useState("pun")
  const [language, setLanguage] = useState("english")
  const [tone, setTone] = useState("witty")
  const [creativityLevel, setCreativityLevel] = useState([5])
  const [input, setInput] = useState("")

  const { writeContract } = useWriteContract()

  const { address } = useAccount()

  const { data: feeValue } = useReadContract({
    address: promptContractAddress,
    abi: abi,
    functionName: "estimateFee",
    args: [modelId],
  }) 

  const { data: aiResult, refetch } = useReadContract({
    address: promptContractAddress,
    abi: abi,
    functionName: "getAIResult",
    args: [modelId, input],
  })

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      writeContract({
        address: promptContractAddress,
        abi: abi,
        functionName: "calculateAIResult",
        args: [modelId, input],
        value: feeValue as bigint,
      })
    } catch (error) {
      console.error("Error generating content:", error)
    }

    await refetch()
  }

  useEffect(() => {
    setInput(`Create me a joke with the following context: ${context} in ${language} language with ${tone} tone and ${type} type. Creativity level: ${creativityLevel[0]}/10, Dont include any extra text, just deliver the joke nothing more.`)
  }, [context, type, language, tone, creativityLevel])

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

        <FormStep number={2} title="Choose Tone">
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

        <FormStep number={3} title="Choose Type">
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

        <FormStep number={4} title="Choose Language">
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
          number={5}
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

      <div className="flex flex-col items-end">
        <Button
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 mb-2"
          disabled={!address}
        >
          Generate ✨
        </Button>
        {address && <p className="text-sm text-gray-500">Fee: 0.01 ETH (approx.)</p>}
      </div>
      {(aiResult != "") && <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        {String(aiResult)}
      </div>}
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

