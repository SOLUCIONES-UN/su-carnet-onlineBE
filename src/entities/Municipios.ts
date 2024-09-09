import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Departamentos } from "./Departamentos";
import { RegistroInformacion } from "./RegistroInformacion";

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

  @Column("character varying", {
    name: "codigoMunicipio",
    nullable: true,
    length: 10,
  })
  codigoMunicipio: string | null;

  @ManyToOne(() => Departamentos, (departamentos) => departamentos.municipios)
  @JoinColumn([{ name: "iddepartamento", referencedColumnName: "id" }])
  iddepartamento: Departamentos;

  @OneToMany(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.idMunicipio
  )
  registroInformacions: RegistroInformacion[];
}
