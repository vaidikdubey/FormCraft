import { cn } from '@/lib/utils';
import { useResponseStore } from '@/store/useResponseStore';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const AllResponsesPage = () => {
    const { formId } = useParams();

    const { isGettingAllResponses, getAllResponses, allResponses } = useResponseStore();

    const {}

    useEffect(() => {
        getAllResponses(formId);
    }, [formId]);

    console.log(allResponses);
  return (
      <div
        className={cn("h-full w-full flex justify-center items-center")}
      >AllResponsesPage</div>
  )
}
