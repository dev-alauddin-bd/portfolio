import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, excerpt, coverImage, tags } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const newBlog = {
      title: title || "Untitled Blog",
      content,
      excerpt: excerpt || content.replace(/<[^>]+>/g, "").slice(0, 150) + "...",
      coverImage: coverImage || null,
      tags: tags || [],
      date: new Date().toISOString(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      blog: { ...newBlog, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
