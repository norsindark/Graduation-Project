import React, { useState, useEffect } from 'react';
import { callGetOrderById } from '../../../../../services/clientApi';
import { RootState } from '../../../../../redux/store';
import { useSelector } from 'react-redux';

const TotalOrder = () => {
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
  });

  const user = useSelector((state: RootState) => state.account.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await callGetOrderById(
          userId || '',
          'pageNo=0&pageSize=100&sortBy=createdAt&sortDir=asc'
        );
        const orders = response.data._embedded.orderResponseList;

        const stats = orders.reduce(
          (acc: any, order: any) => {
            acc.total++;
            if (order.orderStatus === 'COMPLETED') {
              acc.completed++;
            } else if (order.orderStatus === 'CANCELLED') {
              acc.cancelled++;
            }
            return acc;
          },
          { total: 0, completed: 0, cancelled: 0 }
        );

        setOrderStats(stats);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="fp__dsahboard_overview">
      <div className="row">
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              total order <span>({orderStats.total})</span>
            </h4>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item green">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              Completed <span>({orderStats.completed})</span>
            </h4>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item red">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              cancel <span>({orderStats.cancelled})</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrder;
