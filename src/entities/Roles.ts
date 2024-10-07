import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permisosopciones } from "./Permisosopciones";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { Usuarios } from "./Usuarios";

@Index("roles_pkey", ["id"], { unique: true })
@Entity("roles", { schema: "public" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 255 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(() => Permisosopciones, (permisosopciones) => permisosopciones.rol)
  permisosopciones: Permisosopciones[];

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.roles
  )
  @JoinColumn([{ name: "empresa_id", referencedColumnName: "id" }])
  empresa: EmpresasInformacion;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.role)
  usuarios: Usuarios[];
}
