import { NextResponse } from "next/server";
import db from "@/database/db";
import matriculaModel from "@/models/matricula";

export async function GET() {
    try {
        await db();

        const pendentes = await matriculaModel
            .find({ status: "pendente" })
            .populate("userId", "name email")
            .populate("cursoId", "titulo");

        return NextResponse.json({ solicitacoes: pendentes }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
