import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroInformacion } from "./RegistroInformacion";
import { TarjetaPresentacion } from "./TarjetaPresentacion";

@Index("tarjetascompartidas_pkey", ["id"], { unique: true })
@Entity("tarjetascompartidas", { schema: "public" })
export class Tarjetascompartidas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.tarjetascompartidas
  )
  @JoinColumn([{ name: "idRegistroInformacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;

  @ManyToOne(
    () => TarjetaPresentacion,
    (tarjetaPresentacion) => tarjetaPresentacion.tarjetascompartidas
  )
  @JoinColumn([{ name: "idtarjetaleida", referencedColumnName: "id" }])
  idtarjetaleida: TarjetaPresentacion;
}
