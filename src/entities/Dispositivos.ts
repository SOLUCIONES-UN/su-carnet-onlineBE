import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("dispositivos_pkey", ["id"], { unique: true })
@Entity("dispositivos", { schema: "public" })
export class Dispositivos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "tokendispositivo" })
  tokendispositivo: string;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.dispositivos)
  @JoinColumn([{ name: "idusuario", referencedColumnName: "id" }])
  idusuario: Usuarios;
}
