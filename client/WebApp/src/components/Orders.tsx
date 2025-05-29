import { Box, Table, Typography } from "@mui/joy";
import { useMemo, useState } from "react";
import moment from "moment";
import type { Order } from "../types/Order";
import formatNumberAsMoney from "../utils/formatNumberAsMoney";

const exampleData : {orders: Order[]} = {
  "orders": [
    {
      "id": "1",
      "dateTime": moment("2025-05-28T04:25:57.8559645Z"),
      "noCharge": false,
      "paymentMethod": "Cash",
      "items": [
        {
          "id": "1",
          "name": "Product 1",
          "quantity": 2,
          "price": 10,
          "cost": 5,
          "noCharge": false
        },
        {
          "id": "2",
          "name": "Product 2",
          "quantity": 1,
          "price": 20,
          "cost": 8,
          "noCharge": false
        }
      ]
    },
    {
      "id": "2",
      "dateTime": moment("2025-05-27T04:25:57.8566205Z"),
      "noCharge": true,
      "paymentMethod": null,
      "items": [
        {
          "id": "3",
          "name": "Product 3",
          "quantity": 3,
          "price": 30,
          "cost": 15,
          "noCharge": false
        }
      ]
    },
    {
      "id": "3",
      "dateTime": moment("2025-05-28T04:25:57.8566974Z"),
      "noCharge": false,
      "paymentMethod": "Cash",
      "items": [
        {
          "id": "4",
          "name": "Product 1",
          "quantity": 2,
          "price": 10,
          "cost": 5,
          "noCharge": false
        },
        {
          "id": "4",
          "name": "Product 2",
          "quantity": 1,
          "price": 20,
          "cost": 8,
          "noCharge": true
        }
      ]
    }
  ]
}

export default function Orders() {

    const [orders] = useState<Order[]>(exampleData.orders);

    const rows = useMemo(() => {
        return orders.map(order => ({
            id: order.id,
            time: order.dateTime.format("HH:mm"),
            description: order.items.map(item => `${item.name} x${item.quantity}`).join(", "),
            paymentMethod: order.paymentMethod || "N/A",
            totalCost: order.items.reduce((total, item) => total + item.cost * item.quantity, 0),
            totalCharge: order.noCharge? 0 : order.items.reduce((total, item) => total + item.price * item.quantity * (item.noCharge? 0 : 1), 0),
        }));
    }
    , [orders]);

    return (
        <Box>
            <Table>
                <thead>
                    <tr>
                        <th>
                            <Typography level="body-md" fontWeight="md">
                                Hora
                            </Typography>
                        </th>
                        <th>
                            <Typography level="body-md" fontWeight="md">
                                Descripción
                            </Typography>
                        </th>
                        <th>
                            <Typography level="body-md" fontWeight="md">
                                Metodo de Pago
                            </Typography>
                        </th>
                        <th>
                            <Typography level="body-md" fontWeight="md">
                                Costo
                            </Typography>
                        </th>
                        <th>
                            <Typography level="body-md" fontWeight="md">
                                Cargo
                            </Typography>
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.time}</td>
                            <td>{row.description}</td>
                            <td>{row.paymentMethod}</td>
                            <td>{formatNumberAsMoney(row.totalCost)}</td>
                            <td>{!row.totalCharge? "Sin cargo" : formatNumberAsMoney(row.totalCharge)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                            <Typography level="body-lg" fontWeight="lg">Total</Typography>
                        </td>
                        <td>
                            <Typography level="body-lg" fontWeight="lg">
                                {formatNumberAsMoney(rows.reduce((total, row) => total + row.totalCost, 0))}
                            </Typography>
                        </td>
                        <td>
                            <Typography level="body-lg" fontWeight="lg">
                                {formatNumberAsMoney(rows.reduce((total, row) => total + row.totalCharge, 0))}
                            </Typography>
                        </td>
                    </tr>
                </tfoot>
            </Table>
            </Box>
  );
}