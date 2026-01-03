import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import matriculaModel from "@/models/matricula";

// 👇 IMPORTA SÓ PRA REGISTRAR NO MONGOOSE
import "@/models/user";
import "@/models/curso";

export async function POST(request: NextRequest) {
    try {
        await db();

        const body = await request.json();
        const { userId, cursoId } = body;

        const exists = await matriculaModel.findOne({ userId, cursoId });

        if (exists) {
            return NextResponse.json(
                { message: "Já existe matrícula" },
                { status: 400 }
            );
        }

        const nova = await matriculaModel.create({ userId, cursoId });

        return NextResponse.json(
            { matricula: nova },
            { status: 201 }
        );

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await db();

        const all = await matriculaModel
            .find()
            .populate("userId", "name email")
            .populate("cursoId", "titulo");

        return NextResponse.json(
            { matriculas: all },
            { status: 200 }
        );

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Erro" }, { status: 500 });
    }
}
