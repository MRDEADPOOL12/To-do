import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

  @OneToMany(() => TaskGroup, group => group.user)
  taskGroups!: TaskGroup[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 