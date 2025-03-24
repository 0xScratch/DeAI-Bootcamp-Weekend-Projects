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
import { useChat } from "@ai-sdk/react"

interface Character {
  id: string
  name: string
  description: string
  personality: string
}

export default function CharacterManagement() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [prompt, setPrompt] = useState<string>("")
  const [isSummaryRequested, setIsSummaryRequested] = useState(false)
  const [isStoryRequested, setIsStoryRequested] = useState(false)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const { messages, handleSubmit, status, setInput, input } = useChat()

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

  const handleEditCharacter = (character: Character) => {
    setCurrentCharacter(character)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter((character) => character.id !== id))
  }

  const handleSaveCharacter = () => {
    if (!currentCharacter) return

    if (isEditing) {
      setCharacters(
        characters.map((character) => (character.id === currentCharacter.id ? currentCharacter : character)),
      )
    } else {
      setCharacters([...characters, currentCharacter])
    }

    setIsDialogOpen(false)
    setCurrentCharacter(null)
  }

  useEffect(() => {
    setInput(`Can you generate a story based on the prompt: ${prompt}\n\nCharacters:\n${characters.map((c, index) => `${index + 1}. Name: ${c.name}, Description: ${c.description}, Personality: ${c.personality}`).join("\n")}\n\nPlease don't generate a summary of the characters yet.`)
    console.log(input)
    // console.log('story requested')
    handleSubmit()
    setIsStoryRequested(false)
  }, [isStoryRequested])

  useEffect(() => {
    setInput(`Please summarize the character's role in the above story.`)
    console.log(input)
    handleSubmit()
    // console.log('summary requested')
    setIsSummaryRequested(false)
  }, [isSummaryRequested])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Story Telling App</h1>
      </div>

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
              <Button onClick={() => setIsStoryRequested(true)} disabled={status == 'streaming' || characters.length === 0} className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4" />
                {status == 'streaming' ? "Generating..." : "Generate Story"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <CardFooter>
            <Button onClick={() => setIsSummaryRequested(true)} className="cursor-pointer">
              Summarize Character Roles
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* {messages[2] && (
        <Card>
          <CardHeader>
            <CardTitle>Character's Summary</CardTitle>
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
        </Card>
      )} */}

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