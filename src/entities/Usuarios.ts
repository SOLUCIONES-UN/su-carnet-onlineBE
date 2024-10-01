import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dispositivos } from "./Dispositivos";
import { Notificaciones } from "./Notificaciones";
import { RegistroAfiliaciones } from "./RegistroAfiliaciones";
import { RegistroColaboradores } from "./RegistroColaboradores";
import { RegistroInformacion } from "./RegistroInformacion";
import { TarjetaPresentacion } from "./TarjetaPresentacion";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
import { TipoUsuario } from "./TipoUsuario";
import { Roles } from "./Roles";

@Index("usuarios_pkey", ["id"], { unique: true })
@Entity("usuarios", { schema: "public" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombres", length: 100 })
  nombres: string;

  @Column("character varying", { name: "apellidos", length: 100 })
  apellidos: string;

  @Column("character varying", { name: "email", nullable: true, length: 50 })
  email: string | null;

  @Column("character varying", { name: "telefono", nullable: true, length: 15 })
  telefono: string | null;

  @Column("bytea", { name: "passwordhash", nullable: true })
  passwordhash: Buffer | null;

  @Column("bytea", { name: "passwordsalt", nullable: true })
  passwordsalt: Buffer | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", {
    name: "foto_perfil",
    nullable: true,
    length: 250,
  })
  fotoPerfil: string | null;

  @Column("boolean", { name: "recibePush", nullable: true })
  recibePush: boolean | null;

  @OneToMany(() => Dispositivos, (dispositivos) => dispositivos.idusuario)
  dispositivos: Dispositivos[];

  @OneToMany(() => Notificaciones, (notificaciones) => notificaciones.idusuario)
  notificaciones: Notificaciones[];

  @OneToMany(
    () => RegistroAfiliaciones,
    (registroAfiliaciones) => registroAfiliaciones.idUsuario
  )
  registroAfiliaciones: RegistroAfiliaciones[];

  @OneToMany(
    () => RegistroColaboradores,
    (registroColaboradores) => registroColaboradores.idUsuario
  )
  registroColaboradores: RegistroColaboradores[];

  @OneToMany(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.idUsuario
  )
  registroInformacions: RegistroInformacion[];

  @OneToMany(
    () => TarjetaPresentacion,
    (tarjetaPresentacion) => tarjetaPresentacion.idUsuario
  )
  tarjetaPresentacions: TarjetaPresentacion[];

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) => sucursalesAreasInformacion.usuarios
  )
  @JoinColumn([{ name: "areaSucursal_id", referencedColumnName: "id" }])
  areaSucursal: SucursalesAreasInformacion;

  @ManyToOne(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
  @JoinColumn([{ name: "id_tipo", referencedColumnName: "id" }])
  idTipo: TipoUsuario;

  @ManyToOne(() => Roles, (roles) => roles.usuarios)
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;
}
