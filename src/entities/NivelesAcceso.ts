import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoUsuario } from "./TipoUsuario";

@Index("niveles_acceso_pkey", ["id"], { unique: true })
@Entity("niveles_acceso", { schema: "public" })
export class NivelesAcceso {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 50 })
  descripcion: string;

  @OneToMany(() => TipoUsuario, (tipoUsuario) => tipoUsuario.nivel)
  tipoUsuarios: TipoUsuario[];
}
