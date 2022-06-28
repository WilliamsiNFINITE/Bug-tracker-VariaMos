import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Bug } from './Bug';
  import { User } from './User';
  
  @Entity({ name: 'assignedAdmins' })
  export class AssignedAdmins extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Bug, (bug) => bug)
    @JoinColumn({ name: 'bugId' })
    bug: Bug;
    @Column()
    bugId: string;
  
    @ManyToOne(() => User, (user) => user)
    @JoinColumn({ name: 'adminId' })
    admin: User;
    @Column()
    adminId: string;
  
    @CreateDateColumn()
    joinedAt: Date;
  }