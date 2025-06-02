import moment from "moment";

export default function parseDateToIso8601String(date: Date) {
    return moment(date).format();
}
