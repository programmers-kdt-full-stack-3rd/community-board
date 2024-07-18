export const dateToStr = (date : Date, willShorten? : boolean) : string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (!willShorten) {
        return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    }

    const current = new Date();

    const currentYear = current.getFullYear();
    const currentMonth = String(current.getMonth() + 1).padStart(2, '0');
    const currentDay = String(current.getDate()).padStart(2, '0');

    if (currentYear === year) {
        if (currentMonth === month && currentDay === day) {
            return `${hours}:${minutes}:${seconds}`;
        } else {
            return `${month}.${day} ${hours}:${minutes}`;
        }
    } else {
        return `${year}.${month}.${day}`;
    }
};
