import { NextResponse } from "next/server";
import { getNotifications, getUnreadCount, markAllAsRead } from "@/lib/services/notification";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const unreadOnly = url.searchParams.get("unread") === "true";
    const countOnly = url.searchParams.get("count") === "true";

    if (countOnly) {
      const count = await getUnreadCount(userId);
      return NextResponse.json({ count });
    }

    const notifications = await getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    await markAllAsRead(userId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
