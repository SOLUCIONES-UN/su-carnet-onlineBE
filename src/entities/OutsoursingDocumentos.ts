import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasDocumentos } from "./EmpresasDocumentos";
import { OutsoursingInformacion } from "./OutsoursingInformacion";

@Index("outsoursing_documentos_pkey", ["id"], { unique: true })
@Entity("outsoursing_documentos", { schema: "public" })
export class OutsoursingDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", nullable: true, default: () => "1" })
  estado: number | null;

  @ManyToOne(
    () => EmpresasDocumentos,
    (empresasDocumentos) => empresasDocumentos.outsoursingDocumentos
  )
  @JoinColumn([{ name: "id_documento", referencedColumnName: "id" }])
  idDocumento: EmpresasDocumentos;

  @ManyToOne(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.outsoursingDocumentos
  )
  @JoinColumn([{ name: "id_outsoursing", referencedColumnName: "id" }])
  idOutsoursing: OutsoursingInformacion;
}
