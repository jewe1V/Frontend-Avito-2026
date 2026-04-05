import { Box, Typography, Paper, useTheme } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import type { Item } from '../../../shared/api/types';
import {formatLabel, formatValue} from "../../../utils.ts";

interface AdDetailsInfoProps {
    ad: Item & { needsRevision: boolean };
}

export const AdDetailsInfo = ({ ad }: AdDetailsInfoProps) => {
    const theme = useTheme();

    

    return (
        <Box>
            Box>
    );
};
