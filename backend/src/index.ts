import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Note } from "./entity/Note";

const app = express();
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// List notes
app.get("/notes", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Note);
    const notes = await repo.find({ order: { reminderTime: "DESC", createdAt: "DESC" } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add note
app.post("/notes", async (req: Request, res: Response) => {
  try {
    const { content, reminderTime } = req.body;
    if (!content) return res.status(400).json({ error: "Missing content" });
    const repo = AppDataSource.getRepository(Note);
    const note = repo.create({ content, reminderTime });
    await repo.save(note);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete note
app.delete("/notes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Note);
    const note = await repo.findOneBy({ id: +req.params.id });
    if (!note) return res.status(404).json({ error: "Not found" });
    await repo.remove(note);
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
});

