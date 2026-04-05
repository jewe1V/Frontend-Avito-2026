import { useParams } from "react-router-dom";
import { useGetAd } from '../model';
import { AdDetailsView } from './AdDetailsView';
import {useEffect} from "react";
export const AdDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { ad, loading, error } = useGetAd(id);
    useEffect(() => {
        document.title = ad?.title || "...";
    }, [document.title]);
    return <AdDetailsView id={id} ad={ad} loading={loading} error={error} />;
};
