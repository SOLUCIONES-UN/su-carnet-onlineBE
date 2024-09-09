import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingAfiliaciones } from "./OutsoursingAfiliaciones";
import { RegistroDispositivos } from "./RegistroDispositivos";
import { RegistroDocumentos } from "./RegistroDocumentos";
import { Municipios } from "./Municipios";
import { Usuarios } from "./Usuarios";
import { RegistroMembresia } from "./RegistroMembresia";
import { RegistroMensajes } from "./RegistroMensajes";
import { SucursalesAreasPermisos } from "./SucursalesAreasPermisos";

@Index("registro_informacion_pkey", ["id"], { unique: true })
@Entity("registro_informacion", { schema: "public" })
export class RegistroInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "documento",
    nullable: true,
    length: 20,
  })
  documento: string | null;

  @Column("character varying", { name: "nombres", nullable: true, length: 50 })
  nombres: string | null;

  @Column("character varying", {
    name: "apellidos",
    nullable: true,
    length: 50,
  })
  apellidos: string | null;

  @Column("date", { name: "fecha_nacimiento", nullable: true })
  fechaNacimiento: string | null;

  @Column("character varying", { name: "telefono", nullable: true, length: 15 })
  telefono: string | null;

  @Column("character varying", { name: "correo", nullable: true, length: 50 })
  correo: string | null;

  @Column("character varying", {
    name: "contacto_emergencia_nombre",
    nullable: true,
    length: 250,
  })
  contactoEmergenciaNombre: string | null;

  @Column("character varying", {
    name: "contacto_emergencia_telefono",
    nullable: true,
    length: 250,
  })
  contactoEmergenciaTelefono: string | null;

  @Column("character varying", { name: "estado", nullable: true, length: 10 })
  estado: string | null;

  @Column("character varying", {
    name: "direccionRecidencia",
    nullable: true,
    length: 100,
  })
  direccionRecidencia: string | null;

  @Column("character varying", { name: "genero", nullable: true, length: 10 })
  genero: string | null;

  @OneToMany(
    () => OutsoursingAfiliaciones,
    (outsoursingAfiliaciones) => outsoursingAfiliaciones.idRegistroInformacion
  )
  outsoursingAfiliaciones: OutsoursingAfiliaciones[];

  @OneToMany(
    () => RegistroDispositivos,
    (registroDispositivos) => registroDispositivos.idRegistroInformacion
  )
  registroDispositivos: RegistroDispositivos[];

  @OneToMany(
    () => RegistroDocumentos,
    (registroDocumentos) => registroDocumentos.idRegistroInformacion
  )
  registroDocumentos: RegistroDocumentos[];

  @ManyToOne(() => Municipios, (municipios) => municipios.registroInformacions)
  @JoinColumn([{ name: "idMunicipio", referencedColumnName: "id" }])
  idMunicipio: Municipios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.registroInformacions)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;

  @OneToMany(
    () => RegistroMembresia,
    (registroMembresia) => registroMembresia.registroInformacion
  )
  registroMembresias: RegistroMembresia[];

  @OneToMany(
    () => RegistroMensajes,
    (registroMensajes) => registroMensajes.idRegistroInformacion
  )
  registroMensajes: RegistroMensajes[];

  @OneToMany(
    () => SucursalesAreasPermisos,
    (sucursalesAreasPermisos) => sucursalesAreasPermisos.idRegistro
  )
  sucursalesAreasPermisos: SucursalesAreasPermisos[];
}
