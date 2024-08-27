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
import { RegistroAfiliaciones } from "./RegistroAfiliaciones";
import { RegistroColaboradores } from "./RegistroColaboradores";
import { RegistroInformacion } from "./RegistroInformacion";
import { TarjetaPresentacion } from "./TarjetaPresentacion";
import { TipoUsuario } from "./TipoUsuario";
import { UsuariosRelacionEmpresas } from "./UsuariosRelacionEmpresas";

@Index("usuarios_pkey", ["id"], { unique: true })
@Entity("usuarios", { schema: "public" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombres", length: 100 })
  nombres: string;

  @Column("character varying", { name: "apellidos", length: 100 })
  apellidos: string;

  @Column("character varying", { name: "email", length: 50 })
  email: string;

  @Column("character varying", { name: "telefono", length: 15 })
  telefono: string;

  @Column("bytea", { name: "passwordhash" })
  passwordhash: Buffer;

  @Column("bytea", { name: "passwordsalt" })
  passwordsalt: Buffer;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", {
    name: "foto_perfil",
    nullable: true,
    length: 250,
  })
  fotoPerfil: string | null;

  @OneToMany(() => Dispositivos, (dispositivos) => dispositivos.idusuario)
  dispositivos: Dispositivos[];

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

  @ManyToOne(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
  @JoinColumn([{ name: "id_tipo", referencedColumnName: "id" }])
  idTipo: TipoUsuario;

  @OneToMany(
    () => UsuariosRelacionEmpresas,
    (usuariosRelacionEmpresas) => usuariosRelacionEmpresas.idUsuario
  )
  usuariosRelacionEmpresas: UsuariosRelacionEmpresas[];
}
