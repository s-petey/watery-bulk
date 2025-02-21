import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getOrdersByUserId,
  getUiContentById,
  getUserById,
  getUserUis,
  type UiContent,
  type User,
} from "@waterfalls/api";
import { useQuery } from "@tanstack/react-query";

type HomeSearch = {
  uiPage: string | null;
};

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const uiPage = search["uiPage"];

    return {
      uiPage: typeof uiPage === "string" && uiPage.length ? uiPage : null,
    };
  },
});

const USER_ID = 1;

function App() {
  const { data } = useQuery({
    queryKey: ["user", USER_ID],
    queryFn: async () => {
      return getUserById(USER_ID);
    },
  });

  if (!data) {
    return null;
  }

  return (
    <div className="text-center">
      <Body user={data} />
    </div>
  );
}

function Body({ user }: { user: User }) {
  const params = Route.useSearch();
  const { data } = useQuery({
    queryKey: ["content", user.id],
    queryFn: async () => {
      return getUserUis(user.id);
    },
  });

  return (
    <div>
      <header className="flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <nav className="mb-4">
          <ul className="flex justify-center space-x-4">
            <li className="text-blue-500 hover:underline">
              <Link to="/" search={{ uiPage: null }}>
                Home
              </Link>
            </li>

            {!data?.length ? (
              <>
                <li>Loading...</li>
              </>
            ) : (
              data.map((userUi) => (
                <li key={userUi.id} className="text-blue-500 hover:underline">
                  <Link
                    to="/"
                    search={{
                      uiPage: userUi.id.toString(),
                    }}
                  >
                    {userUi.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>
      </header>

      {params.uiPage ? (
        <UiContent uiId={params.uiPage} />
      ) : (
        <div>
          <h1>{user.name}</h1>
          <h2>Orders</h2>
          <ul>
            <ProductOrders user={user} />
          </ul>
          <h2>User UIs</h2>
        </div>
      )}
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

function UiContent({ uiId }: { uiId: string }) {
  const { data } = useQuery({
    queryKey: ["content", uiId],
    queryFn: async () => {
      return getUiContentById(Number(uiId));
    },
  });

  if (!data) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{data.id}</h2>
      {data.content}
    </div>
  );
}
