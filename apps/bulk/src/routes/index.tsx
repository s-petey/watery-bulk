import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getOrdersByUserId,
  getUiContentById,
  getUserById,
  getUserUis,
  type UiContent,
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

const USER_ID = 2;

function useLoadAllData() {
  return useQuery({
    queryKey: ["load-all-data"],
    queryFn: async () => {
      const user = await getUserById(USER_ID);
      const productOrders = await getOrdersByUserId(user.id);
      const userUis = await getUserUis(user.id);

      console.log({ userUis });
      const uiContent = await Promise.all(
        userUis.map((ui) => getUiContentById(ui.id))
      );

      return { user, productOrders, userUis, uiContent };
    },
  });
}

function App() {
  const { data } = useLoadAllData();

  if (!data) {
    return null;
  }

  return (
    <div className="text-center">
      <Body data={data} />
    </div>
  );
}

function Body({
  data,
}: {
  data: NonNullable<ReturnType<typeof useLoadAllData>["data"]>;
}) {
  const params = Route.useSearch();

  const content = data.uiContent.find(
    (content) => content.uiId === Number(params.uiPage)
  );

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
            {data.userUis.map((userUi) => (
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
            ))}
          </ul>
        </nav>
      </header>

      {params.uiPage && content ? (
        <UiContent content={content} />
      ) : (
        <div>
          <h1>{data.user.name}</h1>
          <h2>Orders</h2>
          <ul>
            {data.productOrders.map((order) => (
              <li key={order.orderId}>
                {order.productName} x {order.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function UiContent({ content }: { content: UiContent }) {
  return (
    <div>
      <h2>{content.id}</h2>
      {content.content}
    </div>
  );
}
