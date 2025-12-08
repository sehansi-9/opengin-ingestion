'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { useRouter, usePathname } from 'next/navigation';
import { getNextRoute } from '@/hooks/useConfigMode';

export default function StepOneForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { config, saveConfiguration, updateProjectInfo } = useNetworkConfig();

  const [readApi, setReadApi] = useState('');
  const [updateApi, setUpdateApi] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  // Load from context when config changes
  useEffect(() => {
    if (config.readApi) setReadApi(config.readApi);
    if (config.ingestionApi) setUpdateApi(config.ingestionApi);
    if (config.projectName) setProjectName(config.projectName);
    if (config.description) setDescription(config.description);
  }, [config]);

  const handleContinue = async () => {
    // Update local context first
    updateProjectInfo({
      projectName,
      description,
      readApi,
      ingestionApi: updateApi
    });

    // Save current step to Mongo/local before moving on
    try {
      await saveConfiguration({ readApi, ingestionApi: updateApi, projectName, description });
    } catch (error) {
      console.error('Failed to save configuration at project-info step:', error);
    }
    // Navigate to next step (preserves new/[id] in URL)
    router.push(getNextRoute(pathname, 'kind-info'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Setup Your Project APIs</h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Project"
                  className="py-3 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project description..."
                  className="py-3 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readApi">
                  Read API
                  <span className="text-sm text-muted-foreground block mt-1">
                    Must start with "http://" or "https://"
                  </span>
                </Label>
                <Input
                  id="readApi"
                  type="text"
                  value={readApi}
                  onChange={(e) => setReadApi(e.target.value)}
                  placeholder="https://api.example.com/read"
                  className="py-3 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateApi">
                  Ingestion API
                  <span className="text-sm text-muted-foreground block mt-1">
                    Must start with "http://" or "https://"
                  </span>
                </Label>
                <Input
                  id="updateApi"
                  type="text"
                  value={updateApi}
                  onChange={(e) => setUpdateApi(e.target.value)}
                  placeholder="https://api.example.com/update"
                  className="py-3 h-11"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleContinue}>
                Save & Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

