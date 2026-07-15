import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Same Prisma setup used in lib/prisma.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

// -----------------------------------------------------------------------------
// Replace this with a real booking ID from your Booking table
// -----------------------------------------------------------------------------
const BOOKING_ID = "0002a9c6-e5bb-40c3-a6c3-e32053780573";
// -----------------------------------------------------------------------------

const feedback = {
  summary:
    "The candidate demonstrated a strong overall performance throughout the mock interview. They communicated their thought process clearly, approached each question methodically, and remained composed under pressure. With continued practice on system design and optimization, they would be well prepared for software engineering interviews.",

  technical:
    "Showed a solid understanding of JavaScript, React fundamentals, data structures, and basic algorithms. Successfully solved most coding questions while explaining the reasoning behind each decision. Some optimization opportunities and edge cases were initially overlooked but corrected after discussion.",

  communication:
    "Excellent communication skills. The candidate explained ideas clearly, asked thoughtful clarifying questions, and maintained a structured problem-solving approach throughout the interview.",

  problemSolving:
    "Strong analytical thinking and logical reasoning. Problems were broken into smaller steps before implementation. Additional practice with advanced algorithmic patterns and large-scale system design would further strengthen interview performance.",

  recommendation:
    "Overall, this was a strong mock interview. Continue practicing system design, optimization techniques, and behavioral storytelling. With consistent interview practice, the candidate is well positioned for software engineering internship and new graduate opportunities.",

  strengths: [
    "Clear communication",
    "Logical problem solving",
    "Strong JavaScript fundamentals",
    "Well-structured coding approach",
  ],

  improvements: [
    "System design experience",
    "Algorithm optimization",
    "Behavioral interview examples",
    "Edge case analysis",
  ],

  overallRating: "GOOD", // POOR | AVERAGE | GOOD | EXCELLENT

  sessionRating: 4,

  sessionComment:
    "Very productive mock interview. The candidate demonstrated strong potential and was receptive to feedback. I would recommend scheduling another mock interview after additional practice."
};

async function main() {
  const booking = await db.booking.findUnique({
    where: {
      id: BOOKING_ID,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking) {
    throw new Error(`No booking found with ID: ${BOOKING_ID}`);
  }

  const existingFeedback = await db.feedback.findUnique({
    where: {
      bookingId: BOOKING_ID,
    },
  });

  if (existingFeedback) {
    throw new Error(
      `Feedback already exists for booking: ${BOOKING_ID}`
    );
  }

  await db.$transaction([
    db.feedback.create({
      data: {
        bookingId: BOOKING_ID,
        ...feedback,
      },
    }),

    db.booking.update({
      where: {
        id: BOOKING_ID,
      },
      data: {
        status: "COMPLETED",
      },
    }),
  ]);

  console.log(`✅ Feedback created for booking ${BOOKING_ID}`);
  console.log(`✅ Booking marked as COMPLETED`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });