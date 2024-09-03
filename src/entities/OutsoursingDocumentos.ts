import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroDocumentos } from "./RegistroDocumentos";
import { OutsoursingInformacion } from "./OutsoursingInformacion";

@Index("outsoursing_documentos_pkey", ["id"], { unique: true })
@Entity("outsoursing_documentos", { schema: "public" })
export class OutsoursingDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", nullable: true, default: () => "1" })
  estado: number | null;

  @ManyToOne(
    () => RegistroDocumentos,
    (registroDocumentos) => registroDocumentos.outsoursingDocumentos
  )
  @JoinColumn([{ name: "id_documento", referencedColumnName: "id" }])
  idDocumento: RegistroDocumentos;

  @ManyToOne(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.outsoursingDocumentos
  )
  @JoinColumn([{ name: "id_outsoursing", referencedColumnName: "id" }])
  idOutsoursing: OutsoursingInformacion;
}
