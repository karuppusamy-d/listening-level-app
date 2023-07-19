import z, { ZodError } from "zod";
import { NextResponse } from "next/server";
import { handleZodError } from "@/utils/zod/handleZodError";
import { ApiErrorResponse } from "@/components/types/ApiErrorResponse";
import { noteSchema, noteWithIdSchema } from "@/utils/zod/noteSchema";
import { verify } from "jsonwebtoken";
import { UserJWT } from "@/components/types/user";
import { firestore, sendQuery } from "@/utils/firebase";
import { Note, NoteWithId } from "@/components/types/note";
import {
  addNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "@/utils/firebase/queries";

const JWT_SECRET = process.env.JWT_SECRET as string;

export type Params = z.infer<typeof noteSchema>;

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request);
    try {
      const [notes] = await sendQuery(getNotes(user.uid));
      return NextResponse.json(notes, { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUser(request);
    try {
      const note = noteSchema.parse(await request.json());
      try {
        const id = user.uid + "_" + Date.now();
        const noteWithId: NoteWithId = { ...note, id, uid: user.uid };

        await addNote(noteWithId);
        return NextResponse.json(noteWithId, { status: 200 });
      } catch (err: any) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 400 }
        );
      }
    } catch (err: any) {
      const res: ApiErrorResponse = handleZodError(err as ZodError);
      return NextResponse.json(res, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = getCurrentUser(request);
    try {
      const note = noteWithIdSchema.parse(await request.json());
      if (note.uid !== user.uid || note.id.split("_")[0] !== user.uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      try {
        await updateNote(note);
        return NextResponse.json(note, { status: 200 });
      } catch (err: any) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 400 }
        );
      }
    } catch (err: any) {
      const res: ApiErrorResponse = handleZodError(err as ZodError);
      return NextResponse.json(res, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getCurrentUser(request);
    try {
      const id = z.string().parse(request.headers.get("id"));
      try {
        if (id.split("_")[0] === user.uid) {
          await deleteNote(id);
          return NextResponse.json({ id }, { status: 200 });
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      } catch (err: any) {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 400 }
        );
      }
    } catch (err: any) {
      const res: ApiErrorResponse = handleZodError(err as ZodError);
      return NextResponse.json(res, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

function getCurrentUser(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.split(" ")[1];

  if (!(token.length > 0)) throw new Error("Invalid Token");

  const user = verify(token, JWT_SECRET) as UserJWT;

  if (!user.uid) throw new Error("Unauthorized");
  return user;
}
