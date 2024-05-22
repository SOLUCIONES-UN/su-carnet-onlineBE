import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoUsuario } from "./TipoUsuario";

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

  @Column("bytea", { name: "passwordhash", select: false})
  passwordhash: Buffer;

  @Column("bytea", { name: "passwordsalt", select: false})
  passwordsalt: Buffer;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
  @JoinColumn([{ name: "id_tipo", referencedColumnName: "id" }])
  idTipo: TipoUsuario;

  @BeforeInsert()
  checkEmail() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailUpdate() {
   this.checkEmail();
  }
}
