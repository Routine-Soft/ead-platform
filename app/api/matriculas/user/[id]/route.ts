import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import matriculaModel from "@/models/matricula";

export async function GET(
    _: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params;

        const lista = await matriculaModel
            .find({ userId: id })
            .populate("cursoId", "titulo descricao");

        return NextResponse.json({ matriculas: lista }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
