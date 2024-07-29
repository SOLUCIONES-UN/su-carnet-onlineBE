import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
import { SucursalesDocumentos } from "./SucursalesDocumentos";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { UsuariosRelacionEmpresas } from "./UsuariosRelacionEmpresas";

@Index("sucursales_informacion_pkey", ["id"], { unique: true })
@Entity("sucursales_informacion", { schema: "public" })
export class SucursalesInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("character varying", { name: "direccion", length: 100 })
  direccion: string;

  @Column("character varying", {
    name: "informacion_general",
    nullable: true,
    length: 250,
  })
  informacionGeneral: string | null;

  @Column("character varying", {
    name: "archivo_imagen1",
    nullable: true,
    length: 250,
  })
  archivoImagen1: string | null;

  @Column("character varying", {
    name: "archivo_imagen2",
    nullable: true,
    length: 250,
  })
  archivoImagen2: string | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", { name: "latitud", nullable: true, length: 15 })
  latitud: string | null;

  @Column("character varying", { name: "longitud", nullable: true, length: 15 })
  longitud: string | null;

  @OneToMany(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) => sucursalesAreasInformacion.idSucursal
  )
  sucursalesAreasInformacions: SucursalesAreasInformacion[];

  @OneToMany(
    () => SucursalesDocumentos,
    (sucursalesDocumentos) => sucursalesDocumentos.idSucursal
  )
  sucursalesDocumentos: SucursalesDocumentos[];

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.sucursalesInformacions
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @OneToMany(
    () => UsuariosRelacionEmpresas,
    (usuariosRelacionEmpresas) => usuariosRelacionEmpresas.idSucursal
  )
  usuariosRelacionEmpresas: UsuariosRelacionEmpresas[];
}
