import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingInformacion } from "./OutsoursingInformacion";
import { TipoServicios } from "./TipoServicios";

@Index("outsoursing_servicios_pkey", ["id"], { unique: true })
@Entity("outsoursing_servicios", { schema: "public" })
export class OutsoursingServicios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.outsoursingServicios
  )
  @JoinColumn([{ name: "id_outsoursing", referencedColumnName: "id" }])
  idOutsoursing: OutsoursingInformacion;

  @ManyToOne(
    () => TipoServicios,
    (tipoServicios) => tipoServicios.outsoursingServicios
  )
  @JoinColumn([{ name: "id_servicio", referencedColumnName: "id" }])
  idServicio: TipoServicios;
}
