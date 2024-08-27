import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Departamentos } from "./Departamentos";

@Index("municipios_pkey", ["id"], { unique: true })
@Entity("municipios", { schema: "public" })
export class Municipios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100,
  })
  description: string | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(() => Departamentos, (departamentos) => departamentos.municipios)
  @JoinColumn([{ name: "iddepartamento", referencedColumnName: "id" }])
  iddepartamento: Departamentos;
}
