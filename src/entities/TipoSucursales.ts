import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesInformacion } from "./SucursalesInformacion";

@Index("tipo_sucursales_pkey", ["id"], { unique: true })
@Entity("tipo_sucursales", { schema: "public" })
export class TipoSucursales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.tipoSucursal
  )
  sucursalesInformacions: SucursalesInformacion[];
}
