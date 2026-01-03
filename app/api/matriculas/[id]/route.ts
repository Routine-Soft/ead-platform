import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import matriculaModel from '@/models/matricula';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await db();

    const { id } = await context.params;
    const { status } = await request.json();

    const matricula = await matriculaModel.findById(id);

    if (!matricula) {
        return NextResponse.json({ error: 'Matrícula não encontrada' }, { status: 404 });
    }

    matricula.status = status;
    await matricula.save();

    return NextResponse.json({ matricula }, { status: 200 });
}

// Deletar (se precisar)
export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await db();

    const { id } = await context.params;

    await matriculaModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Matrícula removida' }, { status: 200 });
    
}
