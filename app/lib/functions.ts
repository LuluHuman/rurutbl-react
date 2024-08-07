export const alp = "xABCDEFGHI".split("");
export function getMidnightOffset(curDate: Date) {
    const _h = curDate.getHours() * 60 * 60 * 1000;
    const _m = curDate.getMinutes() * 60 * 1000;
    const _s = curDate.getSeconds() * 1000;
    const midnightOffset = _h + _m + _s;
    return midnightOffset
}

export function msToHM(duration: number) {
    const DateNow = new Date()
    const midnight = DateNow.getTime() - getMidnightOffset(DateNow);
    const startDate = new Date(midnight + duration);


    var hours = startDate.getHours();
    var minutes: string | number = startDate.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    const isPM = hours > 12;
    hours = isPM ? hours - 12 : hours;
    minutes = minutes == 0 ? "00" : minutes;

    return `${hours}:${minutes} ${isPM ? "PM" : "AM"}`;
}

export function getCurrentLsn(timeList: Array<string>, midOffset: number) {
    let curLessont24: any = -Infinity;
    timeList.forEach((lsnStartTime) => {
        const intTime = parseInt(lsnStartTime)
        const _beforeNow = midOffset < intTime;
        const _lastSavedisLess = curLessont24 < intTime;
        const _default = curLessont24 == -Infinity;
        if (_beforeNow && _lastSavedisLess && _default) curLessont24 = intTime
    });
    return curLessont24 == -Infinity ? null : curLessont24.toString();
}

export const defaultSettings = {
    class: {
        level: 3,
        class: 2,
    },
    Elec: {
        Sci: "Phy/Bio",
    },
}


export function locSubjInit(settings: typeof defaultSettings){
    return (Subject: string | null | string[]) => {
        Subject = typeof Subject == "string" || Subject == null ? Subject : Subject[0];
        switch (Subject) {
            case "{SciElec}":
                return settings.Elec.Sci || Subject;
            default:
                return Subject;
        }
    }   
}

export function ToDayStr(day: number) {
    const dayName = [
        { long: "Monday", short: "Mon" },
        { long: "Monday", short: "Mon" },
        { long: "Tuesday", short: "Tues" },
        { long: "Wednesday", short: "Wed" },
        { long: "Thursday", short: "Thurs" },
        { long: "Friday", short: "Fri" },
        { long: "Monday", short: "Mon" },
    ];
    return dayName[day];
}
