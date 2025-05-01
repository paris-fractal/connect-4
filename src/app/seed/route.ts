import { setupGameState } from "../db";

export async function GET() {
  try {
    setupGameState()

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
