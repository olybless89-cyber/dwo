import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db, ordersTable, usersTable } from "@workspace/db";
import { CreateOrderBody, UpdateOrderBody } from "@workspace/api-zod";
import { JWT_SECRET } from "./auth";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../lib/email";

const router: IRouter = Router();

async function getUserFromReq(req: any): Promise<string | null> {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}

router.get("/orders", async (req, res): Promise<void> => {
  const { search, status, userId } = req.query as Record<string, string | undefined>;

  let query = db.select().from(ordersTable).$dynamic();

  if (search) {
    query = query.where(
      or(
        ilike(ordersTable.userEmail, `%${search}%`),
        ilike(ordersTable.description, `%${search}%`),
        ilike(ordersTable.userName, `%${search}%`),
      ),
    );
  } else if (status) {
    query = query.where(eq(ordersTable.status, status));
  } else if (userId) {
    query = query.where(eq(ordersTable.userId, userId));
  }

  const orders = await query.orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.post("/orders", async (req, res): Promise<void> => {
  const actingUserId = await getUserFromReq(req);
  if (!actingUserId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, actingUserId));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const id = crypto.randomUUID();
  const [order] = await db.insert(ordersTable).values({
    id,
    userId: user.id,
    userEmail: user.email,
    userName: `${user.firstName} ${user.lastName}`,
    type: parsed.data.type,
    description: parsed.data.description,
    amount: parsed.data.amount,
    status: "pending",
  }).returning();

  req.log.info({ orderId: id }, "Order created");

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail({
    email: user.email,
    firstName: user.firstName,
    type: parsed.data.type,
    description: parsed.data.description,
    amount: parsed.data.amount,
  }).catch(() => {});

  res.status(201).json(order);
});

router.get("/orders/:orderId", async (req, res): Promise<void> => {
  const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(order);
});

router.patch("/orders/:orderId", async (req, res): Promise<void> => {
  const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, orderId))
    .returning();

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  req.log.info({ orderId }, "Order updated");

  // Send status email when confirmed or cancelled (non-blocking)
  if (parsed.data.status === "confirmed" || parsed.data.status === "cancelled") {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId));
    if (user) {
      sendOrderStatusEmail({
        email: user.email,
        firstName: user.firstName,
        type: order.type,
        description: order.description,
        amount: order.amount,
        status: parsed.data.status === "confirmed" ? "approved" : "rejected",
      }).catch(() => {});
    }
  }

  res.json(order);
});

export default router;
