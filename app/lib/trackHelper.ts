export class Date24 {
    hours: string;
    minutes: string;
    t24: string;
    constructor(t24?: number | string) {
        if (!t24) {
            const curDate = new Date(); //document._spoofDay ? new Date(document._spoofDay) : new Date();
            const hours = curDate.getHours();
            const minutes = curDate.getMinutes();
            this.hours = ("0" + hours).slice(-2);
            this.minutes = ("0" + minutes).slice(-2);
            this.t24 = this.hours + this.minutes;
            return this;
        }
        this.minutes = t24.toString().slice(-2).padStart(2, "0");
        this.hours = t24.toString().replace(this.minutes, "").padStart(2, "0");
        this.t24 = this.hours + this.minutes;
        return this
    }
    toString() {
        return this.t24.toString();
    }
    toInt() {
        return parseInt(this.t24);
    }
    toTimeHourObject() {
        const curTimeLengh = this.t24.length == 3 ? 1 : 2;
        const hours = parseInt(this.t24.substring(0, curTimeLengh), 10);
        const minutes = parseInt(this.t24.substring(curTimeLengh), 10);

        return { hours: this.toInt() < 100 ? 0 : hours, minutes: minutes };
    }
}

export function getCurrentLsn(timeList: Array<string>, curTime: number) {
    let curLessont24: any = -Infinity;
    timeList.forEach((lsnStartTime) => {
        const intTime = new Date24(lsnStartTime).toInt();
        const _beforeNow = curTime < intTime;
        const _lastSavedisLess = curLessont24 < intTime;
        const _default = curLessont24 == -Infinity;
        if (_beforeNow && _lastSavedisLess && _default) curLessont24 = new Date24(intTime);
    });
    return curLessont24 == -Infinity ? null : curLessont24;
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