'use server';
import {
  NewDealType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchema,
} from '@/schemas';
import { ConfigRoutes } from '@/types';

interface SubmitDealActionReturnType {
  redirect?: ConfigRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitDealAction = async (
  deal: NewDealType
): Promise<SubmitDealActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(deal);
  if (!stepOneValidated.success) {
    return {
      redirect: ConfigRoutes.PROJECT_INFO,
      errorMsg: 'Please validate product info.',
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(deal);
  if (!stepTwoValidated.success) {
    return {
      redirect: ConfigRoutes.KIND_INFO,
      errorMsg: 'Please validate coupon details.',
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(deal);
  if (!stepThreeValidated.success) {
    return {
      redirect: ConfigRoutes.PROJECT_INFO,
      errorMsg: 'Please validate contact info.',
    };
  }
  const retVal = { success: true, redirect: ConfigRoutes.PROJECT_INFO };
  console.log(retVal);
  return retVal;
};
