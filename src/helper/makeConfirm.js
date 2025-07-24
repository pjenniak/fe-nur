import Swal from "sweetalert2";
import { makeToast } from "./makeToast";

export const makeConfirm = async(
  callback,
  onAbort
) => {
  return await Swal.fire({
    title: "Konfirmasi Aksi",
    text: "Apakah anda yakin untuk melakukan ini?",
    icon: "warning",
    showCloseButton: true,
    customClass: {
      container: "z-[1000000]",
    },
    showCancelButton: true,
    confirmButtonColor: "#0059ff",
    cancelButtonColor: "#d33",
    confirmButtonText: "Konfirmasi",
  }).then(async (result) => {
    if (result.isConfirmed) {
      makeToast("info");
      return await callback?.();
    } else {
      await onAbort?.();
      throw new Error("Aksi dibatalkan");
    }
  });
};
