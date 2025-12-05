'use client';

import { ConfigRoutes } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { Plus, Trash2 } from 'lucide-react';

export default function AddPage() {
  const router = useRouter();
  const { config } = useNetworkConfig();

  const hasConfiguration = config.projectName && config.projectName.trim() !== '';

  //to be populated from MongoDB
  const configurations = hasConfiguration ? [config] : [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurations</h1>
        <p className="text-muted-foreground">Manage your ingestion configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing configurations */}
        {configurations.map((cfg, index) => (
          <Card key={index} className="flex flex-col">
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
                onClick={() => router.push(ConfigRoutes.PROJECT_INFO)}
                variant="default"
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  // Delete functionality will be implemented with MongoDB
                  if (confirm('Delete this configuration?')) {
                    console.log('Delete config:', cfg.projectName);
                  }
                }}
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
          onClick={() => router.push(ConfigRoutes.PROJECT_INFO)}
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
