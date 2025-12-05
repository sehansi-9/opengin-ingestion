'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const handleContinue = () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    if (selectedOption === 'create') {
      router.push('/configuration');
    } else if (selectedOption === 'browse') {
      router.push('/configuration');
    }
  };

  return (

    <Card className="w-full max-w-7xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Welcome to OpenGIN Data Ingestion Configuration</CardTitle>
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
              <RadioGroupItem value="browse" id="browse" />
              <Label htmlFor="browse" className="text-base cursor-pointer flex-1">
                Browse existing networks
              </Label>
            </div>
          </RadioGroup>
        </div>
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