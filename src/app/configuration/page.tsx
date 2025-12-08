'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { Plus, Trash2 } from 'lucide-react';
import { NetworkConfig } from '@/schemas';

// Type for MongoDB document (includes _id)
type ConfigDocument = NetworkConfig & { _id: string };

export default function ConfigurationsPage() {
  const router = useRouter();
  const { resetLocalStorage } = useNetworkConfig();
  const [configurations, setConfigurations] = useState<ConfigDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all configurations from MongoDB
  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/configurations');
      const result = await response.json();

      if (result.success) {
        setConfigurations(result.data);
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (configId: string) => {
    try {
      // Navigate to edit page with ID in URL
      router.push(`/configuration/${configId}/project-info`);
    } catch (error) {
      console.error('Error navigating to edit:', error);
      alert('Failed to navigate to configuration');
    }
  };

  const handleDelete = async (configId: string, projectName: string) => {
    if (!confirm(`Delete configuration "${projectName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/configurations/${configId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        fetchConfigurations();
      } else {
        alert('Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      alert('Failed to delete configuration');
    }
  };

  const handleCreateNew = () => {
    // Clear localStorage and navigate to new config route
    resetLocalStorage();
    router.push('/configuration/new/project-info'); // 'new' is handled by [id] route
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p>Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurations</h1>
        <p className="text-muted-foreground">Manage your ingestion configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing configurations */}
        {configurations.map((cfg) => (
          <Card key={cfg._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-1">{cfg.projectName}</CardTitle>
              {cfg.description && (
                <CardDescription className="line-clamp-2">
                  {cfg.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Read API</h3>
                <p className="text-sm truncate" title={cfg.readApi}>
                  {cfg.readApi}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Ingestion API</h3>
                <p className="text-sm truncate" title={cfg.ingestionApi}>
                  {cfg.ingestionApi}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                {cfg.entityTypes && cfg.entityTypes.length > 0 && (
                  <div>
                    <span className="font-medium">{cfg.entityTypes.length}</span>
                    <span className="text-muted-foreground"> entities</span>
                  </div>
                )}
                {cfg.relationships && cfg.relationships.length > 0 && (
                  <div>
                    <span className="font-medium">{cfg.relationships.length}</span>
                    <span className="text-muted-foreground"> relationships</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => handleEdit(cfg._id)}
                variant="default"
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(cfg._id, cfg.projectName)}
                variant="outline"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Configuration Card */}
        <Card
          className="flex flex-col items-center justify-center min-h-[300px] border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={handleCreateNew}
        >
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Add New Configuration</h3>
            <p className="text-sm text-muted-foreground text-center">
              Create a new network ingestion configuration
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
