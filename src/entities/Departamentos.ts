import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoPaises } from "./TipoPaises";
import { Municipios } from "./Municipios";

@Index("departamentos_pkey", ["id"], { unique: true })
@Entity("departamentos", { schema: "public" })
export class Departamentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "descripcion",
    nullable: true,
    length: 100,
  })
  descripcion: string | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(() => TipoPaises, (tipoPaises) => tipoPaises.departamentos)
  @JoinColumn([{ name: "idpais", referencedColumnName: "id" }])
  idpais: TipoPaises;

  @OneToMany(() => Municipios, (municipios) => municipios.iddepartamento)
  municipios: Municipios[];
}
