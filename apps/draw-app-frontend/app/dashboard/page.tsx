"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken, getRooms, createRoom, removeToken } from "@/lib/api";
import type { Room } from "@/types";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/card";
import { Pencil, LayoutDashboard, LogOut, Plus, Loader2, AlertCircle, Sparkles, Home } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }
    let cancelled = false;
    getRooms()
      .then((data) => {
        if (!cancelled) setRooms(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load rooms");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (name.length < 3 || name.length > 20) {
      setCreateError("Room name must be 3–20 characters");
      return;
    }
    setCreateError(null);
    setCreating(true);
    try {
      const { roomId } = await createRoom(name);
      router.push(`/canvas/${roomId}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.replace("/");
  };

  if (!getToken()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden">
       
        <div className="container relative mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Your rooms and canvas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" className="border-2 px-4" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-10 bg-muted/30 flex-1 min-h-[calc(100vh-64px)]" style={{ minHeight: "calc(100vh - 72px)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {error && (
            <div className="mb-8 p-4 rounded-lg bg-destructive/10 border-2 border-destructive/20 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : rooms.length === 0 ? (
            <Card className="max-w-xl mx-auto border-2">
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 p-4 rounded-xl bg-primary/10 w-fit">
                  <Pencil className="h-10 w-10 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-lg">No rooms yet</p>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  Create your first room above to start drawing and collaborating.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Link key={room.id} href={`/canvas/${room.id}`}>
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                        <Pencil className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="truncate">{room.slug}</CardTitle>
                      <CardDescription>
                        Created {new Date(room.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary inline-flex items-center gap-1.5">
                        Open canvas
                        <Pencil className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 Collaborative Draw App. All rights reserved.
            </p>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
