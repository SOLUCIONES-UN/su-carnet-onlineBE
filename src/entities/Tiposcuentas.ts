import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tiposcuentas_pkey", ["id"], { unique: true })
@Entity("tiposcuentas", { schema: "public" })
export class Tiposcuentas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 40 })
  descripcion: string;

  @Column("numeric", { name: "precio", precision: 10, scale: 2 })
  precio: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;
}
