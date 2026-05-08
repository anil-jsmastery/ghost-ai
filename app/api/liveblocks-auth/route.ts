import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getLiveblocks, getUserCursorColor } from "@/lib/liveblocks";
import { getProjectWithAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { room } = await request.json();
  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  const project = await getProjectWithAccess(room, user.id, email);
  if (!project) {
    return new NextResponse(null, { status: 403 });
  }

  const liveblocks = getLiveblocks();

  await liveblocks.getOrCreateRoom(room, {
    defaultAccesses: ["room:write"],
  });

  const { status, body } = await liveblocks.identifyUser(
    { userId: user.id, groupIds: [] },
    {
      userInfo: {
        name: user.fullName ?? user.username ?? email,
        avatar: user.imageUrl,
        cursorColor: getUserCursorColor(user.id),
      },
    }
  );

  return new Response(body, { status });
}
