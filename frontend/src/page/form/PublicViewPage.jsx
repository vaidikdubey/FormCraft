import { useFormStore } from "@/store/useFormStore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const PublicViewPage = () => {
    const { url } = useParams();

    const { formPublicView, getPublicView } = useFormStore();

    useEffect(() => {
        getPublicView(url);
    }, [url]);

    console.log(formPublicView);

    return <div>PublicViewPage</div>;
};
