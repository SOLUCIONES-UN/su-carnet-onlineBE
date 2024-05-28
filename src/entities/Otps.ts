import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("otps_pkey", ["id"], { unique: true })
@Entity("otps", { schema: "public" })
export class Otps {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "codigo", length: 10 })
  codigo: string;

  @Column("character varying", { name: "correo", length: 50 })
  correo: string;

  @Column("timestamp without time zone", { name: "fechacreacion" })
  fechacreacion: Date;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;
}
