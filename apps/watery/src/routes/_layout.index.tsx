import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getOrdersByUserId, getUserById, type User } from "@waterfalls/api";
import { queryClient } from "../../lib/qc";

const USER_ID = 1;

const userQueryOptions = queryOptions({
  queryKey: ["user", USER_ID],
  queryFn: async () => {
    return getUserById(USER_ID);
  },
});

export const Route = createFileRoute("/_layout/")({
  component: App,
  loader: async () => {
    return queryClient.ensureQueryData(userQueryOptions);
  },
});

function App() {
  const { data } = useSuspenseQuery(userQueryOptions);

  return (
    <div className="text-center">
      <Body user={data} />
    </div>
  );
}

function Body({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>Orders</h2>
      <ul>
        <ProductOrders user={user} />
      </ul>
      {/* )} */}

      <hr />
      <Outlet />
    </div>
  );
}

function ProductOrders({ user }: { user: User }) {
  const { data } = useQuery({
    queryKey: ["orders", user.id],
    queryFn: async () => {
      return getOrdersByUserId(user.id);
    },
  });

  if (!data) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return data.map((order) => (
    <li key={order.orderId}>
      {order.productName} x {order.quantity}
    </li>
  ));
}
