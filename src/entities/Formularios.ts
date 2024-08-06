import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("formularios_pkey", ["id"], { unique: true })
@Entity("formularios", { schema: "public" })
export class Formularios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "descripcion",
    nullable: true,
    length: 250,
  })
  descripcion: string | null;

  @Column("integer", { name: "tipoform", nullable: true })
  tipoform: number | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", {
    name: "identificador",
    nullable: true,
    length: 4,
  })
  identificador: string | null;
}
