import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroMembresia } from "./RegistroMembresia";
import { RegistroPasaporte } from "./RegistroPasaporte";

@Index("caracteristicas_sucursales_pkey", ["id"], { unique: true })
@Entity("caracteristicas_sucursales", { schema: "public" })
export class CaracteristicasSucursales {
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

  @Column("character varying", { name: "nombre", nullable: true, length: 250 })
  nombre: string | null;

  @Column("integer", { name: "usa_selfie" })
  usaSelfie: number;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

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
