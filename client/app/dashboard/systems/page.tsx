import { getAllSystems } from "@/lib/api";
import { SystemsTable } from "@/components/dashboard/systems-table";

export default async function SystemsPage() {
  const systems = await getAllSystems();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Systems</h1>
        <p className="text-muted-foreground">
          View and manage all your monitored systems
        </p>
      </div>
      
      <SystemsTable data={systems} />
    </div>
  );
}