"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Pencil, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@ai-sdk/react"

// Define the Character type
interface Character {
  id: string
  name: string
  description: string
  personality: string
}

export default function CharacterManagement() {
  // State for characters
  const [characters, setCharacters] = useState<Character[]>([])

  // State for character form
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // State for story generation
  // const [story, setStory] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  // const [isGenerating, setIsGenerating] = useState(false)

  // Function to generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9)

  const { messages, handleSubmit, status, setInput } = useChat()

  // Open dialog for adding a new character
  const handleAddCharacter = () => {
    setCurrentCharacter({
      id: generateId(),
      name: "",
      description: "",
      personality: "",
    })
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  // Open dialog for editing an existing character
  const handleEditCharacter = (character: Character) => {
    setCurrentCharacter(character)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Delete a character
  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter((character) => character.id !== id))
  }

  // Save character (add new or update existing)
  const handleSaveCharacter = () => {
    if (!currentCharacter) return

    if (isEditing) {
      // Update existing character
      setCharacters(
        characters.map((character) => (character.id === currentCharacter.id ? currentCharacter : character)),
      )
    } else {
      // Add new character
      setCharacters([...characters, currentCharacter])
    }

    setIsDialogOpen(false)
    setCurrentCharacter(null)
  }

  // // Generate a story based on characters
  // const handleGenerateStory = () => {
  //   setIsGenerating(true)

  //   // In a real application, this would call an API to generate the story
  //   // For this example, we'll simulate a story generation with a timeout
  //   setTimeout(() => {
  //     const generatedStory = `Once upon a time in a magical land, ${characters
  //       .map((c) => c.name)
  //       .join(", ")} embarked on an epic journey. ${characters
  //         .map((c) => `${c.name}, who was ${c.personality}, `)
  //         .join("")} faced many challenges together.`

  //     // Assign random roles to characters
  //     const roles = ["protagonist", "antagonist", "mentor", "ally", "comic relief"]
  //     const charactersWithRoles = characters.map((character) => ({
  //       ...character,
  //       role: roles[Math.floor(Math.random() * roles.length)],
  //     }))

  //     setCharacters(charactersWithRoles)
  //     setStory(generatedStory)
  //     setIsGenerating(false)
  //   }, 2000)
  // }

  useEffect(() => {
    // console.log(prompt)
    // setInput(`Can you generate a story based on the prompt: ${prompt}\n\nCharacters:\n${characters.map((c) => `Name: ${c.name}, Description: ${c.description}, Personality: ${c.personality}`).join("\n")}`)
    setInput(`Can you generate a story based on the prompt: ${prompt}\n\nCharacters:\n${characters.map((c, index) => `${index + 1}. Name: ${c.name}, Description: ${c.description}, Personality: ${c.personality}`).join("\n")}`)
  }, [prompt, characters])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Story Telling App</h1>
      </div>

      {/* Character Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Characters</CardTitle>
              <CardDescription>Manage the characters in your story</CardDescription>
            </div>
            <Button onClick={handleAddCharacter}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Character
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {characters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Personality</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {characters.map((character) => (
                  <TableRow key={character.id}>
                    <TableCell className="font-medium">{character.name}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{character.description}</TableCell>
                    <TableCell>{character.personality}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCharacter(character)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCharacter(character.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No characters added yet</p>
              <Button onClick={handleAddCharacter}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Character
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Story Generation</CardTitle>
          <CardDescription>Generate a story using your characters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Story Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter a prompt for your story..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {characters.length === 0
                  ? "Add characters to include them in your story"
                  : `${characters.length} character${characters.length > 1 ? "s" : ""} will be included`}
              </p>
              <Button onClick={handleSubmit} disabled={status == 'streaming' || characters.length === 0} className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4" />
                {status == 'streaming' ? "Generating..." : "Generate Story"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Story */}
      {messages[0] && (
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Story</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {messages
                .filter(message => message.role === 'assistant')
                .slice(-1)
                .map(message => (
                  <div key={message.id} className="whitespace-pre-wrap">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return <div key={`${message.id}-${i}`}>{part.text}</div>;
                      }
                    })}
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
          {/* <CardFooter>
            <div className="w-full">
              <h3 className="font-semibold mb-2">Character Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {characters.map((character) => (
                  <div key={character.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{character.role}</Badge>
                    <span>{character.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardFooter> */}
        </Card>
      )}

      {/* Character Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Character" : "Add Character"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edit the details of your character" : "Fill in the details to create a new character"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Character name"
                value={currentCharacter?.name || ""}
                onChange={(e) => setCurrentCharacter((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Physical appearance, background, etc."
                value={currentCharacter?.description || ""}
                onChange={(e) =>
                  setCurrentCharacter((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personality</Label>
              <Input
                id="personality"
                placeholder="Character's personality traits"
                value={currentCharacter?.personality || ""}
                onChange={(e) =>
                  setCurrentCharacter((prev) => (prev ? { ...prev, personality: e.target.value } : null))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCharacter} disabled={!currentCharacter?.name}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

