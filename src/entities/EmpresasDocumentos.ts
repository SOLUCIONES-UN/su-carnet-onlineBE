import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { TipoDocumentos } from "./TipoDocumentos";
import { OutsoursingDocumentos } from "./OutsoursingDocumentos";

@Index("empresas_documentos_pkey", ["id"], { unique: true })
@Entity("empresas_documentos", { schema: "public" })
export class EmpresasDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.empresasDocumentos
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(
    () => TipoDocumentos,
    (tipoDocumentos) => tipoDocumentos.empresasDocumentos
  )
  @JoinColumn([{ name: "id_tipo_documento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumentos;

  @OneToMany(
    () => OutsoursingDocumentos,
    (outsoursingDocumentos) => outsoursingDocumentos.idDocumento
  )
  outsoursingDocumentos: OutsoursingDocumentos[];
}
