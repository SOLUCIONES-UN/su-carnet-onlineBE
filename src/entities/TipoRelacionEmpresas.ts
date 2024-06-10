import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingInformacion } from "./OutsoursingInformacion";

@Index("tipo_relacion_empresas_pkey", ["id"], { unique: true })
@Entity("tipo_relacion_empresas", { schema: "public" })
export class TipoRelacionEmpresas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @OneToMany(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.idTipoRelacion
  )
  outsoursingInformacions: OutsoursingInformacion[];
}
