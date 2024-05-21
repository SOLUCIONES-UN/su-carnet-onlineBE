import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("tipo_usuario_pkey", ["id"], { unique: true })
@Entity("tipo_usuario", { schema: "public" })
export class TipoUsuario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 50 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.idTipo)
  usuarios: Usuarios[];
}
