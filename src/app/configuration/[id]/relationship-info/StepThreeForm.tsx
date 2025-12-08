'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, ChevronRight, Edit2, ArrowRight, ChevronDown } from 'lucide-react';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { useRouter, usePathname } from 'next/navigation';
import { getNextRoute, getPrevRoute } from '@/hooks/useConfigMode';

interface Connection {
  id: string;
  from: string;
  to: string;
  direction: 'INGOING' | 'OUTGOING' | 'BOTH';
  requiresTime: boolean;
}

interface Relationship {
  id: string;
  name: string;
  connections: Connection[];
}

export default function RelationshipTypesForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { config, updateRelationships, saveConfiguration } = useNetworkConfig();

  const [relationships, setRelationships] = useState<Relationship[]>([]);

  // Load from context whenever config changes (supports edits/localStorage)
  useEffect(() => {
    if (config.relationships && config.relationships.length > 0) {
      setRelationships(config.relationships);
    }
  }, [config.relationships]);

  const [currentRelationship, setCurrentRelationship] = useState<Partial<Relationship>>({
    name: '',
    connections: [
      { id: Date.now().toString(), from: '', to: '', direction: 'BOTH', requiresTime: true }
    ]
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [expandedRelationships, setExpandedRelationships] = useState<Set<string>>(new Set());

  // Generate entity types from config
  const entityTypes = React.useMemo(() => {
    if (!config.entityTypes) return [];

    const types: string[] = [];
    config.entityTypes.forEach(major => {
      major.minorTypes.forEach(minor => {
        types.push(`${major.name}.${minor.name}`);
      });
    });
    return types;
  }, [config.entityTypes]);

  const addConnection = () => {
    const newConnection: Connection = {
      id: Date.now().toString(),
      from: '',
      to: '',
      direction: 'BOTH',
      requiresTime: false
    };
    setCurrentRelationship({
      ...currentRelationship,
      connections: [...(currentRelationship.connections || []), newConnection]
    });
  };

  const updateConnection = (connectionId: string, updates: Partial<Connection>) => {
    setCurrentRelationship({
      ...currentRelationship,
      connections: currentRelationship.connections?.map(conn =>
        conn.id === connectionId ? { ...conn, ...updates } : conn
      )
    });
  };

  const removeConnection = (connectionId: string) => {
    setCurrentRelationship({
      ...currentRelationship,
      connections: currentRelationship.connections?.filter(conn => conn.id !== connectionId)
    });
  };

  const addRelationship = () => {
    if (currentRelationship.name && currentRelationship.connections && currentRelationship.connections.length > 0) {
      const allValid = currentRelationship.connections.every(conn => conn.from && conn.to);
      if (!allValid) {
        alert('Please complete all connections');
        return;
      }

      const newRelationship: Relationship = {
        id: Date.now().toString(),
        name: currentRelationship.name,
        connections: currentRelationship.connections
      };

      setRelationships([...relationships, newRelationship]);
      setExpandedRelationships(prev => new Set([...prev, newRelationship.id]));

      setCurrentRelationship({
        name: '',
        connections: [{ id: '1', from: '', to: '', direction: 'BOTH', requiresTime: false }]
      });
    }
  };

  const removeRelationship = (id: string) => {
    setRelationships(prev => prev.filter(r => r.id !== id));
  };

  const startEdit = (rel: Relationship) => {
    setEditing(rel.id);
    setCurrentRelationship(rel);
    setExpandedRelationships(prev => new Set([...prev, rel.id]));
  };

  const saveEdit = () => {
    if (editing && currentRelationship.name) {
      const allValid = currentRelationship.connections?.every(conn => conn.from && conn.to);
      if (!allValid) {
        alert('Please complete all connections');
        return;
      }

      setRelationships(prev => prev.map(r =>
        r.id === editing
          ? { ...r, ...currentRelationship as Relationship }
          : r
      ));
      setEditing(null);
      setCurrentRelationship({
        name: '',
        connections: [{ id: '1', from: '', to: '', direction: 'BOTH', requiresTime: false }]
      });
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setCurrentRelationship({
      name: '',
      connections: [{ id: '1', from: '', to: '', direction: 'BOTH', requiresTime: false }]
    });
  };

  const toggleRelationship = (id: string) => {
    setExpandedRelationships(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContinue = async () => {
    // Save to context
    updateRelationships(relationships);

    // Persist to Mongo/local before moving on
    try {
      await saveConfiguration({ relationships });
    } catch (error) {
      console.error('Failed to save configuration at relationship-info step:', error);
    }

    // Navigate to review
    router.push(getNextRoute(pathname, 'review'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-bold">Define Relationship Types</h2>

          {/* Current Relationship Form */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="relName">Relationship Name:</Label>
              <Input
                id="relName"
                value={currentRelationship.name || ''}
                onChange={(e) => setCurrentRelationship({ ...currentRelationship, name: e.target.value.toUpperCase() })}
                placeholder="e.g., AS_APPOINTED"
                className="uppercase"
              />
            </div>

            <div className="space-y-3">
              <Label>Valid Connections:</Label>

              {currentRelationship.connections?.map((connection, index) => (
                <div key={connection.id} className="space-y-3 p-4 border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Connection {index + 1}
                    </span>
                    {currentRelationship.connections && currentRelationship.connections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConnection(connection.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      value={connection.from}
                      onValueChange={(value) => updateConnection(connection.id, { from: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="From entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                    <Select
                      value={connection.to}
                      onValueChange={(value) => updateConnection(connection.id, { to: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="To entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Direction:</Label>
                    <RadioGroup
                      value={connection.direction}
                      onValueChange={(value: any) => updateConnection(connection.id, { direction: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="INGOING" id={`ingoing-${connection.id}`} />
                        <Label htmlFor={`ingoing-${connection.id}`} className="font-normal text-sm">INGOING</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OUTGOING" id={`outgoing-${connection.id}`} />
                        <Label htmlFor={`outgoing-${connection.id}`} className="font-normal text-sm">OUTGOING</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BOTH" id={`both-${connection.id}`} />
                        <Label htmlFor={`both-${connection.id}`} className="font-normal text-sm">BOTH</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`requiresTime-${connection.id}`}
                      checked={connection.requiresTime}
                      onCheckedChange={(checked) => updateConnection(connection.id, { requiresTime: checked as boolean })}
                    />
                    <Label htmlFor={`requiresTime-${connection.id}`} className="font-normal text-sm">
                      Requires start time
                    </Label>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addConnection}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add another connection
              </Button>
            </div>

            {editing ? (
              <div className="flex gap-2">
                <Button onClick={saveEdit} className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={addRelationship} className="w-full">
                Add Relationship
              </Button>
            )}
          </div>

          {/* Configured Relationships */}
          {relationships.length > 0 && (<>
            <div className="space-y-3">
              <Label className="text-lg">Configured Relationships:</Label>
              <div className="border rounded-lg divide-y">
                {relationships.map((rel) => {
                  const isExpanded = expandedRelationships.has(rel.id);

                  return (
                    <div key={rel.id} className="hover:bg-muted/50">
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleRelationship(rel.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? '' : '-rotate-90'
                                }`}
                            />
                            <div>
                              <div className="font-semibold text-lg">{rel.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {rel.connections.length} connection{rel.connections.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" onClick={() => startEdit(rel)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => removeRelationship(rel.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2 ml-7">
                          {rel.connections.map((conn, idx) => (
                            <div key={conn.id} className="text-sm p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs">{conn.from}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="font-mono text-xs">{conn.to}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {conn.direction} {conn.requiresTime && '• Time-based'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>)}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.push(getPrevRoute(pathname, 'kind-info'))}>
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

