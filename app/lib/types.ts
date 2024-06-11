import { Date24 } from "./trackHelper";

export type weekList = {
    [day in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: {
        [time: string]: string | null;
    };
};

export interface dayList {
    [key: string]: string | null;
}
export interface crowdedness {
    Recess: {
        [key: string]: {
            [key: string]: string[]
        }
    },
    Break: {
        [key: string]: {
            [key: string]: string[]
        }
    },
}

export interface TrackType {
    settings: {
        class: {
            level: string;
            class: string;
        };
        Elec: {
            Sci: string;
        };
    },
    dayList: dayList;
    active?: number;
    day: string
    canteenCrowdness: crowdedness;
}

// 

export type TrackComponent = {
    weekList: weekList;
    CurTime24: Date24;
}

export type CircProgressComponent = {
    weekList: weekList;
    CurTime24: Date24;
    curDate: Date;
}

export interface CircularProgressType {
    valuePercentage?: number;
    text: {
        title: string,
        subtitle: string,
        timeRemaining: string
    }
}

export interface ClientType {
    canteenCrowdness: object
    isOdd: boolean;
}