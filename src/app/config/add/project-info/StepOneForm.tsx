'use client';
import Input from '@/components/Input';
import { useFormState } from 'react-dom';
import { stepOneFormAction } from './actions';
import { FormErrors } from '@/types';
import SubmitButton from '@/components/SubmitButton';
import { Card, CardContent } from '@/components/ui/card';

const initialState: FormErrors = {};

export default function StepOneForm() {
  const [serverErrors, formAction] = useFormState(
    stepOneFormAction,
    initialState
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Setup Your APIs</h2>

          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Read API"
                id="name"
                type="text"
                required
                className="py-3 h-11 text-sm"
                errorMsg={serverErrors?.name}
              />

              <Input
                label="Update API"
                id="link"
                required
                className="py-3 h-11 text-sm"
                type="text"
                description='Must start with "http://" or "https://"'
                pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                errorMsg={serverErrors?.link}
              />
            </div>

            <div className="flex justify-end">
              <SubmitButton text="Continue" />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
