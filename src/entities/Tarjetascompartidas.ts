import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TarjetaPresentacion } from "./TarjetaPresentacion";
import { Usuarios } from "./Usuarios";

@Index("tarjetascompartidas_pkey", ["id"], { unique: true })
@Entity("tarjetascompartidas", { schema: "public" })
export class Tarjetascompartidas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => TarjetaPresentacion,
    (tarjetaPresentacion) => tarjetaPresentacion.tarjetascompartidas
  )
  @JoinColumn([{ name: "idtarjetaleida", referencedColumnName: "id" }])
  idtarjetaleida: TarjetaPresentacion;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.tarjetascompartidas)
  @JoinColumn([{ name: "idusuario", referencedColumnName: "id" }])
  idusuario: Usuarios;
}
