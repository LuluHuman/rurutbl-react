import { type NextRequest } from 'next/server'


export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const semstartDate = new Date("2025-6-28"); //? Date shall be set every Saturday of the semester (2 Days before Mon)
    const currentDate = new Date();

    const _timeDifference = currentDate.getTime() - semstartDate.getTime();
    const weekNumber = Math.ceil(_timeDifference / millisecondsPerWeek);

    const HBLWeeks = [3, 8];
    // const HBLWeeks = [1] (week 4) (wait ONLY WEEK 1???)
    const isOdd = !HBLWeeks.includes(weekNumber);

    return Response.json({
        isOdd, weekNumber,
        countFromDate: semstartDate.getTime(),
        countToDate: currentDate.getTime(),
    })
}
