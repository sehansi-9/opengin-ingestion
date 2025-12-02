'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ChevronRight } from 'lucide-react';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { useRouter } from 'next/navigation';
import { ConfigRoutes } from '@/types';

interface MinorType {
  id: string;
  name: string;
  checked: boolean;
}

interface MajorType {
  id: string;
  name: string;
  checked: boolean;
  minorTypes: MinorType[];
}

export default function EntityTypesForm() {
  const router = useRouter();
  const { config, updateEntityTypes } = useNetworkConfig();

  const [majorTypes, setMajorTypes] = useState<MajorType[]>([
    {
      id: '1',
      name: 'person',
      checked: true,
      minorTypes: [
        { id: '1-1', name: 'citizen', checked: true }
      ]
    },
    {
      id: '2',
      name: 'organization',
      checked: true,
      minorTypes: [
        { id: '2-1', name: 'ministry', checked: true },
        { id: '2-2', name: 'department', checked: true }
      ]
    },
    {
      id: '3',
      name: 'document',
      checked: false,
      minorTypes: []
    }
  ]);

  // Load from context on mount
  useEffect(() => {
    if (config.entityTypes && config.entityTypes.length > 0) {
      setMajorTypes(config.entityTypes);
    }
  }, []);

  const [newMajorName, setNewMajorName] = useState('');
  const [addingMinorFor, setAddingMinorFor] = useState<string | null>(null);
  const [newMinorName, setNewMinorName] = useState('');

  const toggleMajor = (id: string) => {
    setMajorTypes(prev => prev.map(major =>
      major.id === id ? { ...major, checked: !major.checked } : major
    ));
  };

  const toggleMinor = (majorId: string, minorId: string) => {
    setMajorTypes(prev => prev.map(major =>
      major.id === majorId
        ? {
          ...major,
          minorTypes: major.minorTypes.map(minor =>
            minor.id === minorId ? { ...minor, checked: !minor.checked } : minor
          )
        }
        : major
    ));
  };

  const addMajorType = () => {
    if (newMajorName.trim()) {
      const newId = Date.now().toString();
      setMajorTypes([...majorTypes, {
        id: newId,
        name: newMajorName.trim(),
        checked: true,
        minorTypes: []
      }]);
      setNewMajorName('');
    }
  };

  const addMinorType = (majorId: string) => {
    if (newMinorName.trim()) {
      setMajorTypes(prev => prev.map(major =>
        major.id === majorId
          ? {
            ...major,
            minorTypes: [
              ...major.minorTypes,
              { id: `${majorId}-${Date.now()}`, name: newMinorName.trim(), checked: true }
            ]
          }
          : major
      ));
      setNewMinorName('');
      setAddingMinorFor(null);
    }
  };

  const removeMajorType = (id: string) => {
    setMajorTypes(prev => prev.filter(major => major.id !== id));
  };

  const removeMinorType = (majorId: string, minorId: string) => {
    setMajorTypes(prev => prev.map(major =>
      major.id === majorId
        ? { ...major, minorTypes: major.minorTypes.filter(minor => minor.id !== minorId) }
        : major
    ));
  };

  const handleContinue = () => {
    // Save to context
    updateEntityTypes(majorTypes);

    // Navigate to next step
    router.push(ConfigRoutes.RELATIONSHIP_INFO);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Define Your Entity Types</h2>

          <div className="space-y-4 mb-6">
            {majorTypes.map((major) => (
              <div key={major.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={major.checked}
                      onCheckedChange={() => toggleMajor(major.id)}
                    />
                    <span className="font-semibold text-lg">{major.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMajorType(major.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="ml-8 space-y-2">
                  {major.minorTypes.map((minor) => (
                    <div key={minor.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">└─</span>
                        <Checkbox
                          checked={minor.checked}
                          onCheckedChange={() => toggleMinor(major.id, minor.id)}
                        />
                        <span>{minor.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => removeMinorType(major.id, minor.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {addingMinorFor === major.id ? (
                    <div className="flex items-center gap-2 ml-8">
                      <Input
                        placeholder="Minor type name"
                        value={newMinorName}
                        onChange={(e) => setNewMinorName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMinorType(major.id)}
                        autoFocus
                      />
                      <Button size="sm" onClick={() => addMinorType(major.id)}>Add</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingMinorFor(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-8 text-muted-foreground"
                      onClick={() => setAddingMinorFor(major.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add minor type
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder="New major type name"
              value={newMajorName}
              onChange={(e) => setNewMajorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMajorType()}
            />
            <Button onClick={addMajorType}>
              <Plus className="h-4 w-4 mr-1" />
              Add Major Type
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.push(ConfigRoutes.PROJECT_INFO)}>
              ← Back
            </Button>
            <Button onClick={handleContinue}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}