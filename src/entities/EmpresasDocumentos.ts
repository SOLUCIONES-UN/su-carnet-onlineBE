import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { TipoDocumentos } from "./TipoDocumentos";

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
}
