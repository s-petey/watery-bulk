import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getUiContentById } from "@waterfalls/api";
import { queryClient } from "../../lib/qc";

const contentUiIdOptions = (uiId: number) =>
  queryOptions({
    queryKey: ["ui", uiId],
    queryFn: async () => {
      return getUiContentById(Number(uiId));
    },
  });

export const Route = createFileRoute("/_layout/ui/$uiId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return queryClient.ensureQueryData(contentUiIdOptions(Number(params.uiId)));
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(
    contentUiIdOptions(Number(Route.useParams().uiId))
  );

  return (
    <div className="text-center">
      <h2>{data.id}</h2>
      {data.content}
    </div>
  );
}
