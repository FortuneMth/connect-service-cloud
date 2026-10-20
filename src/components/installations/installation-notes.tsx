"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { InstallationRecord } from "@/data/installations";

const fieldClass =
  "h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function InstallationNotes({
  installation,
  onAdd,
}: {
  installation: InstallationRecord;
  onAdd: (body: string) => void;
}) {
  const [body, setBody] = useState("");

  return (
    <section id="installation-notes" className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-medium">Internal installation notes</h2>
      <p className="mt-1 text-xs text-muted-foreground">Visible to the operations team. These notes stay off the customer record.</p>
      <ul className="mt-3 flex flex-col gap-2">
        {installation.notes.length === 0 ? <li className="text-sm text-muted-foreground">No internal notes yet.</li> : null}
        {installation.notes.map((note) => (
          <li key={note.id} className="rounded-lg border px-3 py-2 text-sm">
            <p>{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note.actorName} · {note.occurredLabel}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!body.trim()) return;
          onAdd(body.trim());
          setBody("");
        }}
      >
        <Label htmlFor="installation-note">Add note</Label>
        <textarea id="installation-note" className={fieldClass} value={body} onChange={(event) => setBody(event.target.value)} />
        <div className="flex justify-end">
          <Button type="submit" size="sm">Add Note</Button>
        </div>
      </form>
    </section>
  );
}
