import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingPurchase) {
  return new NextResponse("Alredy enrolled", { status: 400 });
}

await prisma.purchase.create({
  data: {
    userId,
    courseId,
    price: 0, // Ajustable si necesitas calcular o registrar otro valor
  },
});

return new NextResponse("Enrolled", { status: 200 });
  } catch (error) {
    console.error("[COURSE_ENROLL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}