import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { TaskGroup } from "./TaskGroup";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({ nullable: true })
  deadline?: Date;

  @ManyToOne(() => User, user => user.tasks)
  user!: User;

  @ManyToOne(() => TaskGroup, group => group.tasks, { nullable: true })
  group?: TaskGroup;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 