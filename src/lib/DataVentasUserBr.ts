interface Props {
  selectUser: string;
  fechaSeleccionada: string;
  sector: string;
}
export default function DataVentasBrasil({fechaSeleccionada, selectUser, sector} : Props) {
    return {
        itemsSale: [],
        ventas: [],
        loading: false,
        error: null,
        premio: 0,
    }
}