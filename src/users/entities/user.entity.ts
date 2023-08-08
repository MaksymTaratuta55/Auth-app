import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permissions.type';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiKey } from '../api-keys/entities/api-key.entity';
// import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinTable()
  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  // @Column({ enum: Role, default: Role.Regular })
  // role: Role;
  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}
