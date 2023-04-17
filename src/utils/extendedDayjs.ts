import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export default dayjs;
