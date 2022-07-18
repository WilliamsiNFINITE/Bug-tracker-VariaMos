import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'inviteCodes' })
export class InviteCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  codeHash: string;

  @CreateDateColumn()
  joinedAt: Date;
}
