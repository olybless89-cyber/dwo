import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { UpdateUserBody } from "@workspace/api-zod";

const router: IRouter = Router();

function toPublicUser(u: typeof usersTable.$inferSelect) {
  const { passwordHash: _, ...pub } = u;
  return pub;
}

router.get("/users", async (req, res): Promise<void> => {
  const { search, status, role } = req.query as Record<string, string | undefined>;

  let query = db.select().from(usersTable).$dynamic();

  if (search) {
    query = query.where(
      or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
      ),
    );
  } else if (status) {
    query = query.where(eq(usersTable.status, status));
  } else if (role) {
    query = query.where(eq(usersTable.role, role));
  }

  const users = await query.orderBy(usersTable.createdAt);
  res.json(users.map(toPublicUser));
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(toPublicUser(user));
});

router.patch("/users/:userId", async (req, res): Promise<void> => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (parsed.data.role !== undefined) updates.role = parsed.data.role;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.balance !== undefined) updates.balance = parsed.data.balance;
  if (parsed.data.rewardPoints !== undefined) updates.rewardPoints = parsed.data.rewardPoints;

  const [user] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, userId))
    .returning();

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  req.log.info({ userId }, "User updated");
  res.json(toPublicUser(user));
});

export default router;
