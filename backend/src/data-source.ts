import { DataSource } from "typeorm";
import { Note } from "./entity/Note";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "notes.db",
  entities: [Note],
  synchronize: false,
  migrations: [__dirname + "/migration/*.ts"],
  logging: false,
});

