import { error } from "console";
import {NextRequest, NextResponse} from "next/server";

interface ManufacturedYearRequest {
    car_brand: string;
    car_model: string;
}

interface ManufacturedYearResult {
    year_start?: number;
    year_end?: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: ManufacturedYearRequest = await request.json();

        if (!body.car_brand || !body.car_model) {
            return NextResponse.json({
                error: "car_brand and car_model are required fields"
            }, {status: 400});
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-manufactured-year-range`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "x-api-key": process.env.SSS_API_KEY || "",
            },
            body: JSON.stringify({
                car_brand: body.car_brand,
                car_model: body.car_model
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data: ManufacturedYearResult = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching manufactured year range:", error);
        return NextResponse.json(
            {error: "Failed to fetch manufactured year range", details: error.message},
            {status: 500}
        );
    }
}