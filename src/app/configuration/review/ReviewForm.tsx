'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { ConfigRoutes } from '@/types';

export default function ReviewForm() {
  const router = useRouter();
  const { config, resetLocalStorage } = useNetworkConfig();

  const handleSubmit = () => {
    // Validate all data is present
    if (!config.readApi || !config.ingestionApi) {
      toast.error('Please complete Step 1');
      router.push(ConfigRoutes.PROJECT_INFO);
      return;
    }

    if (!config.entityTypes || config.entityTypes.length === 0) {
      toast.error('Please define entity types in Step 2');
      router.push(ConfigRoutes.KIND_INFO);
      return;
    }

    if (!config.relationships || config.relationships.length === 0) {
      toast.error('Please define relationships in Step 3');
      router.push(ConfigRoutes.RELATIONSHIP_INFO);
      return;
    }

    console.log('Submitting network config:', config);

    toast.success('Network configuration submitted successfully!');
    // resetLocalStorage();
    router.push('/configuration');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Review Your Configuration</h2>

          {/* Project Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Project Information</h3>
            <div className="bg-muted/30 p-4 rounded-lg space-y-1">
              <p><span className="font-medium">Project Name:</span> {config.projectName || 'Not set'}</p>
              {config.description && (
                <p><span className="font-medium">Description:</span> {config.description}</p>
              )}
            </div>
          </div>

          {/* API Configuration */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">API Configuration</h3>
            <div className="bg-muted/30 p-4 rounded-lg space-y-1">
              <p><span className="font-medium">Read API:</span> {config.readApi || 'Not set'}</p>
              <p><span className="font-medium">Ingestion API:</span> {config.ingestionApi || 'Not set'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Entity Types</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              {config.entityTypes && config.entityTypes.length > 0 ? (
                <div className="space-y-3">
                  {config.entityTypes
                    .map(major => (
                      <div key={major.id}>
                        <p className="font-medium">{major.name}</p>
                        <div className="ml-4 text-sm text-muted-foreground">
                          {major.minorTypes
                            .map(minor => (
                              <span key={minor.id} className="inline-block mr-3">
                                └─ {minor.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No entity types defined</p>
              )}
            </div>
          </div>

          {/* Relationships */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Relationship Types</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              {config.relationships && config.relationships.length > 0 ? (
                <div className="space-y-3">
                  {config.relationships.map(rel => (
                    <div key={rel.id} className="border-l-2 border-primary pl-3">
                      <p className="font-medium">{rel.name}</p>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        {rel.connections.map(conn => (
                          <div key={conn.id}>
                            {conn.from} → {conn.to} ({conn.direction})
                            {conn.requiresTime && ' • Time-based'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No relationships defined</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.push(ConfigRoutes.RELATIONSHIP_INFO)}>
              ← Back
            </Button>
            <Button onClick={handleSubmit}>
              Submit Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
