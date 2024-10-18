import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumentos } from "./TipoDocumentos";
import { EventosEmpresa } from "./EventosEmpresa";

@Index("archivos_eventos_pkey", ["idArchivo"], { unique: true })
@Entity("archivos_eventos", { schema: "public" })
export class ArchivosEventos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_archivo" })
  idArchivo: number;

  @ManyToOne(
    () => TipoDocumentos,
    (tipoDocumentos) => tipoDocumentos.archivosEventos
  )
  @JoinColumn([{ name: "id_documento", referencedColumnName: "id" }])
  idDocumento: TipoDocumentos;

  @ManyToOne(
    () => EventosEmpresa,
    (eventosEmpresa) => eventosEmpresa.archivosEventos
  )
  @JoinColumn([{ name: "id_evento", referencedColumnName: "idEvento" }])
  idEvento: EventosEmpresa;
}
