import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { TipoMembresia } from "./TipoMembresia";
import { RegistroMembresia } from "./RegistroMembresia";
import { RegistroPasaporte } from "./RegistroPasaporte";

@Index("membresia_informacion_pkey", ["id"], { unique: true })
@Entity("membresia_informacion", { schema: "public" })
export class MembresiaInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "logo", length: 250 })
  logo: string;

  @Column("character varying", { name: "color_fondo", length: 250 })
  colorFondo: string;

  @Column("character varying", { name: "color_texto", length: 250 })
  colorTexto: string;

  @Column("integer", { name: "codigo_barra_o_qr" })
  codigoBarraOQr: number;

  @Column("character varying", { name: "nombre", length: 250 })
  nombre: string;

  @Column("integer", { name: "muestra_selfie" })
  muestraSelfie: number;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", { name: "imagen", length: 250 })
  imagen: string;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.membresiaInformacions
  )
  @JoinColumn([{ name: "empresaId", referencedColumnName: "id" }])
  empresa: EmpresasInformacion;

  @ManyToOne(
    () => TipoMembresia,
    (tipoMembresia) => tipoMembresia.membresiaInformacions
  )
  @JoinColumn([{ name: "tipo_membresiaId", referencedColumnName: "id" }])
  tipoMembresia: TipoMembresia;

  @OneToMany(
    () => RegistroMembresia,
    (registroMembresia) => registroMembresia.idCaracteristicasSucursales
  )
  registroMembresias: RegistroMembresia[];

  @OneToMany(
    () => RegistroPasaporte,
    (registroPasaporte) => registroPasaporte.idCaracteristicasSucursales
  )
  registroPasaportes: RegistroPasaporte[];
}
