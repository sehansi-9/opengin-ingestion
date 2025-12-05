'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Plus, X, ChevronRight, Edit2, Check } from 'lucide-react';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { useRouter, usePathname } from 'next/navigation';
import { getNextRoute, getPrevRoute } from '@/hooks/useConfigMode';

interface MinorType {
  id: string;
  name: string;
}

interface MajorType {
  id: string;
  name: string;
  minorTypes: MinorType[];
}

export default function EntityTypesForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { config, updateEntityTypes, saveConfiguration } = useNetworkConfig();

  const [majorTypes, setMajorTypes] = useState<MajorType[]>([
    {
      id: '1',
      name: 'person',
      minorTypes: [
        { id: '1-1', name: 'citizen' }
      ]
    },
    {
      id: '2',
      name: 'organization',
      minorTypes: [
        { id: '2-1', name: 'ministry' },
        { id: '2-2', name: 'department' }
      ]
    },
    {
      id: '3',
      name: 'document',
      minorTypes: []
    }
  ]);

  // Load from context whenever config changes (supports edits/localStorage)
  useEffect(() => {
    if (config.entityTypes && config.entityTypes.length > 0) {
      setMajorTypes(config.entityTypes);
    }
  }, [config.entityTypes]);

  const [newMajorName, setNewMajorName] = useState('');
  const [addingMinorFor, setAddingMinorFor] = useState<string | null>(null);
  const [newMinorName, setNewMinorName] = useState('');

  // Editing state
  const [editingMajor, setEditingMajor] = useState<string | null>(null);
  const [editingMinor, setEditingMinor] = useState<string | null>(null);
  const [editMajorName, setEditMajorName] = useState('');
  const [editMinorName, setEditMinorName] = useState('');

  const addMajorType = () => {
    if (newMajorName.trim()) {
      const newId = Date.now().toString();
      setMajorTypes([...majorTypes, {
        id: newId,
        name: newMajorName.trim(),
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
              { id: `${majorId}-${Date.now()}`, name: newMinorName.trim() }
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

  const startEditMajor = (major: MajorType) => {
    setEditingMajor(major.id);
    setEditMajorName(major.name);
  };

  const saveEditMajor = (majorId: string) => {
    if (editMajorName.trim()) {
      setMajorTypes(prev => prev.map(major =>
        major.id === majorId ? { ...major, name: editMajorName.trim() } : major
      ));
    }
    setEditingMajor(null);
    setEditMajorName('');
  };

  const cancelEditMajor = () => {
    setEditingMajor(null);
    setEditMajorName('');
  };

  const startEditMinor = (minor: MinorType) => {
    setEditingMinor(minor.id);
    setEditMinorName(minor.name);
  };

  const saveEditMinor = (majorId: string, minorId: string) => {
    if (editMinorName.trim()) {
      setMajorTypes(prev => prev.map(major =>
        major.id === majorId
          ? {
            ...major,
            minorTypes: major.minorTypes.map(minor =>
              minor.id === minorId ? { ...minor, name: editMinorName.trim() } : minor
            )
          }
          : major
      ));
    }
    setEditingMinor(null);
    setEditMinorName('');
  };

  const cancelEditMinor = () => {
    setEditingMinor(null);
    setEditMinorName('');
  };

  const handleContinue = async () => {
    // Save to context
    updateEntityTypes(majorTypes);

    // Persist to Mongo/local before moving on
    try {
      await saveConfiguration({ entityTypes: majorTypes });
    } catch (error) {
      console.error('Failed to save configuration at kind-info step:', error);
    }

    // Navigate to next step (preserves new/[id] in URL)
    router.push(getNextRoute(pathname, 'relationship-info'));
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
                  {editingMajor === major.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editMajorName}
                        onChange={(e) => setEditMajorName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditMajor(major.id);
                          if (e.key === 'Escape') cancelEditMajor();
                        }}
                        className="font-semibold text-lg"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveEditMajor(major.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditMajor}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">{major.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditMajor(major)}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {editingMajor !== major.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMajorType(major.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="ml-8 space-y-2">
                  {major.minorTypes.map((minor) => (
                    <div key={minor.id} className="flex items-center justify-between group">
                      {editingMinor === minor.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-muted-foreground">└─</span>
                          <Input
                            value={editMinorName}
                            onChange={(e) => setEditMinorName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditMinor(major.id, minor.id);
                              if (e.key === 'Escape') cancelEditMinor();
                            }}
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveEditMinor(major.id, minor.id)}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditMinor}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">└─</span>
                            <span>{minor.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditMinor(minor)}
                              className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={() => removeMinorType(major.id, minor.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
                      className="mr-8 text-muted-foreground"
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
            <Button variant="outline" onClick={() => router.push(getPrevRoute(pathname, 'project-info'))}>
              ← Back
            </Button>
            <Button onClick={handleContinue}>
              Save & Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}