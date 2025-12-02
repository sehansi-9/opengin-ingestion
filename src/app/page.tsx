'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const handleContinue = () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    if (selectedOption === 'create') {
      if (!projectName.trim()) {
        alert('Please enter a project name');
        return;
      }

      // Store project info in localStorage or context
      localStorage.setItem('projectInfo', JSON.stringify({
        projectName,
        description
      }));

      // Navigate to step one
      router.push('/add/project-info');
    } else if (selectedOption === 'import') {
      // Navigate to browse existing networks page
      router.push('/browse');
    }
  };

  return (

    <Card className="w-full max-w-7xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Welcome to OpenGIN Data Ingestion</CardTitle>
        <CardDescription className="text-base mt-2">
          Configure your data ingestion project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">What would you like to do?</Label>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="create" id="create" />
              <Label htmlFor="create" className="text-base cursor-pointer flex-1">
                Create a new network
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="import" id="import" />
              <Label htmlFor="import" className="text-base cursor-pointer flex-1">
                Browse existing networks
              </Label>
            </div>
          </RadioGroup>
        </div>

        {selectedOption === 'create' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name:</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description:</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description (optional)"
                rows={3}
              />
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleContinue}
            size="lg"
            disabled={!selectedOption}
          >
            Continue →
          </Button>
        </div>
      </CardContent>
    </Card>

  );
}