import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { getUserById, getUserUis } from "@waterfalls/api";
import { queryClient } from "../../lib/qc";

const USER_ID = 1;

const userQueryOptions = queryOptions({
  queryKey: ["user", USER_ID],
  queryFn: async () => {
    return getUserById(USER_ID);
  },
});

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
  loader: async () => {
    return queryClient.ensureQueryData(userQueryOptions);
  },
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(userQueryOptions);
  const { data } = useQuery({
    queryKey: ["content", user.id],
    queryFn: async () => {
      return getUserUis(user.id);
    },
  });

  return (
    <>
      <header className="flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <nav className="mb-4">
          <ul className="flex justify-center space-x-4">
            <li className="text-blue-500 hover:underline">
              <Link to="/">Home</Link>
            </li>

            {!data?.length ? (
              <>
                <li>Loading...</li>
              </>
            ) : (
              data.map((userUi) => (
                <li key={userUi.id} className="text-blue-500 hover:underline">
                  <Link to="/ui/$uiId" params={{ uiId: userUi.id.toString() }}>
                    {userUi.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  );
}
