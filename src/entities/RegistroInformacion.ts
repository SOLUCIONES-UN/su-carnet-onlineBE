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
import { TipoPaises } from "./TipoPaises";
import { Usuarios } from "./Usuarios";
import { RegistroMensajes } from "./RegistroMensajes";
import { SucursalesAreasPermisos } from "./SucursalesAreasPermisos";

@Index("registro_informacion_pkey", ["id"], { unique: true })
@Entity("registro_informacion", { schema: "public" })
export class RegistroInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "documento" })
  documento: string;

  @Column("character varying", { name: "nombres" })
  nombres: string;

  @Column("character varying", { name: "apellidos" })
  apellidos: string;

  @Column("date", { name: "fecha_nacimiento" })
  fechaNacimiento: string;

  @Column("character varying", { name: "telefono" })
  telefono: string;

  @Column("character varying", { name: "correo" })
  correo: string;

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

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

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

  @ManyToOne(() => TipoPaises, (tipoPaises) => tipoPaises.registroInformacions)
  @JoinColumn([{ name: "id_pais", referencedColumnName: "id" }])
  idPais: TipoPaises;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.registroInformacions)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;

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
