import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NivelesAcceso } from "./NivelesAcceso";
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

  @ManyToOne(() => NivelesAcceso, (nivelesAcceso) => nivelesAcceso.tipoUsuarios)
  @JoinColumn([{ name: "nivel_id", referencedColumnName: "id" }])
  nivel: NivelesAcceso;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.idTipo)
  usuarios: Usuarios[];
}
