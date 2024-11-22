import { useState } from 'react';
import { notification } from 'antd';
const Reservation = () => {
  const handleReservation = () => {
    notification.info({
      message: 'Reservation',
      description: 'Reservation is not available yet!',
      showProgress: true,
      duration: 3,
    });
  };

  return (
    <li className="md:px-1">
      <a
        className="common_btn"
        href="#"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        onClick={handleReservation}
      >
        Reservation
      </a>
    </li>
  );
};

export default Reservation;
