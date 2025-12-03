'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import { useNetworkConfig } from '@/contexts/networkConfigContext';
import { useRouter } from 'next/navigation';
import { ConfigRoutes } from '@/types';

export default function StepOneForm() {
  const router = useRouter();
  const { config, updateProjectInfo } = useNetworkConfig();

  const [readApi, setReadApi] = useState('');
  const [updateApi, setUpdateApi] = useState('');

  // Load from context on mount
  useEffect(() => {
    if (config.name) setReadApi(config.name);
    if (config.link) setUpdateApi(config.link);
  }, []);

  const handleContinue = () => {
    // Save to context
    updateProjectInfo({ name: readApi, link: updateApi });

    // Navigate to next step
    router.push(ConfigRoutes.KIND_INFO);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Setup Your APIs</h2>

          <div className="space-y-6">
            <div className="space-y-4">
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
                  Update API
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
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
