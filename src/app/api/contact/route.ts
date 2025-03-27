import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Валідація на серверній стороні
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Всі поля мають бути заповнені' },
        { status: 400 }
      );
    }

    // Створення запису в базі даних
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Повідомлення успішно відправлено', contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
} 