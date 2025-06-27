import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "datetime", nullable: true })
  reminderTime?: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}

