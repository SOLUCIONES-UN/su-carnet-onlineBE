import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { Usuarios } from "./Usuarios";

@Index("tarjeta_presentacion_pkey", ["id"], { unique: true })
@Entity("tarjeta_presentacion", { schema: "public" })
export class TarjetaPresentacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "logo", length: 250 })
  logo: string;

  @Column("character varying", {
    name: "linkedin",
    nullable: true,
    length: 100,
  })
  linkedin: string | null;

  @Column("character varying", {
    name: "facebook",
    nullable: true,
    length: 100,
  })
  facebook: string | null;

  @Column("character varying", {
    name: "instagram",
    nullable: true,
    length: 100,
  })
  instagram: string | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.tarjetaPresentacions
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.tarjetaPresentacions)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;
}
