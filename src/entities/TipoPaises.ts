import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tipo_paises_pkey", ["id"], { unique: true })
@Entity("tipo_paises", { schema: "public" })
export class TipoPaises {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 100 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;
}
