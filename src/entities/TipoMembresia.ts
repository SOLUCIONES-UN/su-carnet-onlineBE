import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MembresiaInformacion } from "./MembresiaInformacion";

@Index("tipo_sucursales_pkey", ["id"], { unique: true })
@Entity("tipo_membresia", { schema: "public" })
export class TipoMembresia {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => MembresiaInformacion,
    (membresiaInformacion) => membresiaInformacion.tipoMembresia
  )
  membresiaInformacions: MembresiaInformacion[];
}
