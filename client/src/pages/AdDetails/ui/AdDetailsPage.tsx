import { useParams } from "react-router-dom";
import { useGetAd } from '../model/useGetAd';
import { AdDetailsView } from './AdDetailsView';

export const AdDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { ad, loading, error } = useGetAd(id);

    return <AdDetailsView id={id} ad={ad} loading={loading} error={error} />;
};
