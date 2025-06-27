import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Note } from "./entity/Note";

const app = express();
app.use(express.json());

// Health check
app.get("/", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

// List notes
app.get("/notes", async (_: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Note);
  const notes = await repo.find({ order: { reminderTime: "DESC", createdAt: "DESC" } });
  res.json(notes);
});

// Add note
app.post("/notes", async (req: Request, res: Response) => {
  const { content, reminderTime } = req.body;
  if (!content) return res.status(400).json({ error: "Missing content" });
  const repo = AppDataSource.getRepository(Note);
  const note = repo.create({ content, reminderTime });
  await repo.save(note);
  res.status(201).json(note);
});

// Delete note
app.delete("/notes/:id", async (req: Request<{ id: string }>, res: Response) => {
  const repo = AppDataSource.getRepository(Note);
  const note = await repo.findOneBy({ id: +req.params.id });
  if (!note) return res.status(404).json({ error: "Not found" });
  await repo.remove(note);
  res.json({ deleted: true });
});

const PORT = process.env.PORT || 3001;
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
});

