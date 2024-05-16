import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("test_pkey", ["id"], { unique: true })
@Entity("test", { schema: "public" })
export class Test {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombre", length: 255 })
  nombre: string;
}
