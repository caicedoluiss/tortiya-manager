// import { es } from "date-fns/locale/es";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type Props = {
    value: Date | null;
    onChange: (date: Date | null) => void;
    disablePast?: boolean;
    sx?: object;
};

export default function AppDatePicker({ value, onChange, sx, disablePast = false }: Props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Fecha"
                sx={sx}
                slotProps={{ textField: { size: "small" } }}
                value={value}
                onChange={(date) => onChange(date)}
                disablePast={disablePast}
                disableFuture
            />
        </LocalizationProvider>
    );
}
