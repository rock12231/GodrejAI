import { Injectable } from '@angular/core';
import Swal,{ SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertService {

  constructor() { }

  showToast(
    title: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success',
    position: 'top' | 'top-end' | 'top-start' | 'center' | 'center-end' | 'center-start' | 'bottom' | 'bottom-end' | 'bottom-start' = 'top-end',
    timer: number = 3000,
    backgroundColor?: string
  ) {
    Swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      toast: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        popup: 'custom-toast'
      },
      background: backgroundColor || '#4FD675 !important',
      color: '#fff !important',
      
    });
  }

}
