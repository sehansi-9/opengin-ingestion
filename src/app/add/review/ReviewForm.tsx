'use client';
import Input from '@/components/Input';
import SubmitButton from '../../../components/SubmitButton';
import { submitDealAction } from './actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAddDealContext } from '@/contexts/addDealContext';
import { NewDealType } from '@/schemas';

export default function ReviewForm() {
  const router = useRouter();
  const { newDealData, resetLocalStorage } = useAddDealContext();

  const { name, link, coupon, discount, contactName, contactEmail } =
    newDealData;

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitDealAction(newDealData as NewDealType);
    const { redirect, errorMsg, success } = res;

    if (success) {
      toast.success('Deal submitted successfully');
      resetLocalStorage();
    } else if (errorMsg) {
      toast.error(errorMsg);
    }
    if (redirect) {
      return router.push(redirect);
    }
  };

  return (
    <form
      action={handleFormSubmit}
      className="flex flex-1 flex-col gap-2 items-stretch lg:max-w-[700px]"
    >
      <p className="text-xl md:text-3xl text-foreground">
        Name: {name}
      </p>

      <p className="text-muted-foreground">
        Link:{' '}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="font-normal underline text-muted-foreground"
        >
          {link}
        </a>
      </p>

      <p className="text-muted-foreground">Coupon: {coupon}</p>
      <p className="text-muted-foreground">Discount: {discount}%</p>
      <p className="text-muted-foreground">Contact Name: {contactName}</p>
      <p className="text-muted-foreground">Contact Email: {contactEmail}</p>

      <SubmitButton text="Submit" submittingText="Submitting..." />
    </form>
  );

}
