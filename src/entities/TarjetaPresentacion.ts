import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { Usuarios } from "./Usuarios";
import { Tarjetascompartidas } from "./Tarjetascompartidas";

@Index("tarjeta_presentacion_pkey", ["id"], { unique: true })
@Entity("tarjeta_presentacion", { schema: "public" })
export class TarjetaPresentacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "img_fondo",
    nullable: true,
    length: 250,
  })
  imgFondo: string | null;

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

  @Column("character varying", {
    name: "telefono_oficina",
    nullable: true,
    length: 15,
  })
  telefonoOficina: string | null;

  @Column("character varying", {
    name: "telefono_movil",
    nullable: true,
    length: 15,
  })
  telefonoMovil: string | null;

  @Column("character varying", { name: "correo", nullable: true, length: 20 })
  correo: string | null;

  @Column("character varying", { name: "puesto", nullable: true, length: 50 })
  puesto: string | null;

  @Column("character varying", {
    name: "direccion",
    nullable: true,
    length: 50,
  })
  direccion: string | null;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.tarjetaPresentacions
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.tarjetaPresentacions)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;

  @OneToMany(
    () => Tarjetascompartidas,
    (tarjetascompartidas) => tarjetascompartidas.idtarjetaleida
  )
  tarjetascompartidas: Tarjetascompartidas[];
}
