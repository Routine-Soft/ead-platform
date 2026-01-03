import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import matriculaModel from "@/models/matricula";

export async function PATCH(
    _: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params;

        const update = await matriculaModel.findByIdAndUpdate(
            id,
            { status: "aprovado" },
            { new: true }
        );

        return NextResponse.json({ matricula: update }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
