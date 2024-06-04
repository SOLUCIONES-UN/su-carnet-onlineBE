import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoServicios } from "./TipoServicios";

@Index("tipo_categorias_servicios_pkey", ["id"], { unique: true })
@Entity("tipo_categorias_servicios", { schema: "public" })
export class TipoCategoriasServicios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 100 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(() => TipoServicios, (tipoServicios) => tipoServicios.idCategoria)
  tipoServicios: TipoServicios[];
}
